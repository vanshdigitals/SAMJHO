import { Link } from 'react-router-dom';
import { AlertIcon } from '../icons';
import { Button } from '../ui/Button';

export interface AnalysisErrorInfo {
  title: string;
  description: string;
  canRetry: boolean;
  actionText?: string;
  actionHref?: string;
}

export function getAnalysisErrorInfo(
  errorCode?: string | null,
  serverMessage?: string | null,
): AnalysisErrorInfo {
  switch (errorCode) {
    case 'EXTRACTION_EMPTY':
      return {
        title: "Samjo couldn't read this document",
        description:
          'It looks like a scan with no text layer. Try a clearer photo, or upload the original PDF.',
        canRetry: false,
        actionText: 'Upload a different document',
        actionHref: '/upload',
      };
    case 'OCR_UNAVAILABLE':
      return {
        title: 'OCR is currently unavailable',
        description:
          'Optical character recognition is temporarily unavailable. Try uploading a text-searchable PDF or Word document.',
        canRetry: true,
        actionText: 'Upload a different document',
        actionHref: '/upload',
      };
    case 'FILE_ENCRYPTED':
      return {
        title: 'Password-protected document',
        description:
          "This PDF is password-protected, so Samjo can't open it. Remove the password and upload it again.",
        canRetry: false,
        actionText: 'Upload a different document',
        actionHref: '/upload',
      };
    case 'FILE_TOO_LARGE':
      return {
        title: 'File is too large',
        description: 'This file is over 10 MB. Try uploading just the pages that matter.',
        canRetry: false,
        actionText: 'Upload a different document',
        actionHref: '/upload',
      };
    case 'UNSUPPORTED_TYPE':
      return {
        title: 'Unsupported file type',
        description: 'Samjo reads PDF, Word and photos. This file is a different type.',
        canRetry: false,
        actionText: 'Upload a different document',
        actionHref: '/upload',
      };
    case 'NOT_LEGAL_DOCUMENT':
      return {
        title: "This doesn't look like a legal document",
        description:
          'If something has happened and you want help thinking it through, tell us about it instead.',
        canRetry: false,
        actionText: 'Tell us what happened',
        actionHref: '/situation',
      };
    case 'RATE_LIMITED':
      return {
        title: 'Too many requests',
        description: 'Samjo is busy right now. Please wait a minute before trying again.',
        canRetry: true,
      };
    case 'QUOTA_EXHAUSTED':
      return {
        title: 'Daily processing limit reached',
        description: 'Samjo daily processing limit reached. Please try again tomorrow.',
        canRetry: false,
      };
    case 'AI_TIMEOUT':
    case 'ANALYSIS_TIMEOUT':
      return {
        title: 'Analysis took too long',
        description: 'Samjo took too long reading this document. Your file is still here. Try again.',
        canRetry: true,
      };
    case 'SCHEMA_INVALID':
      return {
        title: "Couldn't finish the briefing",
        description:
          "Samjo read your document but couldn't finish the briefing. Your file is still here. Try again.",
        canRetry: true,
      };
    case 'BACKEND_UNAVAILABLE':
      return {
        title: 'Unable to connect to Samjo',
        description:
          'Samjo could not connect to the server. Please check your network connection and try again.',
        canRetry: true,
      };
    case 'INTERNAL_SERVER_ERROR':
    case 'HTTP_500':
    case 'DB_ERROR':
      return {
        title: 'Temporary service error',
        description:
          'Samjo encountered a temporary server error. Your file is safe. Please try again in a moment.',
        canRetry: true,
      };
    case 'AI_UNAVAILABLE':
      return {
        title: 'Analysis service busy',
        description:
          "Samjo read your document but couldn't finish the briefing. Your file is still here. Try again.",
        canRetry: true,
      };
    default:
      return {
        title: "Couldn't finish the briefing",
        description:
          serverMessage ||
          "Samjo read your document but couldn't finish the briefing. Your file is still here. Try again.",
        canRetry: true,
      };
  }
}

interface AnalysisErrorStateProps {
  errorCode?: string | null;
  message?: string | null;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function AnalysisErrorState({
  errorCode,
  message,
  onRetry,
  isRetrying = false,
}: AnalysisErrorStateProps) {
  const errorInfo = getAnalysisErrorInfo(errorCode, message);

  return (
    <div
      className="mx-auto w-full max-w-[680px] px-5 py-16 sm:px-6 md:py-20 lg:px-8"
      role="alert"
    >
      <div className="rounded-md border border-[color:var(--danger)] bg-danger-surface p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <AlertIcon size={22} className="mt-0.5 shrink-0 text-danger" />
          <div className="min-w-0 flex-1">
            <h1 className="m-0 font-sans text-[20px] font-medium leading-[1.3] text-ink sm:text-[22px]">
              {errorInfo.title}
            </h1>
            <p className="m-0 mt-3 font-sans text-[16px] leading-[1.6] text-ink-secondary">
              {errorInfo.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {errorInfo.canRetry && onRetry && (
                <Button size="md" onClick={onRetry} disabled={isRetrying}>
                  {isRetrying ? 'Starting again...' : 'Try again'}
                </Button>
              )}

              {errorInfo.actionHref && errorInfo.actionText ? (
                <Link
                  to={errorInfo.actionHref}
                  className="inline-flex min-h-[36px] items-center font-sans text-[15px] font-medium text-ink-muted no-underline transition-colors hover:text-primary"
                >
                  {errorInfo.actionText}
                </Link>
              ) : (
                <Link
                  to="/upload"
                  className="inline-flex min-h-[36px] items-center font-sans text-[15px] font-medium text-ink-muted no-underline transition-colors hover:text-primary"
                >
                  Upload a different document
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
