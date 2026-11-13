import type { BidStatus } from '@/db/schema';

export const MAX_BID_BODY_BYTES = 10_000;
export const MAX_REVIEW_BODY_BYTES = 3_000;
export const MAX_BIDS_PER_DAY = 5;

export type ValidatedBid = {
  name: string;
  phone: string;
  business: string;
  amountPaise: number;
  reason: string;
};

export type ValidatedReview = {
  status: Exclude<BidStatus, 'pending'>;
  reason: string;
};

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; status: number };

const BID_ERROR =
  'Check name, 10-digit phone, business, amount, message and consent.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function clean(value: unknown, max: number): string {
  return typeof value === 'string'
    ? value
        .normalize('NFKC')
        .replace(/[\u0000-\u001f\u007f]/g, ' ')
        .trim()
        .slice(0, max + 1)
    : '';
}

export function validateBidSubmission(input: unknown): ValidationResult<ValidatedBid> {
  if (!isRecord(input)) {
    return { ok: false, error: 'Invalid JSON.', status: 400 };
  }

  if (input.website) {
    return { ok: false, error: 'Unable to accept this submission.', status: 400 };
  }

  const name = clean(input.name, 100);
  const phone = clean(input.phone, 10);
  const business = clean(input.business, 120);
  const reason = clean(input.reason, 1_200);
  const amount = Number(input.amount);
  const amountPaise = Math.round(amount * 100);

  if (
    name.length < 2 ||
    name.length > 100 ||
    !/^[6-9]\d{9}$/.test(phone) ||
    business.length < 2 ||
    business.length > 120 ||
    reason.length < 20 ||
    reason.length > 1_200 ||
    !Number.isFinite(amount) ||
    amount < 1 ||
    amount > 10_000_000 ||
    Math.abs(amount * 100 - amountPaise) > 0.00001 ||
    input.consent !== 'yes'
  ) {
    return { ok: false, error: BID_ERROR, status: 400 };
  }

  return {
    ok: true,
    value: { name, phone, business, amountPaise, reason },
  };
}

export function validateReviewDecision(input: unknown): ValidationResult<ValidatedReview> {
  if (!isRecord(input)) {
    return { ok: false, error: 'Invalid JSON.', status: 400 };
  }

  const status = clean(input.status, 20);
  const reason = clean(input.reason, 1_000);

  if ((status !== 'approved' && status !== 'rejected') || !reason || reason.length > 1_000) {
    return {
      ok: false,
      error: 'Choose a valid decision and provide a reason.',
      status: 400,
    };
  }

  return { ok: true, value: { status, reason } };
}

export async function submissionHash(fingerprint: string, date: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${fingerprint}:${date}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
}
