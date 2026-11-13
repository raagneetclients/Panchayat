export {
  createBid,
  listApprovedAds,
  listBids,
  reviewBid,
} from '@/db/advertising';
export type {
  BidSummary,
  NewBid,
  PublicAd,
  ReviewInput,
} from '@/db/advertising';

export function json(value: unknown, status = 200): Response {
  return Response.json(value, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  return Boolean(origin && origin === new URL(request.url).origin);
}

/**
 * Use the address Netlify supplies to the Function. The fallback is only for
 * local development; neither value is used as an authentication signal.
 */
export function requestFingerprint(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return (
    request.headers.get('x-nf-client-connection-ip') ||
    forwarded ||
    'unknown'
  );
}
