import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function proxy(request:NextRequest){const response=NextResponse.next();response.headers.set('X-Content-Type-Options','nosniff');response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');response.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');response.headers.set('X-Robots-Tag','noindex, nofollow');if(request.nextUrl.pathname.startsWith('/admin')||request.nextUrl.pathname.startsWith('/api'))response.headers.set('Cache-Control','no-store');return response}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
