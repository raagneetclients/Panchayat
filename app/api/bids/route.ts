import {
  createBid,
  isSameOrigin,
  json,
  requestFingerprint,
} from '@/lib/advertising';
import {
  MAX_BID_BODY_BYTES,
  submissionHash,
  validateBidSubmission,
} from '@/lib/bid-validation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json({ error: 'Invalid request origin.' }, 403);
  }

  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BID_BODY_BYTES) {
      return json({ error: 'Request is too large.' }, 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: 'Invalid JSON.' }, 400);
    }

    const validation = validateBidSubmission(body);
    if (!validation.ok) {
      return json({ error: validation.error }, validation.status);
    }

    const now = new Date().toISOString();
    const hash = await submissionHash(requestFingerprint(request), now.slice(0, 10));
    const created = await createBid({ ...validation.value, now }, hash);

    if (!created) {
      return json(
        { error: 'Daily submission limit reached. Please try tomorrow.' },
        429,
      );
    }

    return json({ id: created.id, status: created.status, prototype: true }, 201);
  } catch (error) {
    console.error(
      'Bid submission failed',
      error instanceof Error ? error.name : 'unknown',
    );
    return json(
      { error: 'The submission service is temporarily unavailable. Please try again.' },
      503,
    );
  }
}

export function GET() {
  return json({ error: 'Bid records are private.' }, 405);
}
