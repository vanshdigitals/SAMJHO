import { z } from 'zod';

const API_BASE =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ||
  '/api/v1';

/* ── Zod Schemas Mirroring Pydantic Contracts (RESOURCE_AUDIT §11) ──────── */

/* These mirror backend/app/schemas/ai.py field for field.

   The Pydantic contract is the source of truth; this is the copy that runs in
   the reader's browser. Keeping them identical is the whole point — when they
   drift, the parse fails loudly here instead of rendering a blank section.
   (It already caught one drift: this file previously described a contract the
   backend never emitted, so a completed analysis never parsed and the
   processing screen polled for ever.) */

export const SourceSpanSchema = z.object({
  source_id: z.string().nullable().optional(),
  quoted_text: z.string(),
  page: z.number(),
  start_offset: z.number().nullable().optional(),
  end_offset: z.number().nullable().optional(),
  verified: z.boolean().default(false),
});

export type SourceSpan = z.infer<typeof SourceSpanSchema>;

const AnalysisItemFields = {
  id: z.string(),
  title: z.string().default(''),
  what_document_says: SourceSpanSchema,
  ai_interpretation: z.string().default(''),
  confidence: z.number().default(1),
  needs_verification: z.boolean().default(false),
};

export const ObligationSchema = z.object({
  ...AnalysisItemFields,
  who: z.string().default('you'),
  when: z.string().nullable().optional(),
});

export type Obligation = z.infer<typeof ObligationSchema>;

export const RiskSchema = z.object({
  ...AnalysisItemFields,
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  why_it_matters: z.string().default(''),
});

export type Risk = z.infer<typeof RiskSchema>;

export const MoneyItemSchema = z.object({
  ...AnalysisItemFields,
  label: z.string().default('detail'),
  amount_text: z.string().default(''),
  amount_value: z.number().nullable().optional(),
  currency: z.string().default('INR'),
});

export type MoneyItem = z.infer<typeof MoneyItemSchema>;

export const DeadlineSchema = z.object({
  ...AnalysisItemFields,
  label: z.string().default('date'),
  date_text: z.string().default(''),
  resolved_date: z.string().nullable().optional(),
  is_relative: z.boolean().default(false),
});

export type Deadline = z.infer<typeof DeadlineSchema>;

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  rationale: z.string().default(''),
});

export const NextStepSchema = z.object({
  id: z.string(),
  step: z.string(),
  type: z.string().default('information'),
  is_advice: z.boolean().default(false),
});

export const UrgencyAssessmentSchema = z.object({
  level: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('LOW'),
  reason: z.string().default(''),
  deadline_date: z.string().nullable().optional(),
  evidence: SourceSpanSchema.nullable().optional(),
});

export const ProfessionalHelpSchema = z.object({
  recommended: z.boolean().default(false),
  reason: z.string().nullable().optional(),
  pathways: z.array(z.string()).default([]),
});

export const SafetyFlagsSchema = z.object({
  is_high_risk: z.boolean().default(false),
  high_risk_category: z.string().nullable().optional(),
  involves_minor: z.boolean().default(false),
  refused_requests: z.array(z.string()).default([]),
});

export const ConflictSchema = z.object({
  id: z.string().default('conflict-id'),
  description: z.string().default(''),
  spans: z.array(SourceSpanSchema).default([]),
  note: z.string().default(''),
});

export const SourceMetadataSchema = z.object({
  page_count: z.number().default(1),
  ocr_used: z.boolean().default(false),
  ocr_confidence: z.number().nullable().optional(),
  extraction_char_count: z.number().default(0),
  dropped_item_count: z.number().default(0),
  model_version: z.string().default(''),
  prompt_version: z.string().default(''),
});

export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;

