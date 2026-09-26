import { Link } from 'react-router-dom';
import { ButtonLink } from '../ui/Button';

export function NotFoundState() {
  return (
    <div className="mx-auto w-full max-w-[640px] px-5 py-20 sm:px-6 md:py-24 lg:px-8">
      <h1 className="m-0 font-sans text-[30px] font-medium leading-[1.15] tracking-[-0.024em] text-ink sm:text-[36px]">
        Document not found
      </h1>
      <p className="m-0 mt-4 font-sans text-[17px] leading-[1.6] text-ink-secondary lg:text-[18px]">
        This document may have expired after 24 hours, or the link is incorrect.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <ButtonLink to="/upload" size="md">
          Upload a document
        </ButtonLink>
        <Link
          to="/"
          className="inline-flex min-h-[36px] items-center font-sans text-[15px] font-medium text-ink-muted no-underline transition-colors hover:text-primary"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
