import Link from 'next/link';
import { PenTool, UserCheck, ShieldCheck, ArrowRight, PlayCircle } from 'lucide-react';

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-[#030914] text-white selection:bg-blue-500/30 font-sans overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400">
                        How PACT Works
                    </h1>
                    <p className="text-xl text-gray-400 font-light leading-relaxed">
                        Executing a legally binding, cryptographically secure micro-agreement takes less than 60 seconds. Here is exactly how the process works.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[39px] md:left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0 md:-translate-x-1/2 pointer-events-none"></div>

                    <div className="space-y-24">
                        {/* Step 1 */}
                        <div className="relative flex flex-col md:flex-row items-start md:items-center group animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                            <div className="hidden md:block w-1/2 pr-16 text-right">
                                <h3 className="text-3xl font-bold text-white mb-3">1. Draft the Terms</h3>
                                <p className="text-gray-400 font-light text-lg">
                                    Initiator sets the core parameters: description, counterparty email, due date, and optional financial terms. The contract is immediately generated in a pending state.
                                </p>
                            </div>
                            
                            <div className="absolute left-[16px] md:relative md:left-auto md:mx-auto z-10 w-12 h-12 rounded-full bg-[#0A192F] border-2 border-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform bg-gradient-to-br from-[#0B3D91] to-blue-600">
                                <PenTool className="w-5 h-5 text-white" />
                            </div>

                            <div className="pl-20 md:pl-0 md:w-1/2 md:flex md:justify-start md:pl-16">
                                <div className="bg-[#0A192F] p-8 rounded-3xl border border-white/10 group-hover:border-blue-500/30 transition-colors w-full shadow-2xl">
                                    <div className="space-y-4 opacity-50">
                                        <div className="h-4 bg-white/10 rounded w-1/3"></div>
                                        <div className="h-10 bg-white/5 rounded-xl w-full border border-white/5"></div>
                                        <div className="h-24 bg-white/5 rounded-xl w-full border border-white/5"></div>
                                    </div>
                                    <div className="md:hidden mt-6">
                                        <h3 className="text-2xl font-bold text-white mb-2">1. Draft the Terms</h3>
                                        <p className="text-gray-400 font-light text-sm">Initiator sets the core parameters: description, counterparty email, and due date.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col md:flex-row items-start md:items-center group animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                            
                            <div className="pl-20 md:pl-0 md:w-1/2 md:flex md:justify-end md:pr-16 order-2 md:order-1">
                                <div className="bg-[#0A192F] p-8 rounded-3xl border border-white/10 group-hover:border-purple-500/30 transition-colors w-full shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-x-0 h-1 top-1/2 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                                    <div className="w-20 h-20 mx-auto border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                            <UserCheck className="w-8 h-8 text-purple-400" />
                                        </div>
                                    </div>
                                    <div className="md:hidden mt-6">
                                        <h3 className="text-2xl font-bold text-white mb-2">2. Local Face ID</h3>
                                        <p className="text-gray-400 font-light text-sm">Both parties perform an on-device biometric scan. No images are stored, only mathematical representations.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute left-[16px] md:relative md:left-auto md:mx-auto z-10 w-12 h-12 rounded-full bg-[#0A192F] border-2 border-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform bg-gradient-to-br from-purple-900 to-purple-600 order-1 md:order-2">
                                <UserCheck className="w-5 h-5 text-white" />
                            </div>

                            <div className="hidden md:block w-1/2 pl-16 text-left order-3">
                                <h3 className="text-3xl font-bold text-white mb-3">2. Local Face ID</h3>
                                <p className="text-gray-400 font-light text-lg">
                                    Both parties perform an on-device biometric scan. Our AI extracts facial landmarks securely. No images are ever saved or transmitted to our servers.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex flex-col md:flex-row items-start md:items-center group animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                            <div className="hidden md:block w-1/2 pr-16 text-right">
                                <h3 className="text-3xl font-bold text-white mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">3. Secure CIH Lock</h3>
                                <p className="text-gray-400 font-light text-lg">
                                    The agreement details and biometric descriptors are hashed together to create the immutable Commitment Integrity Hash (CIH). The PDF is instantly generated.
                                </p>
                            </div>
                            
                            <div className="absolute left-[16px] md:relative md:left-auto md:mx-auto z-10 w-12 h-12 rounded-full bg-[#0A192F] border-2 border-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-transform bg-gradient-to-br from-green-900 to-green-600">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>

                            <div className="pl-20 md:pl-0 md:w-1/2 md:flex md:justify-start md:pl-16">
                                <div className="bg-[#0A192F] p-8 rounded-3xl border border-white/10 group-hover:border-green-500/30 transition-colors w-full shadow-2xl">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShieldCheck className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div className="font-mono text-xs text-green-400 break-all">
                                            b8a9f...e4c2a
                                        </div>
                                        <div className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            CIH Generated
                                        </div>
                                    </div>
                                    <div className="md:hidden mt-6">
                                        <h3 className="text-2xl font-bold text-white mb-2">3. Secure CIH Lock</h3>
                                        <p className="text-gray-400 font-light text-sm">The agreement details and biometrics are merged into an immutable Commitment Integrity Hash (CIH).</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-32 text-center relative z-10 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                    <div className="inline-block p-1 rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30">
                        <Link href="/auth" className="group flex items-center justify-center px-10 py-5 rounded-full text-lg font-bold text-white bg-[#0A192F] hover:bg-black transition-all shadow-2xl hover:shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                            <PlayCircle className="w-6 h-6 mr-3 text-blue-400 group-hover:text-white transition-colors" />
                            Start Your First PACT
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
