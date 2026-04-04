'use client';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ParticleCanvas from '@/components/ParticleCanvas';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setHeroVisible(y / window.innerHeight > 0.75);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="w-full bg-[#030308] text-white selection:bg-[#5C5CFF]/30 selection:text-white">

      {/* ── Fixed particle canvas overlay ── */}
      <ParticleCanvas />

      {/* ── Section 1: PACT Hero (particles render the text) ── */}
      <section className="h-screen relative flex items-center justify-center overflow-hidden">
        <h1 className="sr-only">PACT</h1>
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[400px] bg-[#5C5CFF]/8 blur-[120px] rounded-full" />
        </div>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }} />

        {/* ── Supplemental UX Labels (Static in Section 1) ── */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-all duration-700"
          style={{ opacity: Math.max(0, 1 - scrollY / 300), transform: `translateY(${scrollY * -0.2}px)` }}
        >
          <div className="relative w-full max-w-[85vw] md:max-w-4xl aspect-[4/1] flex items-center justify-center">
            {/* Top Right Label */}
            <div className="absolute top-0 right-0 sm:right-[-40px] transform -translate-y-12 sm:-translate-y-20 flex flex-col items-end">
              <span className="text-[#5C5CFF]/60 font-mono text-[13px] sm:text-[18px] font-black uppercase tracking-[0.5em] drop-shadow-[0_0_15px_rgba(92,92,255,0.3)]">
                Don't rely on memory or messages
              </span>
              <div className="w-12 h-px bg-gradient-to-l from-[#5C5CFF]/30 to-transparent mt-2" />
            </div>

            {/* Bottom Left Label */}
            <div className="absolute bottom-0 left-0 sm:left-[-40px] transform translate-y-12 sm:translate-y-20 flex flex-col items-start">
              <div className="w-12 h-px bg-gradient-to-r from-[#5C5CFF]/30 to-transparent mb-2" />
              <span className="text-[#5C5CFF]/60 font-mono text-[13px] sm:text-[18px] font-black uppercase tracking-[0.5em] drop-shadow-[0_0_15px_rgba(92,92,255,0.3)]">
                Secure it before it becomes a dispute
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Tagline Hero (particles morph into this) ── */}
      <section className="h-screen relative flex flex-col items-center justify-start pt-[68vh] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[350px] bg-[#5C5CFF]/6 blur-[100px] rounded-full" />
        </div>
        {/* Subtitle + CTA fade in once particles form the tagline */}
        <div className={`text-center relative z-10 transition-all duration-1000 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-400 mb-12 font-light">
            PACT is the ultimate micro-agreement platform. Create, securely sign, and biometrically verify your commitments with absolute certainty.
          </p>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#5C5CFF]/20 blur-2xl rounded-full" />
            <Link href="/auth" className="group relative inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-full text-white bg-white/10 border border-white/20 hover:bg-white hover:text-black overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(92,92,255,0.5)]">
              Create Your First PACT <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-32 bg-black relative border-t border-white/5">
        <div className="absolute left-1/2 -top-[200px] -translate-x-1/2 w-[800px] h-[400px] bg-[#5C5CFF]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">How PACT works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {[
              { n: '1', title: 'Draft Terms', desc: 'Input the basics: who, what, when, and how much. Keep it simple and clear.', glow: 'bg-[#5C5CFF]/20' },
              { n: '2', title: 'Verify Identities', desc: 'Both parties confirm the agreement layout via rapid local Face ID technology.', glow: 'bg-purple-500/20' },
              { n: '3', title: 'Generate Proof', desc: 'PACT issues a fully secure, printable PDF certificate with an AVID stamp.', glow: 'bg-green-500/20' },
            ].map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#0A0A1F] border-2 border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 relative group">
                  <div className={`absolute inset-0 ${s.glow} rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <span className="text-3xl font-bold text-white">{s.n}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-32 relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A1F] to-black" />
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
