'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { X, Megaphone, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Lang, bi } from '@/data/content';

// In-memory session tracking: prevents re-opening when client-navigating between pages,
// but resets on every page load/refresh so the popup reliably opens whenever the homepage loads.
let dismissedInSession = false;

export function AdvertisingPrompt({lang}:{lang:Lang}) {
 const ref = useRef<HTMLDialogElement>(null);

 useEffect(() => {
   // Clear any legacy sessionStorage key so old storage doesn't block the popup on refresh
   if (typeof window !== 'undefined') {
     try {
       sessionStorage.removeItem('advertising-dismissed');
     } catch {}
   }

   if (dismissedInSession) return;

   const t = setTimeout(() => {
     if (ref.current && !ref.current.open) {
       ref.current.showModal();
     }
   }, 1000);

   return () => clearTimeout(t);
 }, []);

 function close() {
   dismissedInSession = true;
   try {
     sessionStorage.removeItem('advertising-dismissed');
   } catch {}
   ref.current?.close();
 }

 return <dialog ref={ref} className="ad-dialog" aria-labelledby="ad-dialog-title" onCancel={close}>
  <button className="dialog-close icon-button" autoFocus onClick={close} aria-label={bi('बंद करें','Close')[lang]}><X/></button>
  <span className="ad-illustration"><Megaphone size={40} strokeWidth={1.4}/></span>
  <span className="eyebrow">{bi('स्थानीय व्यवसायों के लिए','FOR LOCAL BUSINESSES')[lang]}</span>
  <h2 id="ad-dialog-title">{bi('अपने व्यवसाय को','Let your business')[lang]}<br/>{bi('धार से जोड़ें।','reach Dhar.')[lang]}</h2>
  <p>{bi('वेबसाइट पर प्रचार के लिए विज्ञापन बोली भेजें। हर प्रस्ताव की समीक्षा होगी; चयन केवल पात्रता और अनुमोदन के बाद।','Submit an advertising bid for website promotion. Every proposal is reviewed; selection requires qualification and approval.')[lang]}</p>
  <section className="demo-pesticide-ad" aria-label={bi('कीटनाशक विज्ञापन का डेमो नमूना','Pesticide advertisement demo')[lang]}>
   <div className="demo-ad-banner">
    <img src="/images/khet-saathi-banner.webp" alt={bi('हरी फसल और खेत का वास्तविक विज्ञापन चित्र','Realistic agricultural field banner for this demo ad')[lang]} width="1376" height="768"/>
    <span className="demo-ad-label">{bi('डेमो विज्ञापन • काल्पनिक ब्रांड','DEMO AD • FICTIONAL BRAND')[lang]}</span>
    <span className="demo-ad-banner-caption">{bi('हरी फसल • सही जानकारी','HEALTHY FIELDS • GOOD INFORMATION')[lang]}</span>
   </div>
   <div className="demo-ad-copy">
    <h3>{bi('खेत साथी','Khet Saathi')[lang]}</h3>
    <strong>{bi('फसल की सुरक्षा, सही जानकारी के साथ','Protect crops with the right information')[lang]}</strong>
    <p>{bi('फसल और समस्या की सही पहचान के बाद ही उपाय चुनें। कीटनाशक केवल पंजीकृत उत्पाद का, लेबल पर दिए निर्देशों और कृषि विशेषज्ञ की सलाह के अनुसार उपयोग करें।','Choose a treatment only after identifying the crop and problem. Use pesticides only as directed on a registered product label and with advice from an agricultural expert.')[lang]}</p>
    <small>{bi('यह केवल नमूना है; वास्तविक उत्पाद, बिक्री या सरकारी अनुमोदन का दावा नहीं।','Illustrative only; no real product, sale or government endorsement is claimed.')[lang]}</small>
   </div>
  </section>
  <div className="popup-note"><ShieldCheck size={18}/>{bi('प्रोटोटाइप परीक्षण • कोई भुगतान नहीं','Prototype testing • no payment collected')[lang]}</div>
  <a className="button" href={'/'+lang+'/advertise/'} onClick={close}>{bi('विज्ञापन की बोली भरें','Submit an advertising bid')[lang]}<ArrowRight size={18}/></a>
  <button className="later-button" onClick={close}>{bi('अभी वेबसाइट देखें','Continue to the website')[lang]}</button>
 </dialog>
}
export function BidForm({lang}:{lang:Lang}) {const [sending,setSending]=useState(false),[error,setError]=useState(''),[receipt,setReceipt]=useState('');async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setError('');setSending(true);const fd=new FormData(e.currentTarget);try{const r=await fetch('/api/bids',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(fd))});const result=await r.json() as {error?:string;id:string};if(!r.ok)throw new Error(result.error||'Unable to submit');setReceipt(result.id)}catch(e){setError(bi('बोली जमा नहीं हुई। ','Bid was not submitted. ')[lang]+(e instanceof Error?e.message:''))}finally{setSending(false)}}if(receipt)return <div className="bid-success" role="status" tabIndex={-1} ref={node=>{node?.focus()}}><CheckCircle2 size={48}/><h2>{bi('आपकी बोली प्राप्त हुई','Your bid has been received')[lang]}</h2><p>{bi('संदर्भ संख्या','Reference number')[lang]}: <strong>{receipt}</strong></p><p>{bi('स्थिति: समीक्षा लंबित। चयन, प्रकाशन या भुगतान का वादा नहीं है। यह प्रोटोटाइप परीक्षण आवेदन है।','Status: pending review. Selection, publication or payment is not guaranteed. This is a prototype test submission.')[lang]}</p><button className="button secondary" onClick={()=>setReceipt('')}>{bi('दूसरी बोली भरें','Submit another bid')[lang]}</button></div>;return <form className="bid-form" onSubmit={submit}><div className="form-grid"><label>{bi('आपका नाम','Your name')[lang]} <span>*</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder={bi('पूरा नाम लिखें','Enter your full name')[lang]}/></label><label>{bi('मोबाइल नंबर','Mobile number')[lang]} <span>*</span><input name="phone" type="tel" required pattern="[6-9][0-9]{9}" inputMode="tel" autoComplete="tel-national" maxLength={10} placeholder="9876543210" aria-describedby="phone-hint"/><small id="phone-hint">{bi('10 अंकों का भारतीय मोबाइल नंबर','10-digit Indian mobile number')[lang]}</small></label><label>{bi('व्यवसाय का नाम','Business name')[lang]} <span>*</span><input name="business" required minLength={2} maxLength={120} autoComplete="organization" placeholder={bi('जिस व्यवसाय का प्रचार करना चाहते हैं','Business you want to advertise')[lang]}/></label><label>{bi('बोली की राशि (₹)','Bid amount (₹)')[lang]} <span>*</span><input name="amount" type="number" required min={1} max={10000000} step="0.01" inputMode="decimal" placeholder="2500"/><small>{bi('केवल प्रस्तावित राशि; कोई भुगतान नहीं लिया जाएगा','Proposed amount only; no payment will be collected')[lang]}</small></label></div><label>{bi('विज्ञापन का कारण और प्रस्तावित संदेश','Reason for advertising & proposed message')[lang]} <span>*</span><textarea name="reason" required minLength={20} maxLength={1200} rows={5} placeholder={bi('व्यवसाय, प्रचार का उद्देश्य और विज्ञापन में दिखने वाला संदेश लिखें (कम से कम 20 अक्षर)।','Describe the business, promotion objective and message to display (at least 20 characters).')[lang]}/></label><label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label><label className="consent"><input name="consent" type="checkbox" value="yes" required/><span>{bi('मैं प्रोटोटाइप परीक्षण के लिए नाम और नंबर संग्रह की अनुमति देता/देती हूँ। स्वीकृत होने पर व्यवसाय का नाम और यह संदेश सार्वजनिक हो सकते हैं। बोली चयन या सरकारी समर्थन की गारंटी नहीं है।','I consent to collection of my name and phone for this prototype test. If approved, the business name and message may be public. A bid does not guarantee selection or government endorsement.')[lang]} <a href={'/'+lang+'/privacy/'}>{bi('गोपनीयता नीति','Privacy policy')[lang]}</a></span></label>{error&&<p className="form-error" role="alert">{error}</p>}<button type="submit" className="button" disabled={sending}>{sending?bi('जमा हो रही है…','Submitting…')[lang]:bi('समीक्षा के लिए बोली भेजें','Send bid for review')[lang]}<ArrowRight size={18}/></button><p className="fine-print">{bi('फोन नंबर और नाम सार्वजनिक विज्ञापन में नहीं दिखेंगे।','Personal names and phone numbers are never displayed in public advertisements.')[lang]}</p></form>}
export function ApprovedAds({lang}:{lang:Lang}) {const [ads,setAds]=useState<{id:string;business:string;reason:string}[]>([]);useEffect(()=>{fetch('/api/ads').then(r=>r.ok?r.json():[]).then(v=>setAds(Array.isArray(v)?v:[])).catch(()=>{})},[]);return <section className="advertising-strip container"><div><Megaphone size={23}/><div><span className="eyebrow">{bi('विज्ञापन हेतु स्थान','ADVERTISING SPACE')[lang]}</span><h3>{bi('स्थानीय व्यवसाय, स्थानीय पहुँच','Local businesses. Local reach.')[lang]}</h3><p>{ads.length?bi('समीक्षा के बाद स्वीकृत प्रचार','Promotions approved after review')[lang]:bi('अभी कोई स्वीकृत विज्ञापन नहीं। अपना प्रस्ताव समीक्षा के लिए भेजें।','No approved advertisements yet. Send your proposal for review.')[lang]}</p></div></div>{ads.map(a=><article className="approved-ad" key={a.id}><span className="tag">{bi('विज्ञापन • प्रोटोटाइप','Advertisement • prototype')[lang]}</span><h3>{a.business}</h3><p>{a.reason}</p></article>)}<a className="button secondary" href={'/'+lang+'/advertise/'}>{bi('बोली भेजें','Submit a bid')[lang]}<ArrowRight size={17}/></a></section>}
export function ReviewButtons({id}:{id:string}) {
 const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[reason,setReason]=useState('');
 async function review(status:string){if(!reason.trim()){setMessage('Please enter a review reason / निर्णय का कारण लिखें।');return}setBusy(true);try{const r=await fetch('/api/bids/'+id+'/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({status,reason})});const v=await r.json() as {error?:string};if(!r.ok)throw new Error(v.error);setMessage('Saved: '+status);location.reload()}catch(e){setMessage(e instanceof Error?e.message:'Failed')}finally{setBusy(false)}}
 return <div className="review-controls"><label htmlFor={'review-'+id}>Review reason / निर्णय का कारण</label><textarea id={'review-'+id} value={reason} onChange={e=>setReason(e.target.value)} maxLength={1000} rows={2} required/><div className="review-buttons"><button className="button" disabled={busy} onClick={()=>review('approved')}>Qualify & approve</button><button className="button secondary" disabled={busy} onClick={()=>review('rejected')}>Reject / withdraw</button><span role="status">{message}</span></div></div>
}
