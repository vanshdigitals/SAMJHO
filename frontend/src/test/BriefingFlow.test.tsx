import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BriefingPage } from '../pages/BriefingPage';
import { HelpPage } from '../pages/HelpPage';
import * as api from '../lib/api';
import { markDocumentDeleted } from '../lib/documentState';

// Mock getAnalysis, startAnalysis, and getSourceSpan
vi.mock('../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../lib/api')>('../lib/api');
  return {
    ...actual,
    getAnalysis: vi.fn(),
    startAnalysis: vi.fn(),
    deleteDocument: vi.fn(),
    getSourceSpan: vi.fn(),
  };
});

const mockRealAnalysis: api.AnalysisResponse = {
  document_id: 'real-uuid-1234',
  language: 'en',
  document_type: 'Residential Tenancy Agreement',
  type_confidence: 0.95,
  summary: 'A real 11-month lease agreement for Apartment 4B.',
  urgency: {
    level: 'LOW',
    reason: '',
    deadline_date: null,
    evidence: null,
  },
  what_this_is: {
    id: 'wti-1',
    title: 'Tenancy Summary',
    what_document_says: {
      source_id: 'src-wti-uuid',
      quoted_text: 'Agreement between Landlord and Tenant for Apartment 4B.',
      page: 1,
      verified: true,
    },
    ai_interpretation: 'A real residential lease for Apartment 4B.',
    confidence: 0.95,
    needs_verification: false,
  },
  obligations: [
    {
      id: 'obl-1',
      title: 'Maintenance Payment',
      what_document_says: {
        source_id: 'src-obl-1-uuid',
        quoted_text: 'Pay society maintenance by the 5th of each month.',
        page: 2,
        verified: true,
      },
      ai_interpretation: 'Pay maintenance fees directly to society.',
      confidence: 0.9,
      needs_verification: false,
      who: 'tenant',
      when: 'monthly',
    },
  ],
  risks: [
    {
      id: 'risk-1',
      title: 'Painting Charges Deduction',
      what_document_says: {
        quoted_text: 'One month rent will be deducted towards painting costs upon vacating.',
        page: 3,
        verified: true,
      },
      ai_interpretation: 'One month rent is permanently deducted for painting.',
      confidence: 0.88,
      needs_verification: true,
      severity: 'HIGH',
      why_it_matters: 'Non-refundable deduction from security deposit.',
    },
  ],
  money_items: [
    {
      id: 'money-1',
      title: 'Security Deposit',
      what_document_says: {
        quoted_text: 'Refundable security deposit of Rs. 60,000.',
        page: 2,
        verified: true,
      },
      ai_interpretation: 'Security deposit amount.',
      confidence: 0.95,
      needs_verification: false,
      label: 'Security deposit',
      amount_text: '₹60,000',
      amount_value: 60000,
      currency: 'INR',
    },
  ],
  deadlines: [
    {
      id: 'dead-1',
      title: 'Agreement Commencement',
      what_document_says: {
        quoted_text: 'Lease commences on 1st December 2026.',
        page: 1,
        verified: true,
      },
      ai_interpretation: 'Starts 1 December 2026.',
      confidence: 0.92,
      needs_verification: true,
      label: 'Lease starts',
      date_text: '1 December 2026',
      resolved_date: '2026-12-01',
      is_relative: false,
    },
  ],
  questions: [
    {
      id: 'q-1',
      text: 'Are society maintenance charges subject to annual escalation?',
      rationale: 'Clause 5 does not specify whether maintenance charges remain fixed during the term.',
    },
  ],
  next_steps: [
    {
      id: 'ns-1',
      step: 'Obtain copy of society rules and parking allocation slip.',
      type: 'information',
      is_advice: false,
    },
  ],
  uncertainty: [
    'Whether clubhouse charges are included in monthly maintenance.',
  ],
  conflicts: [],
  source_metadata: {
    page_count: 5,
    ocr_used: false,
    ocr_confidence: null,
    extraction_char_count: 6100,
    dropped_item_count: 0,
    model_version: 'gemini-2.5-flash',
    prompt_version: 'v1.0',
  },
  disclaimer: 'Samjo gives legal information to help you understand your document.',
};

