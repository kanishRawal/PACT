import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PACT - Predictive AI-Backed Commitment Technology',
  description: 'A premium micro-agreement platform for everyday commitments verified with Face ID.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-12">
              <Link href="/" className="flex items-center space-x-0.5 group">
                <div className="w-7 h-7 rounded-lg bg-[#0B3D91] flex items-center justify-center transition-transform group-hover:scale-105">
                  <span className="text-white font-bold text-xs leading-none">P</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-[#0B1527]">ACT</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/how-it-works" className="text-sm font-semibold text-[#1F2937] hover:text-[#0B3D91] transition-colors">How it works</Link>

                <Link href="/auth" className="text-sm font-semibold text-[#0B3D91] hover:text-blue-800 transition-colors">Sign In</Link>
                <Link href="/auth" className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#0B3D91] hover:bg-[#0A3075] transition-all shadow-md hover:shadow-lg active:scale-95">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-100 mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <p className="text-sm text-gray-400">© 2026 PACT Technology. All rights reserved.</p>
            <div className="flex space-x-2 text-sm text-gray-400">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> System Operational</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