export const AnalysisResponseSchema = z.object({
  document_id: z.string().default(''),
  language: z.string().default('en'),
  document_type: z.string().default(''),
  type_confidence: z.number().default(0),
  summary: z.string().default(''),
  urgency: UrgencyAssessmentSchema,
  what_this_is: z.object(AnalysisItemFields).nullable().optional(),
  obligations: z.array(ObligationSchema).default([]),
  risks: z.array(RiskSchema).default([]),
  money_items: z.array(MoneyItemSchema).default([]),
  deadlines: z.array(DeadlineSchema).default([]),
  questions: z.array(QuestionSchema).default([]),
  next_steps: z.array(NextStepSchema).default([]),
  uncertainty: z.array(z.string()).default([]),
  conflicts: z.array(ConflictSchema).default([]),
  professional_help: ProfessionalHelpSchema.optional(),
  safety: SafetyFlagsSchema.optional(),
  source_metadata: SourceMetadataSchema,
  disclaimer: z.string().default(''),
});

export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;

export const JobStatusResponseSchema = z.object({
  document_id: z.string(),
  status: z.enum(['processing', 'complete', 'failed']),
  stage: z.enum([
    'extracting',
    'ocr',
    'characterizing',
    'extracting_facts',
    'analyzing',
    'verifying',
    'complete',
  ]),
  error_code: z.string().nullable().optional(),
  error_message: z.string().nullable().optional(),
});

export type JobStatusResponse = z.infer<typeof JobStatusResponseSchema>;

export const SourceDetailSchema = z.object({
  source_id: z.string(),
  page: z.number().default(1),
  quoted_text: z.string(),
  start_offset: z.number().nullable().optional(),
  end_offset: z.number().nullable().optional(),
  context_before: z.string().default(''),
  context_after: z.string().default(''),
  verified: z.boolean().default(true),
});

export type SourceDetail = z.infer<typeof SourceDetailSchema>;

export const SituationCreateResponseSchema = z.object({
  situation_id: z.string(),
  clarifying_questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
    }),
  ),
});

export type SituationCreateResponse = z.infer<typeof SituationCreateResponseSchema>;

export const SituationAnalyzeResponseSchema = z.object({
  situation_id: z.string(),
  characterization: z.record(z.string(), z.any()),
  what_we_know: z.array(z.string()),
  what_is_missing: z.array(z.string()),
  possible_next_steps: z.array(z.record(z.string(), z.any())),
  questions_for_professional: z.array(z.string()),
  professional_help: z.record(z.string(), z.any()),
  disclaimer: z.string(),
});

export type SituationAnalyzeResponse = z.infer<typeof SituationAnalyzeResponseSchema>;

/* ── HTTP Client with CSRF & Credentials (RESOURCE_AUDIT §11.1) ─────────── */

export class ApiError extends Error {
  code: string;
  statusCode: number;
  retryable: boolean;

  constructor(code: string, message: string, statusCode: number, retryable: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.retryable = retryable;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  schema?: z.ZodSchema<T>,
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const method = options.method?.toUpperCase() || 'GET';

  const headers = new Headers(options.headers || {});
  // All mutating requests require custom CSRF header
  if (method !== 'GET' && method !== 'HEAD') {
    headers.set('X-Samjo-Session', '1');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return null as unknown as T;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const code = isJson && payload.error_code ? payload.error_code : `HTTP_${response.status}`;
    const message =
      isJson && payload.message
        ? payload.message
        : typeof payload === 'string'
          ? payload
          : 'An unexpected error occurred.';
    const retryable = isJson ? !!payload.retryable : false;
    throw new ApiError(code, message, response.status, retryable);
  }

  if (schema) {
    return schema.parse(payload);
  }

  return payload as T;
}

/* ── API Endpoints ──────────────────────────────────────────────────────── */

export async function ensureSession(): Promise<{ session_id: string }> {
  return request<{ session_id: string; created_at: string; expires_at: string }>(
    '/sessions',
    { method: 'POST' },
  );
}

export async function uploadDocument(
  file: File,
  situationContext?: string,
): Promise<{
  document_id: string;
  status: string;
  page_count: number;
  delete_after: string;
  ocr_used?: boolean;
  ocr_confidence?: number | null;
  ocr_low_confidence?: boolean;
  extracted_text?: string | null;
}> {
  await ensureSession();

  const formData = new FormData();
  formData.append('file', file);
  if (situationContext && situationContext.trim()) {
    formData.append('situation_context', situationContext.trim().slice(0, 500));
  }

  return request<{
    document_id: string;
    status: string;
    page_count: number;
    delete_after: string;
    ocr_used?: boolean;
    ocr_confidence?: number | null;
    ocr_low_confidence?: boolean;
    extracted_text?: string | null;
  }>(
    '/documents',
    {
      method: 'POST',
      body: formData,
    },
  );
}

export async function startAnalysis(
  documentId: string,
  language: 'en' | 'hi' = 'en',
  confirmedText?: string,
): Promise<{ job_id: string; status: string; stage: string }> {
  return request<{ job_id: string; status: string; stage: string }>(
    `/documents/${documentId}/analyze`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        ...(confirmedText ? { confirmed_text: confirmedText } : {}),
      }),
    },
  );
}

