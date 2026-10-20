import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={
 title:'Seediva — Nutrition & Training',
 description:'Planting Vitality. Discovering new way to live.',
 applicationName:'Seediva',
 manifest:'/manifest.webmanifest',
 appleWebApp:{capable:true,title:'Seediva',statusBarStyle:'default'},
 icons:{apple:[{url:'/apple-touch-icon.png',sizes:'180x180',type:'image/png'}]},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
