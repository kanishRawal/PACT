'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { 
    ArrowRight, 
    ShieldCheck, 
    PenTool, 
    UserCheck, 
    Link2, 
    CheckCircle2, 
    Lock, 
    Sparkles,
    Activity
} from 'lucide-react';

const FaceVerification = dynamic(() => import('@/components/FaceVerification'), { ssr: false });

export default function NewAgreementWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [user, setUser] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        partyAName: '',
        partyAEmail: '',
        partyBName: '',
        partyBEmail: '',
        amount: '',
        agreementType: 'General',
        dueDate: '',
        location: ''
    });

    const [agreementId, setAgreementId] = useState<string | null>(null);
    const [partyAHash, setPartyAHash] = useState<string | null>(null);
    const [partyBHash, setPartyBHash] = useState<string | null>(null);

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (!userStr) {
            router.push('/auth');
            return;
        }
        const userData = JSON.parse(userStr);
        setUser(userData);
        setFormData(prev => ({ ...prev, partyAName: userData.name, partyAEmail: userData.email }));
    }, [router]);

    const createAgreement = async () => {
        setIsSubmitting(true);
        try {
            const token = Cookies.get('token');
            const res = await fetch('/api/agreements', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.status === 401) {
                Cookies.remove('user');
                Cookies.remove('token');
                router.push('/auth');
                return;
            }

            const data = await res.json();
            if (data.success) {
                setAgreementId(data.data._id);
                setStep(2);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyParty = async (party: 'A' | 'B', hash: string) => {
        try {
            const token = Cookies.get('token');
            const res = await fetch(`/api/agreements/${agreementId}/verify`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ party, hash })
            });

            const data = await res.json();

            if (data.success) {
                if (party === 'A') setPartyAHash(hash);
                if (party === 'B') setPartyBHash(hash);
            } else {
                throw new Error(data.message);
            }

            if (party === 'A' && partyBHash) setStep(3);
            if (party === 'B' && partyAHash) setStep(3);

        } catch (err) {
            console.error(err);
        }
    };

    const inputCls = "w-full bg-[#141619] border border-[#2C2E3A] text-white rounded-2xl px-6 py-4 focus:outline-none focus:border-[#0A21C0] transition-all font-medium placeholder:text-[#B3B4BD]/20";

    return (
        <div className="min-h-screen bg-[#141619] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto animate-fade-in py-10">
                {/* Contextual Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#050A44] border border-[#0A21C0]/20 mb-4 transition-all hover:border-[#0A21C0]/40 cursor-default shadow-[0_0_20px_rgba(10,33,192,0.1)]">
                        <Lock className="w-3 h-3 text-[#0A21C0]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0A21C0]">Secure Entry Stream</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">Initialize PACT</h1>
                    <p className="mt-4 text-[10px] text-[#B3B4BD] font-black uppercase tracking-[0.3em] opacity-60">
                        Phase {step} <span className="text-[#0A21C0]/30">::</span> Immutable Records Unit
                    </p>
                </div>

                {/* Wizard Modular Card */}
                <div className="rounded-[2.5rem] border border-[#2C2E3A] bg-[#2C2E3A]/40 shadow-2xl overflow-hidden relative group backdrop-blur-3xl">
                    
                    {/* Progress Indicators */}
                    <div className="border-b border-[#2C2E3A] px-10 py-10 bg-[#141619]/50">
                        <div className="flex items-center justify-between max-w-2xl mx-auto relative z-10">
                            <StepIndicator currentStep={step} stepNum={1} icon={PenTool} label="Draft" />
                            <div className="flex-1 px-4">
                                <div className={`h-0.5 transition-all duration-700 rounded-full ${step >= 2 ? 'bg-[#0A21C0] shadow-[0_0_15px_#0A21C0]' : 'bg-[#2C2E3A]'}`}></div>
                            </div>
                            <StepIndicator currentStep={step} stepNum={2} icon={UserCheck} label="Verify" />
                            <div className="flex-1 px-4">
                                <div className={`h-0.5 transition-all duration-700 rounded-full ${step >= 3 ? 'bg-[#0A21C0] shadow-[0_0_15px_#0A21C0]' : 'bg-[#2C2E3A]'}`}></div>
                            </div>
                            <StepIndicator currentStep={step} stepNum={3} icon={Link2} label="Seal" />
                        </div>
                    </div>

                    <div className="p-10 sm:p-14">
                        {step === 1 && (
                            <div className="animate-slide-up space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B3B4BD] ml-2 opacity-60">Agreement Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Software Licensing PACT"
                                            className={inputCls}
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B3B4BD] ml-2 opacity-60">Agreement Type</label>
                                        <select
                                            className={inputCls}
                                            value={formData.agreementType}
                                            onChange={(e) => setFormData({...formData, agreementType: e.target.value})}
                                        >
                                            <option value="General">General Commitment</option>
                                            <option value="Service">Service Level PACT</option>
                                            <option value="Asset">Asset Transfer</option>
                                            <option value="Personal">Personal Voucher</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B3B4BD] ml-2 opacity-60">Finality Date (Due)</label>
                                        <input
                                            type="date"
                                            className={inputCls}
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B3B4BD] ml-2 opacity-60">Nominal Amount (Optional)</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className={inputCls}
                                            value={formData.amount}
                                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B3B4BD] ml-2 opacity-60">Detailed Description</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Describe the commitment in full detail..."
                                        className={`${inputCls} resize-none`}
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B3B4BD] ml-2 opacity-60">Recipient Name</label>
                                        <input
                                            type="text"
                                            placeholder="Counterparty Full Name"
                                            className={inputCls}
                                            value={formData.partyBName}
                                            onChange={(e) => setFormData({...formData, partyBName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B3B4BD] ml-2 opacity-60">Recipient Email</label>
                                        <input
                                            type="email"
                                            placeholder="counterparty@pact.com"
                                            className={inputCls}
                                            value={formData.partyBEmail}
                                            onChange={(e) => setFormData({...formData, partyBEmail: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-12 border-t border-[#2C2E3A]">
                                    <button
                                        onClick={createAgreement}
                                        disabled={isSubmitting || !formData.title || !formData.description || !formData.partyBName || !formData.partyBEmail || !formData.dueDate}
                                        className="group inline-flex items-center px-12 py-5 text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl text-white bg-[#0A21C0] hover:bg-white hover:text-[#0A21C0] transition-all shadow-[0_0_40px_rgba(10,33,192,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Processing Network...' : 'Finalize Draft'}
                                        <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-slide-up space-y-12">
                                <div className="text-center space-y-2 mb-10">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Identity Synchronization</h3>
                                    <p className="text-[10px] text-[#B3B4BD] font-black uppercase tracking-widest opacity-40">Verifying peer-to-peer commitment integrity</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="bg-[#141619] p-10 rounded-[2rem] border border-[#2C2E3A] relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0A21C0]/5 blur-2xl group-hover:bg-[#0A21C0]/10 transition-colors"></div>
                                        <h3 className="text-white font-black text-xs uppercase tracking-widest mb-8 border-b border-[#2C2E3A] pb-4">{formData.partyAName} <span className="opacity-30 ml-2">(Creator)</span></h3>
                                        {partyAHash ? (
                                            <div className="flex items-center space-x-3 text-[#22C55E] bg-[#22C55E]/5 p-4 rounded-xl border border-[#22C55E]/10">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Session</span>
                                            </div>
                                        ) : (
                                            <FaceVerification partyName={formData.partyAName} onVerified={(hash) => verifyParty('A', hash)} />
                                        )}
                                    </div>
                                    <div className="bg-[#141619] p-10 rounded-[2rem] border border-[#2C2E3A] relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0A21C0]/5 blur-2xl group-hover:bg-[#0A21C0]/10 transition-colors"></div>
                                        <h3 className="text-white font-black text-xs uppercase tracking-widest mb-8 border-b border-[#2C2E3A] pb-4">{formData.partyBName} <span className="opacity-30 ml-2">(Recipient)</span></h3>
                                        {partyBHash ? (
                                            <div className="flex items-center space-x-3 text-[#22C55E] bg-[#22C55E]/5 p-4 rounded-xl border border-[#22C55E]/10">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Session</span>
                                            </div>
                                        ) : (
                                            <FaceVerification partyName={formData.partyBName} onVerified={(hash) => verifyParty('B', hash)} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-slide-up text-center py-16">
                                <div className="relative w-32 h-32 mx-auto mb-10">
                                    <div className="absolute inset-0 bg-[#0A21C0] blur-[60px] opacity-20 rounded-full animate-pulse"></div>
                                    <div className="relative w-full h-full bg-[#141619] border border-[#0A21C0]/30 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                                        <CheckCircle2 className="w-12 h-12 text-[#0A21C0]" />
                                    </div>
                                </div>
                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-6">PACT Synchronized</h2>
                                <p className="text-[10px] text-[#B3B4BD] mb-14 max-w-sm mx-auto leading-relaxed font-black uppercase tracking-[0.2em] opacity-60">
                                    Your digital commitment is now cryptographically secured and live on the record unit.
                                </p>
                                <button
                                    onClick={() => router.push(`/agreements/${agreementId}`)}
                                    className="group inline-flex items-center px-12 py-5 text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl text-white bg-[#0A21C0] hover:bg-white hover:text-[#0A21C0] transition-all shadow-[0_0_40px_rgba(10,33,192,0.3)]"
                                >
                                    <Link2 className="w-4.5 h-4.5 mr-3" />
                                    Security Console
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StepIndicator({ currentStep, stepNum, icon: Icon, label }: { currentStep: number, stepNum: number, icon: any, label: string }) {
    const isActive = currentStep === stepNum;
    const isCompleted = currentStep > stepNum;
    
    return (
        <div className={`flex flex-col items-center group relative transition-all duration-500 ${isActive || isCompleted ? 'scale-110' : 'opacity-20 grayscale'}`}>
            <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all border-2 ${
                isActive ? 'bg-[#0A21C0] border-transparent text-white shadow-[0_0_30px_rgba(10,33,192,0.5)]' : 
                isCompleted ? 'bg-[#141619] border-[#0A21C0]/40 text-[#0A21C0]' : 
                'bg-[#141619] border-[#2C2E3A] text-[#B3B4BD]'
            }`}>
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>
            <p className={`mt-4 text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isActive ? 'text-white' : 'text-[#B3B4BD] opacity-40'}`}>
                {label}
            </p>
        </div>
    );
}