export type AnalysisPollResult =
  | { status: 'processing'; stage: JobStatusResponse['stage'] }
  | { status: 'complete'; data: AnalysisResponse }
  | { status: 'failed'; error_code: string; message: string };

export async function getAnalysis(documentId: string): Promise<AnalysisPollResult> {
  const url = `${API_BASE}/documents/${documentId}/analysis`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.status === 425 || response.status === 202) {
    const json = await response.json();
    return {
      status: 'processing',
      stage: json.stage || 'extracting',
    };
  }

  if (response.ok) {
    const json = await response.json();
    const parsed = AnalysisResponseSchema.parse(json);
    return {
      status: 'complete',
      data: parsed,
    };
  }

  const json = await response.json().catch(() => ({}));
  return {
    status: 'failed',
    error_code: json.error_code || `HTTP_${response.status}`,
    message: json.message || 'Analysis could not be completed.',
  };
}

export async function getSourceSpan(
  documentId: string,
  sourceId: string,
): Promise<SourceDetail> {
  return request<SourceDetail>(
    `/documents/${documentId}/source/${sourceId}`,
    { method: 'GET' },
    SourceDetailSchema,
  );
}

export async function deleteDocument(documentId: string): Promise<void> {
  await request<void>(`/documents/${documentId}`, { method: 'DELETE' });
}

export async function createSituation(
  description: string,
  language: 'en' | 'hi' = 'en',
): Promise<SituationCreateResponse> {
  await ensureSession();
  return request<SituationCreateResponse>(
    '/situations',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, language }),
    },
    SituationCreateResponseSchema,
  );
}

export async function analyzeSituation(
  situationId: string,
  answers: { question_id: string; answer: string }[],
): Promise<SituationAnalyzeResponse> {
  return request<SituationAnalyzeResponse>(
    `/situations/${situationId}/analyze`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    },
    SituationAnalyzeResponseSchema,
  );
}

/* ── UI Adapter: Maps AnalysisResponse to Briefing Page Contract ─────────── */

import type { Confidence, Evidence, BriefingItem, DetailItem, Briefing } from './sampleBriefing';

function toConfidence(conf: number): Confidence {
  if (conf >= 0.85) return 'High';
  if (conf >= 0.65) return 'Medium';
  return 'Low';
}

