import { clean,database,isSameOrigin,json,reviewer } from '@/lib/advertising';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!isSameOrigin(request))return json({error:'Invalid request origin.'},403);
 const admin=await reviewer();if(!admin)return json({error:'Authorized reviewer access is required.'},403);
 const {id}=await params;if(!/^BID-[A-F0-9]{8}$/.test(id))return json({error:'Invalid bid reference.'},400);
 try{const raw=await request.text();if(raw.length>3000)return json({error:'Request is too large.'},413);const body=JSON.parse(raw);const status=clean(body.status,20),reason=clean(body.reason,1000);if(!['approved','rejected'].includes(status)||!reason||reason.length>1000)return json({error:'Choose a valid decision and provide a reason.'},400);
 const db=database(),bid=await db.prepare('SELECT status FROM advertising_bids WHERE id=?').bind(id).first<{status:string}>();if(!bid)return json({error:'Bid not found.'},404);
 const now=new Date().toISOString();await db.batch([db.prepare('UPDATE advertising_bids SET status=?,reviewed_at=?,reviewed_by=?,review_reason=? WHERE id=?').bind(status,now,admin.userId,reason,id),db.prepare('INSERT INTO bid_revisions (id,bid_id,actor,previous_status,status,reason,created_at) VALUES (?,?,?,?,?,?,?)').bind(crypto.randomUUID(),id,admin.userId,bid.status,status,reason,now)]);return json({id,status});
 }catch{return json({error:'Review could not be saved.'},500)}
}