function renderWithProviders(ui: React.ReactElement, initialRoute: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Real Document Briefing Flow Invariants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getAnalysis).mockResolvedValue({
      status: 'processing',
      stage: 'extracting',
    });
  });

  // Test 1: /d/sample demo route intentionally renders SAMPLE fixture
  it('renders SAMPLE data for /d/sample demo route', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/sample',
    );

    // Should render sample notice to vacate content
    expect(screen.getByText('A notice to vacate')).toBeInTheDocument();
    expect(screen.getByText(/You have 30 days from 14 March to respond/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pay the outstanding rent of ₹25,000/i).length).toBeGreaterThan(0);
    // api.getAnalysis must NOT be called for sample
    expect(api.getAnalysis).not.toHaveBeenCalled();
  });

  // Test 2: Real UUID in LOADING state renders Skeleton, NEVER SAMPLE data
  it('renders loading skeleton and NEVER SAMPLE data for a real UUID during loading', async () => {
    // getAnalysis returns processing state
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'processing',
      stage: 'extracting',
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-1234',
    );

    // Skeleton must be active with aria-busy="true"
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(/Loading document briefing/i)).toBeInTheDocument();

    // Critical safety invariant: ZERO fabricated sample legal data
    expect(screen.queryByText(/Notice to vacate/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/₹25,000/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/30 days/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Clause 3 · Termination/i)).not.toBeInTheDocument();
  });

  // Test 3: Real UUID in FAILED state renders typed error and Retry, NEVER SAMPLE data
  it('renders typed error UI with Retry and NEVER SAMPLE data when backend fails with AI_UNAVAILABLE', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'failed',
      error_code: 'AI_UNAVAILABLE',
      message: "Samjo read your document but couldn't finish the briefing. Your file is still here. Try again.",
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-1234',
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText('Analysis service busy')).toBeInTheDocument();
    expect(
      screen.getByText("Samjo read your document but couldn't finish the briefing. Your file is still here. Try again."),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();

    // Critical safety invariant: NO fabricated sample data
    expect(screen.queryByText(/Notice to vacate/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/₹25,000/i)).not.toBeInTheDocument();
  });

  // Test 4: Real UUID with RATE_LIMITED error
  it('renders rate limited error for real UUID and offers retry', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'failed',
      error_code: 'RATE_LIMITED',
      message: 'Too many requests.',
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-1234',
    );

    await waitFor(() => {
      expect(screen.getByText('Too many requests')).toBeInTheDocument();
    });
    expect(screen.getByText(/Samjo is busy right now. Please wait a minute before trying again./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
    expect(screen.queryByText(/Notice to vacate/i)).not.toBeInTheDocument();
  });

  // Test 5: Real UUID with EXTRACTION_EMPTY error
  it('renders unreadable file error for EXTRACTION_EMPTY and links to /upload', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'failed',
      error_code: 'EXTRACTION_EMPTY',
      message: 'Empty text layer.',
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-1234',
    );

    await waitFor(() => {
      expect(screen.getByText("Samjo couldn't read this document")).toBeInTheDocument();
    });
    expect(screen.getByText(/It looks like a scan with no text layer/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Upload a different document/i })).toBeInTheDocument();
    expect(screen.queryByText(/Notice to vacate/i)).not.toBeInTheDocument();
  });

  // Test 6: Distinguish 404 (Document not found) vs Deleted document
  it('renders "Document not found" when 404 and document was not deleted', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'failed',
      error_code: 'NOT_FOUND',
      message: 'Document not found.',
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/non-existent-uuid',
    );

    await waitFor(() => {
      expect(screen.getByText('Document not found')).toBeInTheDocument();
    });
    expect(screen.getByText(/This document may have expired after 24 hours, or the link is incorrect./i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Upload a document/i })).toBeInTheDocument();
    expect(screen.queryByText(/^Deleted$/i)).not.toBeInTheDocument();
  });

  // Test 7: Document deleted explicitly renders DeletedState
  it('renders Deleted state when document was marked deleted by the user', async () => {
    markDocumentDeleted('deleted-uuid-999');

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/deleted-uuid-999',
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Deleted' })).toBeInTheDocument();
    expect(screen.getByText(/The document, the text read out of it and the briefing are gone/i)).toBeInTheDocument();
    expect(screen.queryByText('Document not found')).not.toBeInTheDocument();
  });

  // Test 8: Real UUID in COMPLETE state renders real backend briefing, NEVER SAMPLE data
  it('renders real backend briefing data when analysis is complete for a real UUID', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'complete',
      data: mockRealAnalysis,
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-1234',
    );

    await waitFor(() => {
      expect(screen.getByText('Residential Tenancy Agreement')).toBeInTheDocument();
    });

    // Real content rendered
    expect(screen.getAllByText(/A real residential lease for Apartment 4B/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pay maintenance fees directly to society/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/One month rent is permanently deducted for painting/i).length).toBeGreaterThan(0);
    expect(screen.getByText('₹60,000')).toBeInTheDocument();

    // Critical safety invariant: Fabricated sample content MUST NOT be present
    expect(screen.queryByText(/Notice to vacate/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/₹25,000/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/30 days/i)).not.toBeInTheDocument();
  });

  // Test 9: Real UUID /d/:id/help renders HelpSkeleton during loading, NEVER sample questions
  it('renders HelpSkeleton for real UUID during loading and NEVER sample questions', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'processing',
      stage: 'analyzing',
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id/help" element={<HelpPage />} />
      </Routes>,
      '/d/real-uuid-1234/help',
    );

    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(/Loading help questions/i)).toBeInTheDocument();

    // Fabricated sample questions MUST NOT appear
    expect(screen.queryByText(/What is the ₹25,000 in arrears made up of/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Does the notice period run from the date on the letter/i)).not.toBeInTheDocument();
  });

  // Test 10: Real UUID /d/:id/help renders real questions and rationale when complete
  it('renders real questions and LLM rationale on /d/:id/help when analysis is complete', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'complete',
      data: mockRealAnalysis,
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id/help" element={<HelpPage />} />
      </Routes>,
      '/d/real-uuid-1234/help',
    );

    await waitFor(() => {
      expect(screen.getByText(/Are society maintenance charges subject to annual escalation/i)).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Clause 5 does not specify whether maintenance charges remain fixed during the term/i),
    ).toBeInTheDocument();

    // Fabricated sample questions MUST NOT appear
    expect(screen.queryByText(/What is the ₹25,000 in arrears made up of/i)).not.toBeInTheDocument();
  });

  // Test 11: /d/sample/help intentionally renders sample questions
  it('renders sample questions on /d/sample/help', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/d/:id/help" element={<HelpPage />} />
      </Routes>,
      '/d/sample/help',
    );

    expect(screen.getByText(/What is the ₹25,000 in arrears made up of/i)).toBeInTheDocument();
    expect(api.getAnalysis).not.toHaveBeenCalled();
  });

  // Test 12: SCHEMA_INVALID error UI
  it('handles SCHEMA_INVALID error with retryable message', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'failed',
      error_code: 'SCHEMA_INVALID',
      message: "Samjo read your document but couldn't finish the briefing.",
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-schema-error',
    );

    await waitFor(() => {
      expect(screen.getByText("Couldn't finish the briefing")).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
    expect(screen.queryByText(/Notice to vacate/i)).not.toBeInTheDocument();
  });

  // Test 13: ANALYSIS_TIMEOUT error UI
  it('handles ANALYSIS_TIMEOUT error with retryable message', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'failed',
      error_code: 'ANALYSIS_TIMEOUT',
      message: 'Analysis timed out.',
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-timeout',
    );

    await waitFor(() => {
      expect(screen.getByText('Analysis took too long')).toBeInTheDocument();
    });
    expect(screen.getByText(/Samjo took too long reading this document. Your file is still here. Try again./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
  });

  // Test 14: OCR_UNAVAILABLE error UI
  it('handles OCR_UNAVAILABLE error and offers retry', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'failed',
      error_code: 'OCR_UNAVAILABLE',
      message: 'OCR unavailable.',
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-ocr-error',
    );

    await waitFor(() => {
      expect(screen.getByText('OCR is currently unavailable')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Try again/i })).toBeInTheDocument();
  });

  // Test 15: QUOTA_EXHAUSTED error UI
  it('handles QUOTA_EXHAUSTED error without retry', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'failed',
      error_code: 'QUOTA_EXHAUSTED',
      message: 'Daily limit reached.',
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-quota',
    );

    await waitFor(() => {
      expect(screen.getByText('Daily processing limit reached')).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /Try again/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Upload a different document/i })).toBeInTheDocument();
  });

  // Test 16: NOT_LEGAL_DOCUMENT error UI links to /situation
  it('handles NOT_LEGAL_DOCUMENT error and provides link to situation flow', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'failed',
      error_code: 'NOT_LEGAL_DOCUMENT',
      message: 'Not a legal document.',
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-not-legal',
    );

    await waitFor(() => {
      expect(screen.getByText("This doesn't look like a legal document")).toBeInTheDocument();
    });
    const link = screen.getByRole('link', { name: /Tell us what happened/i });
    expect(link).toHaveAttribute('href', '/situation');
    expect(screen.queryByText(/Notice to vacate/i)).not.toBeInTheDocument();
  });

  // Test 17: Clicking evidence marker triggers getSourceSpan and renders surrounding context
  it('triggers getSourceSpan and renders surrounding context on marker click', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'complete',
      data: mockRealAnalysis,
    });

    vi.mocked(api.getSourceSpan).mockResolvedValueOnce({
      source_id: 'src-obl-1-uuid',
      page: 2,
      quoted_text: 'Pay society maintenance by the 5th of each month.',
      context_before: 'Clause 4.2: Regular Outgoings. ',
      context_after: ' Failure to remit on time incurs a late surcharge.',
      start_offset: 120,
      end_offset: 172,
      verified: true,
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-1234',
    );

    await waitFor(() => {
      expect(screen.getByText('Pay maintenance fees directly to society.')).toBeInTheDocument();
    });

    // Find and click the evidence marker for obl-1
    const marker = screen.getByRole('button', {
      name: /Where this comes from: Pay maintenance fees directly to society\./i,
    });
    expect(marker).toBeInTheDocument();
    fireEvent.click(marker);

    // Verify getSourceSpan was called with correct documentId and sourceId
    await waitFor(() => {
      expect(api.getSourceSpan).toHaveBeenCalledWith('real-uuid-1234', 'src-obl-1-uuid');
    });

    // Verify quote and surrounding context are displayed in evidence
    await waitFor(() => {
      expect(screen.getByText('Clause 4.2: Regular Outgoings.')).toBeInTheDocument();
      expect(screen.getByText(/Failure to remit on time incurs a late surcharge\./i)).toBeInTheDocument();
      expect(screen.getByText(/Page 2/i)).toBeInTheDocument();
    });
  });

  // Test 18: Demo /sample route uses synthetic evidence without calling getSourceSpan
  it('does not invoke getSourceSpan on the sample demo route', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/sample',
    );

    expect(screen.getByText('A notice to vacate')).toBeInTheDocument();

    const markers = screen.getAllByRole('button', { name: /Where this comes from/i });
    expect(markers.length).toBeGreaterThan(0);
    fireEvent.click(markers[0]);

    // getSourceSpan should never be called on sample
    expect(api.getSourceSpan).not.toHaveBeenCalled();
    expect(screen.getByText('Document says')).toBeInTheDocument();
  });

  // Test 19: next_steps survives as a list, not a joined paragraph
  it('renders each next step as its own list item', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValue({
      status: 'complete',
      data: {
        ...mockRealAnalysis,
        next_steps: [
          { id: 'ns-a', step: 'Collect your rent receipts.', type: 'prepare', is_advice: false },
          { id: 'ns-b', step: 'Ask the society for the parking slip.', type: 'information', is_advice: false },
          { id: 'ns-c', step: 'Take the agreement to a lawyer.', type: 'see_professional', is_advice: false },
        ],
      },
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-1234',
    );

    const first = await screen.findByText('Collect your rent receipts.');
    // Each step is a separate <li>, so the three are not one run-on string.
    expect(first.closest('li')).not.toBeNull();
    expect(screen.getByText('Ask the society for the parking slip.').closest('li')).not.toBeNull();
    expect(screen.getByText('Take the agreement to a lawyer.').closest('li')).not.toBeNull();
    expect(
      first.closest('li') === screen.getByText('Take the agreement to a lawyer.').closest('li'),
    ).toBe(false);
    // Ordered, because the order the analysis returned them in is meaningful.
    expect(first.closest('ol')).not.toBeNull();
  });

  // Test 20: conflicts[] reaches the screen with the document's own words
  it('renders conflicts with their source spans when the analysis returns them', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValue({
      status: 'complete',
      data: {
        ...mockRealAnalysis,
        conflicts: [
          {
            id: 'cf-1',
            description: 'The notice period is stated as both 30 days and one month.',
            note: 'These parts appear to conflict. Worth checking with a professional.',
            spans: [
              {
                source_id: 'src-cf-1a',
                quoted_text: 'thirty (30) days written notice',
                page: 1,
                verified: true,
              },
              {
                source_id: 'src-cf-1b',
                quoted_text: 'one calendar month of notice',
                page: 3,
                verified: true,
              },
            ],
          },
        ],
      },
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-1234',
    );

    expect(await screen.findByText('Potential inconsistencies')).toBeInTheDocument();
    expect(
      screen.getByText('The notice period is stated as both 30 days and one month.'),
    ).toBeInTheDocument();
    // Both sides quoted verbatim, each with the page it sits on.
    expect(screen.getByText(/thirty \(30\) days written notice/)).toBeInTheDocument();
    expect(screen.getByText(/one calendar month of notice/)).toBeInTheDocument();
    expect(screen.getByText('Page 1')).toBeInTheDocument();
    expect(screen.getByText('Page 3')).toBeInTheDocument();
  });

  // Test 21: an empty conflicts list renders no section at all
  it('renders no inconsistencies section when conflicts is empty', async () => {
    vi.mocked(api.getAnalysis).mockResolvedValue({
      status: 'complete',
      data: { ...mockRealAnalysis, conflicts: [] },
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-1234',
    );

    await screen.findByText('Pay maintenance fees directly to society.');
    expect(screen.queryByText('Potential inconsistencies')).not.toBeInTheDocument();
  });

  // Test 22: Conflict has no title field — the UI must not invent one.
  // Guards against a future edit reintroducing `conflict.title`.
  it('does not render a fabricated conflict title', async () => {
    const conflict = {
      id: 'cf-2',
      description: 'Rent is given as two different amounts.',
      note: '',
      spans: [
        { source_id: 'src-cf-2', quoted_text: 'Rs. 12,000/- per month', page: 1, verified: true },
      ],
    };
    expect('title' in conflict).toBe(false);

    vi.mocked(api.getAnalysis).mockResolvedValue({
      status: 'complete',
      data: { ...mockRealAnalysis, conflicts: [conflict] },
    });

    renderWithProviders(
      <Routes>
        <Route path="/d/:id" element={<BriefingPage />} />
      </Routes>,
      '/d/real-uuid-1234',
    );

    expect(await screen.findByText('Rent is given as two different amounts.')).toBeInTheDocument();
    // The description is the only prose; no heading is derived from the conflict.
    expect(screen.queryByText('conflict-id')).not.toBeInTheDocument();
    expect(screen.queryByText('undefined')).not.toBeInTheDocument();
    // An empty note contributes nothing rather than an empty paragraph.
    expect(screen.queryByText(/Worth checking with a professional/)).not.toBeInTheDocument();
  });
});
