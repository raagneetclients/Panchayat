import { database, json } from '@/lib/advertising';
export async function GET(){try{const result=await database().prepare("SELECT id,business,reason FROM advertising_bids WHERE status='approved' ORDER BY amount_paise DESC,created_at ASC LIMIT 6").all();return json(result.results)}catch{return json([],503)}}
