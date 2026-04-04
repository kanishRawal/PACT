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
        <div className="min-h-[calc(100vh-64px)] flex bg-[#050A18] text-white">
            
            {/* Left — Brand panel */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-16">
                {/* Ambient glows */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/[0.06] blur-[150px] rounded-full pointer-events-none -translate-y-1/3 -translate-x-1/3"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/[0.05] blur-[120px] rounded-full pointer-events-none translate-y-1/3 translate-x-1/3"></div>
                
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
                
                <div className="relative z-10">
                    <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-1.5 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                            <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">ACT</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-md animate-slide-up">
                    <h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">From handshake</span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">to hard proof.</span>
                    </h2>
                    <p className="text-base text-gray-400 font-light leading-relaxed mb-14">
                        The infrastructure powering next-generation digital commitments — eliminating friction through cryptographic certainty.
                    </p>
                    
                    <div className="space-y-5">
                        <div className="flex items-center group">
                            <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mr-4 group-hover:border-blue-500/20 transition-colors">
                                <Fingerprint className="w-4.5 h-4.5 text-blue-400" />
                            </div>
                            <span className="text-gray-400 text-sm font-medium">Zero-knowledge facial verification</span>
                        </div>
                        <div className="flex items-center group">
                            <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mr-4 group-hover:border-emerald-500/20 transition-colors">
                                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                            </div>
                            <span className="text-gray-400 text-sm font-medium">Immutable commitment integrity hashes</span>
                        </div>
                        <div className="flex items-center group">
                            <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mr-4 group-hover:border-violet-500/20 transition-colors">
                                <Lock className="w-4.5 h-4.5 text-violet-400" />
                            </div>
                            <span className="text-gray-400 text-sm font-medium">Tamper-proof PDF certificates</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-gray-600 font-medium">
                    © {new Date().getFullYear()} PACT Technology
                </div>
            </div>

            {/* Right — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative overflow-hidden border-l border-white/[0.04]">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/[0.04] blur-[120px] rounded-full pointer-events-none"></div>

                <div className="w-full max-w-md animate-fade-in relative z-10">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-10">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-1.5 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                <span className="text-white font-bold text-sm">P</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">ACT</span>
                        </div>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">
                            {isLogin ? 'Sign in to access your secure dashboard.' : 'Get started with cryptographic agreements.'}
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="group">
                                <label className="block text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2 transition-colors group-focus-within:text-blue-400">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium placeholder:text-gray-600"
                                        placeholder="John Doe"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2 transition-colors group-focus-within:text-blue-400">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium placeholder:text-gray-600"
                                    placeholder="name@example.com"
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2 transition-colors group-focus-within:text-blue-400">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium placeholder:text-gray-600"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Key className="h-4 w-4 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/[0.06] p-4 rounded-xl border border-red-500/[0.1] font-medium">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center items-center py-4 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                        Authenticating...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        {isLogin ? 'Sign in' : 'Create account'}
                                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button 
                            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                            className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
