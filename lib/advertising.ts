import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
export function database(){if(!env.DB)throw new Error('Database is not configured');return env.DB}
export function isSameOrigin(request:Request){const origin=request.headers.get('Origin');return Boolean(origin&&origin===new URL(request.url).origin)}
export async function reviewer(){const user=await getChatGPTUser();if(!user)return null;const allowed=(process.env.ADMIN_USER_IDS||'').split(',').map(s=>s.trim()).filter(Boolean);const emails=(env.ADMIN_REVIEWER_EMAILS||process.env.ADMIN_REVIEWER_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);if(allowed.includes(user.userId)||emails.includes(user.email.toLowerCase())||(process.env.NODE_ENV!=='production'&&user.userId==='local_seedy'))return user;return null}
export function clean(value:unknown,max:number){return typeof value==='string'?value.normalize('NFKC').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max+1):''}
export function json(value:unknown,status=200){return Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
