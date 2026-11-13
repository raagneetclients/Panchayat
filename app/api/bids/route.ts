import { clean, database, isSameOrigin, json } from '@/lib/advertising';
export async function POST(request:Request){
 if(!isSameOrigin(request))return json({error:'Invalid request origin.'},403);
 try{
  const raw=await request.text();if(new TextEncoder().encode(raw).length>10000)return json({error:'Request is too large.'},413);
  let body;try{body=JSON.parse(raw)}catch{return json({error:'Invalid JSON.'},400)}
  if(body.website)return json({error:'Unable to accept this submission.'},400);
  const name=clean(body.name,100),phone=clean(body.phone,10),business=clean(body.business,120),reason=clean(body.reason,1200),amount=Number(body.amount),amountPaise=Math.round(amount*100);
  if(name.length<2||name.length>100||!/^[6-9]\d{9}$/.test(phone)||business.length<2||business.length>120||reason.length<20||reason.length>1200||!Number.isFinite(amount)||amount<1||amount>10000000||Math.abs(amount*100-amountPaise)>.00001||body.consent!=='yes')return json({error:'Check name, 10-digit phone, business, amount, message and consent.'},400);
  const now=new Date().toISOString(),date=now.slice(0,10),ip=request.headers.get('CF-Connecting-IP')||request.headers.get('oai-authenticated-user-id')||'local';
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+date)))).map(v=>v.toString(16).padStart(2,'0')).join('');
  const id='BID-'+crypto.randomUUID().slice(0,8).toUpperCase(),db=database();
  const inserted=await db.prepare("INSERT INTO advertising_bids (id,name,phone,business,amount_paise,reason,status,consent_at,created_at,submitter_hash) SELECT ?,?,?,?,?,?,'pending',?,?,? WHERE (SELECT COUNT(*) FROM advertising_bids WHERE submitter_hash = ?) < 5").bind(id,name,phone,business,amountPaise,reason,now,now,hash,hash).run();
  if(!inserted.meta.changes)return json({error:'Daily submission limit reached. Please try tomorrow.'},429);
  return json({id,status:'pending',prototype:true},201);
 }catch(e){console.error('Bid submission failed',e instanceof Error?e.name:'unknown');return json({error:'The submission service is temporarily unavailable. Please try again.'},503)}
}
export function GET(){return json({error:'Bid records are private.'},405)}
