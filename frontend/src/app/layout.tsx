import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LayoutWrapper } from '../components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PACT - Predictive AI Commitment Tool',
  description: 'A premium micro-agreement platform for everyday commitments with secure verifications.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-[#070F2B] text-white flex flex-col`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
