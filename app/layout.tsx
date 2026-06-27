import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata={title:'Cutesy Scoop / Цэц ХК',description:'Монгол mystery scoop ecommerce demo'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="mn"><body>{children}</body></html>}
