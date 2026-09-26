/* The briefing the demo route renders.

   These are the synthetic fixture values DESIGN_SYSTEM §5 and
   SAMJO_LANDING_PAGE_CONTENT.md already use — the same notice to vacate, the
   same amounts, the same quoted sentences. Nothing here is a real document
   and nothing is produced by a model: until POST /analyze exists this is a
   fixture the frontend renders so the surface can be built and tested.

   Shape follows AI_SCHEMAS: every claim that is sourced carries the quote,
   the page it sits on, Samjo's separate reading, and a confidence. An item
   with no evidence is simply an item with no evidence — it is never given a
   fabricated one. */

export type Confidence = 'High' | 'Medium' | 'Low';

export type Evidence = {
  /* The document's own words. Never paraphrased, never merged with the
     interpretation. */
  quote: string;
  page: number;
  clause?: string;
  interprets: string;
  confidence: Confidence;
  /* What a professional decides, where there is such a thing. */
  check?: string;
  /* Source linking (Phase 3) */
  sourceId?: string;
  contextBefore?: string;
  contextAfter?: string;
  isLoadingContext?: boolean;
};

export type BriefingItem = {
  id: string;
  text: string;
  /* Marks the item for a professional to confirm — word plus shape, never
     colour alone (ACCESSIBILITY §1). */
  verify?: boolean;
  evidence?: Evidence;
};

export type DetailItem = {
  id: string;
  label: string;
  value: string;
  verify?: boolean;
  evidence?: Evidence;
};

export type Briefing = {
  id: string;
  fileName: string;
  documentType: string;
  typeConfidence: Confidence;
  pages: number;
  dated: string;
  urgency: {
    level: string;
    line: string;
    escalation: string;
  } | null;
  whatThisIs: {
    text: string;
    evidence?: Evidence;
  };
  mustDo: BriefingItem[];
  watchOut: BriefingItem[];
  details: DetailItem[];
  dates: DetailItem[];
  questions: string[];
  questionRationales?: Record<string, string>;
  nextSteps: string;
  uncertainty: string[];
  sourceMetadata: {
    pageCount: number;
    ocrUsed: boolean;
    ocrConfidence: number | null;
    extractionCharCount: number;
    droppedItemCount: number;
  };
  deleteAfterHours: number;
  disclaimer: string;
};

