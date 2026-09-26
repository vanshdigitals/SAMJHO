import { describe, it, expect, vi, afterEach } from 'vitest';
import { ApiError, ensureSession, pollDelay } from '../lib/api';

/* Two request-level behaviours that are easy to regress and invisible until
   they cost something: how often the client asks, and what happens when the
   server never answers. */

describe('poll backoff', () => {
  it('starts responsive and backs off to a 5s ceiling', () => {
    // The first seconds are where a reader is watching, so they stay short.
    expect(pollDelay(0)).toBe(1500);
    expect(pollDelay(1)).toBe(1500);
    // Then it widens rather than holding 1.5s for the whole analysis.
    expect(pollDelay(2)).toBe(2000);
    expect(pollDelay(4)).toBe(3000);
    // And settles, so a long analysis cannot generate unbounded traffic.
    expect(pollDelay(6)).toBe(5000);
    expect(pollDelay(50)).toBe(5000);
  });

  it('never returns an interval below 1.5s', () => {
    for (let i = 0; i < 60; i += 1) {
      expect(pollDelay(i)).toBeGreaterThanOrEqual(1500);
    }
  });

  it('spends fewer requests than a flat 1.5s interval over the same wall time', () => {
    // A ~20s analysis, which is what the deployed pipeline actually takes.
    const budgetMs = 20_000;
    let elapsed = 0;
    let polls = 0;
    while (elapsed < budgetMs) {
      elapsed += pollDelay(polls);
      polls += 1;
    }
    const flat = Math.ceil(budgetMs / 1500);
    expect(polls).toBeLessThan(flat);
  });
});

describe('request timeout', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('aborts a request that never settles and reports it as a typed retryable error', async () => {
    // A fetch that hangs for ever unless its signal aborts.
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init?: RequestInit) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'));
            });
          }),
      ),
    );

    vi.useFakeTimers();
    const pending = ensureSession();
    // Fail the assertion rather than the suite if the budget is ever removed.
    await vi.advanceTimersByTimeAsync(46_000);

    await expect(pending).rejects.toBeInstanceOf(ApiError);
    await pending.catch((err: ApiError) => {
      expect(err.code).toBe('REQUEST_TIMEOUT');
      expect(err.statusCode).toBe(408);
      // Retryable, so the caller's existing retry path handles it.
      expect(err.retryable).toBe(true);
      // The reader is told their document survived, not shown an internal name.
      expect(err.message).toMatch(/still here/i);
      expect(err.message).not.toMatch(/abort|signal|controller/i);
    });
  });

  it('reports an unreachable server as a typed network error, not a timeout', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))));

    await expect(ensureSession()).rejects.toBeInstanceOf(ApiError);
    await ensureSession().catch((err: ApiError) => {
      expect(err.code).toBe('NETWORK_ERROR');
      expect(err.retryable).toBe(true);
    });
  });
});
