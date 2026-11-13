import { json, listApprovedAds } from '@/lib/advertising';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const ads = await listApprovedAds();
    return json(ads);
  } catch {
    return json([], 503);
  }
}