export function transformAnalysisToBriefing(analysis: AnalysisResponse, deleteAfterHours: number = 24): Briefing {
  const mustDo: BriefingItem[] = analysis.obligations.map((item) => ({
    id: item.id,
    text: item.ai_interpretation || item.title,
    verify: item.needs_verification,
    evidence: {
      quote: item.what_document_says.quoted_text,
      page: item.what_document_says.page,
      interprets: item.ai_interpretation,
      confidence: toConfidence(item.confidence),
      check: item.needs_verification ? 'Check this clause with a legal professional.' : undefined,
      sourceId: item.what_document_says.source_id ?? undefined,
    } as Evidence,
  }));

  const watchOut: BriefingItem[] = analysis.risks.map((item) => ({
    id: item.id,
    text: item.ai_interpretation || item.title,
    verify: item.needs_verification,
    evidence: {
      quote: item.what_document_says.quoted_text,
      page: item.what_document_says.page,
      interprets: item.ai_interpretation,
      confidence: toConfidence(item.confidence),
      check: item.needs_verification ? 'Check this risk clause before signing or responding.' : undefined,
      sourceId: item.what_document_says.source_id ?? undefined,
    } as Evidence,
  }));

  const details: DetailItem[] = analysis.money_items.map((item) => ({
    id: item.id,
    label: item.title,
    value: item.amount_text,
    verify: item.needs_verification,
    evidence: {
      quote: item.what_document_says.quoted_text,
      page: item.what_document_says.page,
      interprets: item.ai_interpretation,
      confidence: toConfidence(item.confidence),
      check: item.needs_verification ? 'Verify the calculation and receipts.' : undefined,
      sourceId: item.what_document_says.source_id ?? undefined,
    } as Evidence,
  }));

  const dates: DetailItem[] = analysis.deadlines.map((item) => ({
    id: item.id,
    label: item.title,
    value: item.date_text,
    verify: item.needs_verification,
    evidence: {
      quote: item.what_document_says.quoted_text,
      page: item.what_document_says.page,
      interprets: item.ai_interpretation,
      confidence: toConfidence(item.confidence),
      check: item.needs_verification ? 'Confirm the exact date of receipt and delivery.' : undefined,
      sourceId: item.what_document_says.source_id ?? undefined,
    } as Evidence,
  }));

  const firstDeadline = analysis.deadlines[0];

  /* Urgency is the backend's call, not the browser's. It is derived from
     evidence in safety_service and carries LOW/MEDIUM/HIGH/CRITICAL; deciding
     it again here from the shape of the payload would be a second, weaker
     implementation of a rule that already exists — and the two would disagree. */
  const urgent = analysis.urgency.level === 'HIGH' || analysis.urgency.level === 'CRITICAL';

  return {
    id: analysis.document_id,
    fileName: 'Document',
    documentType: analysis.document_type || 'Residential Rental Document',
    typeConfidence: toConfidence(analysis.type_confidence),
    pages: analysis.source_metadata.page_count,
    dated: firstDeadline?.date_text || 'Notice in file',
    urgency: urgent
      ? {
          level: 'Time-sensitive',
          line: analysis.urgency.reason || 'This document requires prompt attention.',
          escalation:
            'This document appears to contain a time-sensitive requirement. Consider getting professional legal help promptly.',
        }
      : null,
    whatThisIs: {
      text: analysis.what_this_is?.ai_interpretation || analysis.summary,
      evidence: analysis.what_this_is?.what_document_says
        ? ({
            quote: analysis.what_this_is.what_document_says.quoted_text,
            page: analysis.what_this_is.what_document_says.page,
            interprets: analysis.what_this_is.ai_interpretation || analysis.summary,
            confidence: toConfidence(analysis.what_this_is.confidence),
            sourceId: analysis.what_this_is.what_document_says.source_id ?? undefined,
          } as Evidence)
        : undefined,
    },
    mustDo,
    watchOut,
    details,
    dates,
    questions: analysis.questions.map((q) => q.text),
    questionRationales: analysis.questions.reduce<Record<string, string>>((acc, q) => {
      if (q.rationale) acc[q.text] = q.rationale;
      return acc;
    }, {}),
    nextSteps:
      analysis.next_steps.length > 0
        ? analysis.next_steps.map((step) => step.step).join(' ')
        : 'Prepare your response in writing and consult a legal professional if needed.',
    uncertainty: analysis.uncertainty,
    sourceMetadata: {
      pageCount: analysis.source_metadata.page_count,
      ocrUsed: analysis.source_metadata.ocr_used,
      ocrConfidence: analysis.source_metadata.ocr_confidence ?? null,
      extractionCharCount: analysis.source_metadata.extraction_char_count,
      droppedItemCount: analysis.source_metadata.dropped_item_count,
    },
    deleteAfterHours,
    disclaimer: analysis.disclaimer,
  };
}
