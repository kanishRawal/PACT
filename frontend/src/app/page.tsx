import { ShieldCheck, Zap, FileCheck, CheckCircle2, Lock, ArrowRight, Fingerprint, Activity, Clock, FileBadge } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="w-full bg-[#030914] text-white selection:bg-blue-500/30 selection:text-white overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-sm font-semibold mb-8 backdrop-blur-md animate-fade-in shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-1 ring-white/5">
            <Lock className="w-4 h-4 mr-2 text-blue-400" /> Enter the new era of verified agreements
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8 animate-slide-up bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            Trust <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-indigo-400">verified</span> in seconds.
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-400 mb-12 animate-slide-up font-light" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            PACT is the ultimate micro-agreement platform. Create, cryptographically sign, and biometrically verify your commitments with absolute certainty.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md animate-slide-up relative" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
            <Link href="/auth" className="group relative inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-full text-white bg-white/10 border border-white/20 hover:bg-white hover:text-black overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] w-full sm:w-auto z-10">
              Create Your First PACT <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
        </div>
      </section>



      {/* Features Bento Box */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">Uncompromising <span className="text-blue-400">precision.</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl font-light">Engineered for absolute trust. PACT replaces clumsy legal red tape with mathematical certainty and biometric validation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2 bg-[#0A192F] rounded-3xl p-10 border border-white/10 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors"></div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-8 border border-blue-500/30">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">60-Second Creation</h3>
              <p className="text-lg text-gray-400 font-light max-w-md">Our streamlined wizard layout gets your terms documented instantly. No legal jargon required. Just pure intent.</p>
            </div>
            
            <div className="bg-[#0A192F] rounded-3xl p-10 border border-white/10 hover:border-blue-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-8 border border-purple-500/30">
                <Fingerprint className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Biometric Verification</h3>
              <p className="text-gray-400 font-light leading-relaxed">Privacy-focused Face ID verification. Both parties confirm presence without storing raw images.</p>
            </div>

            <div className="bg-[#0A192F] rounded-3xl p-10 border border-white/10 hover:border-blue-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-8 border border-green-500/30">
                <FileCheck className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Tamper-Proof PDFs</h3>
              <p className="text-gray-400 font-light leading-relaxed">Cryptographic hash (CIH) ensures integrity, formatted into a professional PDF ready to share.</p>
            </div>

            <div className="md:col-span-2 bg-gradient-to-br from-[#0A192F] to-[#040C1A] rounded-3xl p-10 border border-white/10 relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-8 border border-indigo-500/30">
                <ShieldCheck className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Military-Grade Security</h3>
              <p className="text-lg text-gray-400 font-light max-w-lg">Every agreement generates a unique Commitment Integrity Hash (CIH). Once executed, the contract is locked permanently. Neither party can alter the facts.</p>
            </div>

          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 bg-black relative border-t border-white/5">
        <div className="absolute left-1/2 -top-[200px] -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">How PACT works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#0A192F] border-2 border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 relative group">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Draft Terms</h3>
              <p className="text-gray-400 font-light leading-relaxed">Input the basics: who, what, when, and how much. Keep it simple and clear.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#0A192F] border-2 border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 relative group">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Verify Identities</h3>
              <p className="text-gray-400 font-light leading-relaxed">Both parties confirm the agreement layout via rapid local Face ID technology.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#0A192F] border-2 border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 relative group">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Generate Proof</h3>
              <p className="text-gray-400 font-light leading-relaxed">PACT issues a mathematically secure, printable PDF certificate with a CIH stamp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F] to-black"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready to seal the deal?</h2>
          <p className="text-xl text-gray-400 font-light mb-12">Join early adopters securing their micro-agreements with predictive confidence.</p>
          <Link href="/auth" className="group relative inline-flex justify-center items-center px-10 py-5 text-lg font-bold rounded-full text-black bg-white hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.3)]">
            Create Your First PACT <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

    </div>
  );
}
