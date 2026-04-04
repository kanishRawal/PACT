'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ShieldCheck, ArrowRight, Lock, Fingerprint, Mail, Key, User } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isLogin) {
            const nameRegex = /^[a-zA-Z\s'\-]+$/;
            if (!name.trim()) {
                setError('Full name is required');
                return;
            }
            if (!nameRegex.test(name)) {
                setError('Name contains invalid characters. Only standard letters are allowed.');
                return;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const payload = isLogin 
                ? { email: email.trim(), password } 
                : { name: name.trim(), email: email.trim(), password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Authentication failed');
            }

            Cookies.set('token', data.data.token);
            Cookies.set('user', JSON.stringify(data.data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#141619] text-white font-sans overflow-hidden">
            
            {/* Left — Brand panel */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-20 bg-gradient-to-br from-[#050A44] to-[#141619] border-r border-[#2C2E3A]">
                {/* Ambient glows */}
                <div className="absolute top-0 left-0 w-full h-full bg-[#0A21C0]/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center space-x-1 group cursor-pointer">
                        <div className="w-1 h-6 bg-[#0A21C0] rounded-full group-hover:scale-y-110 transition-transform"></div>
                        <div className="w-1 h-4 bg-[#B3B4BD] rounded-full group-hover:scale-y-125 transition-transform"></div>
                        <div className="w-1 h-7 bg-[#0A21C0] rounded-full group-hover:scale-y-110 transition-transform"></div>
                        <span className="text-2xl font-black tracking-tighter ml-3">PACT</span>
                    </div>
                </div>

                <div className="relative z-10 max-lg:max-w-lg animate-slide-up">
                    <h2 className="text-6xl font-black tracking-tight mb-8 leading-none uppercase">
                        From <span className="text-[#0A21C0]">handshake</span>
                        <br />
                        To <span className="text-white/20 italic">hard proof.</span>
                    </h2>
                    <p className="text-sm text-[#B3B4BD] font-bold uppercase tracking-widest leading-relaxed mb-16 opacity-80">
                        The infrastructure powering next-generation digital commitments. Immutable records, cryptographic certainty.
                    </p>
                    
                    <div className="space-y-8">
                        <div className="flex items-center group">
                            <div className="w-12 h-12 rounded-2xl bg-[#141619] border border-[#2C2E3A] flex items-center justify-center mr-6 group-hover:border-[#0A21C0]/50 transition-all shadow-lg">
                                <Fingerprint className="w-5 h-5 text-[#0A21C0]" />
                            </div>
                            <span className="text-[#B3B4BD] text-[10px] font-black uppercase tracking-[0.2em]">Zero-Knowledge Verifications</span>
                        </div>
                        <div className="flex items-center group">
                            <div className="w-12 h-12 rounded-2xl bg-[#141619] border border-[#2C2E3A] flex items-center justify-center mr-6 group-hover:border-[#0A21C0]/50 transition-all shadow-lg">
                                <ShieldCheck className="w-5 h-5 text-[#0A21C0]" />
                            </div>
                            <span className="text-[#B3B4BD] text-[10px] font-black uppercase tracking-[0.2em]">Immutable Ledger Integrity</span>
                        </div>
                        <div className="flex items-center group">
                            <div className="w-12 h-12 rounded-2xl bg-[#141619] border border-[#2C2E3A] flex items-center justify-center mr-6 group-hover:border-[#0A21C0]/50 transition-all shadow-lg">
                                <Lock className="w-5 h-5 text-[#0A21C0]" />
                            </div>
                            <span className="text-[#B3B4BD] text-[10px] font-black uppercase tracking-[0.2em]">Tamper-Proof Certificates</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-[10px] text-[#B3B4BD]/40 font-black uppercase tracking-widest">
                    © {new Date().getFullYear()} PACT TECHNOLOGY :: SECURED
                </div>
            </div>

            {/* Right — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0A21C0]/5 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="w-full max-w-md animate-fade-in relative z-10">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-12">
                        <div className="flex items-center space-x-1">
                            <div className="w-1 h-6 bg-[#0A21C0] rounded-full"></div>
                            <div className="w-1 h-4 bg-[#B3B4BD] rounded-full"></div>
                            <div className="w-1 h-7 bg-[#0A21C0] rounded-full"></div>
                            <span className="text-2xl font-black tracking-tighter ml-3 text-white">PACT</span>
                        </div>
                    </div>

                    <div className="mb-12 text-center lg:text-left">
                        <h2 className="text-4xl font-black tracking-tight text-white mb-3 uppercase">
                            {isLogin ? 'Sign In' : 'Join PACT'}
                        </h2>
                        <p className="text-xs text-[#B3B4BD] font-bold uppercase tracking-widest opacity-70">
                            {isLogin ? 'Access your secure records' : 'Start your immutable journey'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="group">
                                <label className="block text-[10px] font-black text-[#B3B4BD] uppercase tracking-[0.2em] mb-3 ml-2">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#141619] border border-[#2C2E3A] text-white rounded-2xl px-6 py-4 pl-14 focus:outline-none focus:border-[#0A21C0] transition-all font-medium placeholder:text-[#B3B4BD]/20"
                                        placeholder="Identification Name"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                        <User className="h-4.5 w-4.5 text-[#B3B4BD]/40 group-focus-within:text-[#0A21C0] transition-colors" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="group">
                            <label className="block text-[10px] font-black text-[#B3B4BD] uppercase tracking-[0.2em] mb-3 ml-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#141619] border border-[#2C2E3A] text-white rounded-2xl px-6 py-4 pl-14 focus:outline-none focus:border-[#0A21C0] transition-all font-medium placeholder:text-[#B3B4BD]/20"
                                    placeholder="name@ledger.com"
                                />
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Mail className="h-4.5 w-4.5 text-[#B3B4BD]/40 group-focus-within:text-[#0A21C0] transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] font-black text-[#B3B4BD] uppercase tracking-[0.2em] mb-3 ml-2">Access Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#141619] border border-[#2C2E3A] text-white rounded-2xl px-6 py-4 pl-14 focus:outline-none focus:border-[#0A21C0] transition-all font-medium placeholder:text-[#B3B4BD]/20"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Key className="h-4.5 w-4.5 text-[#B3B4BD]/40 group-focus-within:text-[#0A21C0] transition-colors" />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center space-x-3 text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/5 p-5 rounded-2xl border border-red-500/10">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center items-center py-4.5 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white bg-[#0A21C0] hover:bg-white hover:text-[#0A21C0] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(10,33,192,0.3)]"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                        Establishing...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        {isLogin ? 'Establish Session' : 'Create Record'}
                                        <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center text-[10px] font-black uppercase tracking-widest text-[#B3B4BD]/40">
                        {isLogin ? "New to the platform?" : "Already verified?"}{' '}
                        <button 
                            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                            className="text-[#0A21C0] hover:text-white transition-colors ml-1 font-black"
                        >
                            {isLogin ? 'Join PACT' : 'Sign In'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
