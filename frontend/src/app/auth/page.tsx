'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ShieldCheck, ArrowRight, Lock, Fingerprint, Mail, Key } from 'lucide-react';
import Link from 'next/link';

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
        
        // Client-side Validation (Explicitly allows uppercase S, I, standard passwords, etc.)
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            Cookies.set('token', data.token);
            Cookies.set('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#030914] text-white selection:bg-blue-500/30 font-sans">
            
            {/* Left Side: Brand & Visuals */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-16 border-r border-white/10 bg-gradient-to-br from-[#0A192F] to-[#040C1A]">
                {/* Glow effects */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 flex items-center mb-12">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mr-3 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">PACT</span>
                </div>

                <div className="relative z-10 max-w-md animate-slide-up">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-6 leading-tight">Securing trust with absolute precision.</h2>
                    <p className="text-lg text-gray-400 font-light mb-12">Every agreement sealed with cryptographic certainty and verified through immutable biometric data.</p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-4">
                                <Fingerprint className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-gray-300 font-medium tracking-wide text-sm">Face ID Verification Standard</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-4">
                                <ShieldCheck className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="text-gray-300 font-medium tracking-wide text-sm">Tamper-Proof CIH Cryptography</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-12 text-sm text-gray-600 font-medium">
                    © {new Date().getFullYear()} PACT. Predictive AI-Backed Commitment Technology.
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden">
                {/* Mobile glow */}
                <div className="lg:hidden absolute top-0 -left-1/2 w-full h-[300px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="w-full max-w-md animate-fade-in relative z-10">
                    
                    {/* Mobile Logo Logo */}
                    <div className="lg:hidden flex justify-center mb-12">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mr-3 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">PACT</span>
                        </div>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-gray-400 text-sm font-medium">
                            {isLogin ? 'Enter your credentials to access your secure dashboard.' : 'Sign up to start executing cryptographic agreements.'}
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="space-y-1 group">
                                <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 transition-colors group-focus-within:text-blue-400">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#0A192F] border border-white/10 text-white rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-gray-600"
                                        placeholder="John Doe"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1 group">
                            <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 transition-colors group-focus-within:text-blue-400">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0A192F] border border-white/10 text-white rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-gray-600"
                                    placeholder="name@example.com"
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 group">
                            <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1.5 transition-colors group-focus-within:text-blue-400">Password</label>
                            <div className="relative flex flex-col items-end">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0A192F] border border-white/10 text-white rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-gray-600"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Key className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                {isLogin && (
                                    <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors mt-2 font-medium">Forgot password?</button>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 font-medium">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center items-center py-4 px-4 rounded-xl font-bold text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                                        Authenticating...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        {isLogin ? 'Sign In Securely' : 'Create Immutable Account'}
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
                            className="text-white hover:text-blue-400 transition-colors font-semibold py-1 px-2 -mx-2 rounded-md hover:bg-white/5"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
