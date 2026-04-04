'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, PlusCircle, User, ShieldCheck, LogOut, Settings } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/auth');
    };

    const navItems = [
        { icon: <Home className="w-5 h-5" />, label: 'Home', href: '/' },
        { icon: <Layers className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
        { icon: <PlusCircle className="w-5 h-5" />, label: 'New PACT', href: '/agreements/new' },
        { icon: <User className="w-5 h-5" />, label: 'Profile', href: '/profile' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-8 bg-[#141619] border-r border-[#2C2E3A] z-50">
            {/* Logo */}
            <div className="mb-12 relative flex flex-col items-center space-y-1 group cursor-pointer">
                <div className="w-1 h-6 bg-[#0A21C0] rounded-full group-hover:scale-y-110 transition-transform"></div>
                <div className="w-1 h-4 bg-[#B3B4BD] rounded-full group-hover:scale-y-125 transition-transform"></div>
                <div className="w-1 h-7 bg-[#0A21C0] rounded-full group-hover:scale-y-110 transition-transform"></div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col space-y-6">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href}
                            href={item.href}
                            className={`group relative p-3.5 rounded-2xl transition-all duration-300 ${
                                isActive 
                                ? 'bg-[#0A21C0] text-white shadow-[0_0_30px_rgba(10,33,192,0.4)]' 
                                : 'text-[#B3B4BD] hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {item.icon}
                            {/* Tooltip */}
                            <span className="absolute left-full ml-4 px-3 py-1.5 bg-[#141619] text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-[#2C2E3A] shadow-2xl z-[60]">
                                {item.label}
                            </span>
                            {/* Active Dot */}
                            {isActive && (
                                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#0A21C0] rounded-r-full"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto flex flex-col space-y-4">
                <button className="p-3.5 text-[#B3B4BD] hover:text-white transition-colors group relative">
                    <Settings className="w-5 h-5" />
                    <span className="absolute left-full ml-4 px-3 py-1.5 bg-[#141619] text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-[#2C2E3A] shadow-2xl">Settings</span>
                </button>
                <button 
                    onClick={handleLogout}
                    className="p-3.5 text-[#B3B4BD] hover:text-red-500 transition-colors group relative"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="absolute left-full ml-4 px-3 py-1.5 bg-[#141619] text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-[#2C2E3A] shadow-2xl">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
