'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from './Sidebar';
import { Lock } from 'lucide-react';

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname() || '/';

    // Public routes that use the Top Navbar
    const isPublicRoute = pathname === '/' || pathname.startsWith('/auth');

    if (isPublicRoute) {
        return (
            <>
                <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
                    <nav className="bg-[#141619]/90 backdrop-blur-2xl border border-[#2C2E3A] rounded-2xl px-6 py-2.5 flex items-center space-x-12 shadow-[0_0_40px_rgba(10,33,192,0.15)] pointer-events-auto max-w-4xl w-full sm:w-auto">
                        <Link href="/" className="flex items-center space-x-3 group mr-4">
                            <div className="relative flex items-center justify-center space-x-1">
                                <div className="w-1 h-6 bg-[#0A21C0] rounded-full group-hover:scale-y-110 transition-transform"></div>
                                <div className="w-1 h-4 bg-[#B3B4BD] rounded-full group-hover:scale-y-125 transition-transform"></div>
                                <div className="w-1 h-7 bg-[#0A21C0] rounded-full group-hover:scale-y-110 transition-transform"></div>
                            </div>
                            <span className="font-black text-xl tracking-tighter text-white">PACT</span>
                        </Link>
                        <div className="hidden sm:flex items-center space-x-10">
                            <Link href="/#how-it-works" className="text-[10px] font-black tracking-[0.2em] text-[#B3B4BD] hover:text-[#0A21C0] transition-all uppercase">How it works</Link>
                            <Link href="/auth" className="text-[10px] font-black tracking-[0.2em] text-[#B3B4BD] hover:text-[#0A21C0] transition-all uppercase">Sign In</Link>
                            <Link href="/auth" className="bg-[#0A21C0] text-white px-6 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] hover:bg-white hover:text-[#0A21C0] transition-all uppercase shadow-[0_0_20px_rgba(10,33,192,0.3)]">
                                New Agreement
                            </Link>
                        </div>
                    </nav>
                </div>
                <main className="flex-grow">{children}</main>
            </>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#141619]">
            <Sidebar />
            <main className="flex-grow pl-20 transition-all duration-500">
                {/* App Header (Optional/Contextual) */}
                <div className="max-w-7xl mx-auto px-8 py-10 relative">
                    {children}
                </div>
            </main>
        </div>
    );
};