export const SAMPLE: Briefing = {
  id: 'sample',
  fileName: 'notice-to-vacate.pdf',
  documentType: 'A notice to vacate',
  typeConfidence: 'High' as Confidence,
  pages: 3,
  dated: '14 March',

  urgency: {
    level: 'Time-sensitive',
    line: 'You have 30 days from 14 March to respond.',
    escalation:
      'This document appears to contain a time-sensitive requirement. Consider getting professional legal help promptly.',
  },

  whatThisIs: {
    text: 'A notice to vacate, sent by your landlord under the terms of your rental agreement.',
    evidence: {
      quote:
        'Take notice that you are required to vacate and deliver up peaceful possession of the premises.',
      page: 1,
      interprets:
        'This is your landlord asking you to leave the property, not a court order.',
      confidence: 'High',
    } as Evidence,
  },

  mustDo: [
    {
      id: 'respond',
      text: 'Respond in writing within 30 days',
      evidence: {
        quote:
          'The Tenant shall vacate the premises within thirty (30) days of receipt of this notice.',
        page: 1,
        clause: 'Clause 3 · Termination',
        interprets:
          'The notice period starts from the date you received it, not the date on the letter.',
        confidence: 'High',
        check: 'Whether the date you received it can be established, if that is disputed.',
      },
    },
    {
      id: 'rent',
      text: 'Pay the outstanding rent of ₹25,000',
      evidence: {
        quote: 'arrears of rent amounting to Rs. 25,000/- remain outstanding as on the date hereof',
        page: 2,
        interprets:
          'The notice states an amount already owed. It does not say how that figure was arrived at.',
        confidence: 'Medium',
        check: 'Whether the amount is correct, and what it is made up of.',
      },
    },
  ] satisfies BriefingItem[],

  watchOut: [
    {
      id: 'deposit',
      text: 'The agreement lets the landlord deduct repair costs from your deposit without an itemised list.',
      verify: true,
      evidence: {
        quote: 'deductions for repairs at the Landlord’s discretion',
        page: 2,
        clause: 'Clause 4 · Security deposit',
        interprets:
          'The agreement mentions deductions but does not say whether an itemised list is required.',
        confidence: 'Medium',
        check: 'Whether a discretionary deduction of this kind can be enforced against you.',
      },
    },
  ] satisfies BriefingItem[],

  details: [
    {
      id: 'deposit-amount',
      label: 'Security deposit',
      value: '₹25,000',
      evidence: {
        quote: 'The Tenant shall deposit a sum of Rs. 25,000/- as interest-free security',
        page: 1,
        clause: 'Clause 4 · Security deposit',
        interprets: 'This is refundable, but the agreement sets conditions for deductions.',
        confidence: 'High',
      },
    },
    {
      id: 'rent-amount',
      label: 'Monthly rent',
      value: '₹12,000',
      evidence: {
        quote: 'a monthly rent of Rs. 12,000/- payable in advance on or before the fifth day',
        page: 1,
        clause: 'Clause 2 · Rent',
        interprets: 'Rent falls due on the 5th of each month, in advance.',
        confidence: 'High',
      },
    },
    { id: 'notice-period', label: 'Notice period', value: '30 days' },
  ] satisfies DetailItem[],

  dates: [
    { id: 'dated', label: 'Notice dated', value: '14 March' },
    {
      id: 'respond-by',
      label: 'Respond by',
      value: '13 April',
      verify: true,
      evidence: {
        quote: 'within thirty (30) days of receipt of this notice',
        page: 1,
        interprets:
          'Counted from 14 March. If you received the notice later, the date moves with it.',
        confidence: 'Medium',
        check: 'The date the notice was actually received.',
      },
    },
  ] satisfies DetailItem[],

  questions: [
    'Does the notice period run from the date on the letter, or the date I received it?',
    'Does the deposit clause let you deduct repair costs without giving me an itemised list?',
    'What is the ₹25,000 in arrears made up of?',
    'What happens if I dispute the amount and stay past the notice period?',
  ],

  nextSteps:
    'Prepare your response in writing, and take the notice and your agreement to a legal professional if you are unsure.',

  /* AI_SCHEMAS `AnalysisResponse.uncertainty[]` — AI_SAFETY §4 requires
     missing context to be named rather than smoothed over. */
  uncertainty: [
    'Whether the notice period runs from the date on the letter or the date you received it. The document says “receipt” and does not define it.',
    'How the ₹25,000 in arrears was calculated. The notice states the figure but not its parts.',
    'Whether anything was agreed in writing after the agreement was signed. Nothing in these three pages refers to it.',
  ],

  /* AI_SCHEMAS `SourceMetadata`. dropped_item_count is the number of claims
     the model produced that could not be matched to a sentence in the
     document, and were therefore deleted rather than caveated. */
  sourceMetadata: {
    pageCount: 3,
    ocrUsed: false,
    ocrConfidence: null as number | null,
    extractionCharCount: 8420,
    droppedItemCount: 1,
  },

  /* documents.delete_after — DOCUMENT_TTL_HOURS, default 24. */
  deleteAfterHours: 21,

  disclaimer:
    'Samjo gives legal information to help you understand your document and prepare. It is not legal advice and not a substitute for a lawyer.',
};

/* The real pipeline stages, named as UX_FLOWS §2 names them. No percentages:
   the spec forbids fabricating one, and there is nothing to measure. */
export const PIPELINE_STAGES = [
  'Reading your document',
  'Working out what this is',
  'Finding what matters',
  'Checking dates and amounts',
  'Preparing your briefing',
] as const;
