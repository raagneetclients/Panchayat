import { isSameOrigin, json, reviewBid } from '@/lib/advertising';
import { getReviewer } from '@/lib/auth';
import {
  MAX_REVIEW_BODY_BYTES,
  validateReviewDecision,
} from '@/lib/bid-validation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(request)) {
    return json({ error: 'Invalid request origin.' }, 403);
  }

  const admin = await getReviewer();
  if (!admin) {
    return json({ error: 'Authorized reviewer access is required.' }, 403);
  }

  const { id } = await params;
  if (!/^BID-[A-F0-9]{8}$/.test(id)) {
    return json({ error: 'Invalid bid reference.' }, 400);
  }

  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_REVIEW_BODY_BYTES) {
      return json({ error: 'Request is too large.' }, 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: 'Invalid JSON.' }, 400);
    }

    const validation = validateReviewDecision(body);
    if (!validation.ok) {
      return json({ error: validation.error }, validation.status);
    }

    const decision = await reviewBid({
      id,
      status: validation.value.status,
      reason: validation.value.reason,
      actor: admin.id,
      now: new Date().toISOString(),
    });

    if (!decision) {
      return json({ error: 'Bid not found.' }, 404);
    }

    return json({ id, status: decision.status });
  } catch (error) {
    console.error(
      'Bid review failed',
      error instanceof Error ? error.name : 'unknown',
    );
    return json({ error: 'Review could not be saved.' }, 500);
  }
}
