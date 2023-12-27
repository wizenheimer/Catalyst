import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/services/utils';
import NavBar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Catalyst',
    description: 'Streamline Contract Analysis'
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="light">
            <body
                className={cn(
                    'min-h-screen font-sans antialiased grainy',
                    inter.className
                )}
            >
                <NavBar />
                {children}
            </body>
        </html>
    );
}
