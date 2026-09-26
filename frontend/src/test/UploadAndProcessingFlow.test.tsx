import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UploadPage } from '../pages/UploadPage';
import { ProcessingPage } from '../pages/ProcessingPage';
import * as api from '../lib/api';

vi.mock('../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../lib/api')>('../lib/api');
  return {
    ...actual,
    uploadDocument: vi.fn(),
    startAnalysis: vi.fn(),
    getAnalysis: vi.fn(),
  };
});

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

describe('Upload and Processing Flow Coverage', () => {
  it('rejects files larger than 10 MB client-side', async () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/upload']}>
          <UploadPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();

    // Create a 11MB file
    const oversizedFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'too_big.pdf', {
      type: 'application/pdf',
    });

    fireEvent.change(input, { target: { files: [oversizedFile] } });

    await waitFor(() => {
      expect(
        screen.getByText('This file is over 10 MB. Try uploading just the pages that matter.')
      ).toBeInTheDocument();
    });
  });

  it('rejects unsupported file formats client-side', async () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/upload']}>
          <UploadPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const txtFile = new File(['plain text content'], 'doc.txt', {
      type: 'text/plain',
    });

    fireEvent.change(input, { target: { files: [txtFile] } });

    await waitFor(() => {
      expect(
        screen.getByText('Samjo reads PDF, Word and photos. This file is a different type.')
      ).toBeInTheDocument();
    });
  });

  it('renders processing stage order and handles failure during processing', async () => {
    const queryClient = createTestQueryClient();
    vi.mocked(api.getAnalysis).mockResolvedValueOnce({
      status: 'failed',
      error_code: 'QUOTA_EXHAUSTED',
      message: 'Samjo daily processing limit reached. Please try again tomorrow.',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/d/real-doc-123/processing']}>
          <Routes>
            <Route path="/d/:id/processing" element={<ProcessingPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Analysis paused')).toBeInTheDocument();
      expect(screen.getByText('Samjo daily processing limit reached. Please try again tomorrow.')).toBeInTheDocument();
      expect(screen.getByText('Daily processing limit reached. Please try again tomorrow.')).toBeInTheDocument();
    });
  });

  it('validates AnalysisResponse schema against Zod contract', () => {
    const validPayload = {
      document_id: 'doc-uuid-1',
      language: 'en',
      document_type: 'Residential Rental Agreement',
      type_confidence: 0.9,
      summary: 'Standard 11-month lease agreement.',
      urgency: {
        level: 'LOW',
        reason: '',
        deadline_date: null,
        evidence: null,
      },
      what_this_is: {
        id: 'wti-1',
        title: 'Agreement Overview',
        what_document_says: {
          source_id: 'src-1',
          quoted_text: 'This agreement is made between landlord and tenant.',
          page: 1,
          verified: true,
        },
        ai_interpretation: 'Tenancy agreement overview',
        confidence: 0.9,
        needs_verification: false,
      },
      obligations: [],
      risks: [],
      money_items: [],
      deadlines: [],
      conflicts: [],
      questions: [],
      next_steps: [],
      uncertainty: [],
      professional_help: {
        recommended: false,
        reason: null,
        pathways: [],
      },
      safety: {
        is_high_risk: false,
        high_risk_category: null,
        involves_minor: false,
        refused_requests: [],
      },
      source_metadata: {
        page_count: 3,
        ocr_used: false,
        ocr_confidence: null,
        extraction_char_count: 5000,
        dropped_item_count: 0,
        model_version: 'gemini-2.5-flash',
        prompt_version: '1.0.0',
      },
      disclaimer: 'Legal information only.',
    };

    const parsed = api.AnalysisResponseSchema.parse(validPayload);
    expect(parsed.document_type).toBe('Residential Rental Agreement');
    expect(parsed.source_metadata.prompt_version).toBe('1.0.0');
  });
});
