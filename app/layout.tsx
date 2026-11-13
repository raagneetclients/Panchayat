import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:{default:'जिला पंचायत धार | Development Prototype',template:'%s | जिला पंचायत धार'},description:'धार जिले की पंचायत व्यवस्था, ग्रामीण विकास, योजनाएँ और नागरिक सेवाएँ। Development prototype; official approval pending.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="hi" suppressHydrationWarning><body>{children}</body></html>}
