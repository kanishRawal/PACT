'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { CheckCircle2, ArrowRight, PenTool, UserCheck, ShieldCheck, Link2 } from 'lucide-react';

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
        agreementType: 'money',
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const createAgreement = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/agreements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
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
            const res = await fetch(`/api/agreements/${agreementId}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    const inputCls = "w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium placeholder:text-gray-600";

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#050A18] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-10 text-center animate-slide-up">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Initialize PACT</h1>
                    <p className="mt-2 text-gray-500 text-sm font-medium">Define terms, assign counterparties, and establish a verifiable digital record.</p>
                </div>

                {/* Wizard */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#0B1120]/60 overflow-hidden relative">
                    
                    {/* Progress */}
                    <div className="border-b border-white/[0.04] px-8 py-6 bg-white/[0.01]">
                        <div className="flex items-center justify-between max-w-2xl mx-auto relative z-10">
                            <StepIndicator currentStep={step} stepNum={1} icon={<PenTool className="w-5 h-5" />} label="Draft" />
                            <div className={`flex-1 h-px mx-4 transition-colors duration-500 ${step >= 2 ? 'bg-blue-500' : 'bg-white/[0.06]'}`}></div>
                            <StepIndicator currentStep={step} stepNum={2} icon={<UserCheck className="w-5 h-5" />} label="Verify" />
                            <div className={`flex-1 h-px mx-4 transition-colors duration-500 ${step >= 3 ? 'bg-blue-500' : 'bg-white/[0.06]'}`}></div>
                            <StepIndicator currentStep={step} stepNum={3} icon={<ShieldCheck className="w-5 h-5" />} label="Seal" />
                        </div>
                    </div>

                    <div className="p-8 sm:p-10">
                        {step === 1 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="border-b border-white/[0.04] pb-5 mb-6">
                                    <h2 className="text-lg font-bold text-white">Define the commitment</h2>
                                    <p className="text-xs text-gray-500 mt-1">Detail the parameters, obligations, and limits of this contract.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title <span className="text-red-400">*</span></label>
                                        <input name="title" onChange={handleInputChange} value={formData.title} placeholder="e.g. Freelance Design Retainer" className={inputCls} />
                                    </div>

                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description <span className="text-red-400">*</span></label>
                                        <textarea name="description" onChange={handleInputChange} value={formData.description} rows={4} placeholder="Outline deliverables, expectations, and terms..." className={`${inputCls} resize-none`}></textarea>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
                                        <select name="agreementType" onChange={handleInputChange} value={formData.agreementType} className={`${inputCls} cursor-pointer`}>
                                            <option value="money">Financial / Payment</option>
                                            <option value="item return">Asset Handover</option>
                                            <option value="task commitment">Service / Task</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount (optional)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-gray-500 font-semibold text-sm">$</span>
                                            </div>
                                            <input type="number" name="amount" onChange={handleInputChange} value={formData.amount} placeholder="0.00" className={`${inputCls} pl-8`} />
                                        </div>
                                    </div>
                                    
                                    <div className="col-span-1 md:col-span-2 border-t border-white/[0.04] mt-4 pt-6">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Counterparty</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full name <span className="text-red-400">*</span></label>
                                        <input name="partyBName" onChange={handleInputChange} value={formData.partyBName} placeholder="Jane Smith" className={inputCls} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email <span className="text-red-400">*</span></label>
                                        <input type="email" name="partyBEmail" onChange={handleInputChange} value={formData.partyBEmail} placeholder="jane@example.com" className={inputCls} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Due date <span className="text-red-400">*</span></label>
                                        <input type="date" name="dueDate" onChange={handleInputChange} value={formData.dueDate} className={inputCls} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location (optional)</label>
                                        <input name="location" onChange={handleInputChange} value={formData.location} placeholder="San Francisco, CA" className={inputCls} />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 mt-6 border-t border-white/[0.04]">
                                    <button 
                                        onClick={createAgreement} 
                                        disabled={isSubmitting || !formData.title || !formData.description || !formData.partyBName || !formData.partyBEmail || !formData.dueDate}
                                        className="group inline-flex items-center px-8 py-3.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:grayscale"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Proceed to verification'}
                                        {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-slide-up space-y-8">
                                <div className="text-center rounded-2xl p-8 bg-white/[0.02] border border-white/[0.06]">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                        <ShieldCheck className="w-7 h-7 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Biometric verification required</h2>
                                    <p className="mt-2 text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                                        Both parties must verify their identity. Biometric data is processed locally and <span className="text-white font-semibold">never transmitted</span>.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                    <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-white/[0.04] -translate-x-1/2"></div>
                                    
                                    {/* Party A */}
                                    <div className="flex flex-col">
                                        <div className="mb-3">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Initiator</span>
                                            <h3 className="text-base font-bold text-white mt-0.5">{formData.partyAName}</h3>
                                        </div>
                                        
                                        <div className="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-blue-500/20 transition-colors">
                                            {partyAHash ? (
                                                <div className="h-full flex flex-col items-center justify-center p-8">
                                                    <div className="w-14 h-14 bg-emerald-500/[0.1] border border-emerald-500/[0.2] rounded-2xl flex items-center justify-center mb-4">
                                                        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                                                    </div>
                                                    <p className="font-bold text-white text-base">Authenticated</p>
                                                    <p className="text-[10px] text-emerald-400/60 font-mono mt-2 break-all text-center max-w-full px-4">{partyAHash}</p>
                                                </div>
                                            ) : (
                                                <div className="h-full p-5">
                                                    <FaceVerification partyName={formData.partyAName} onVerified={(hash) => verifyParty('A', hash)} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Party B */}
                                    <div className="flex flex-col">
                                        <div className="mb-3">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Counterparty</span>
                                            <h3 className="text-base font-bold text-white mt-0.5">{formData.partyBName}</h3>
                                        </div>
                                        
                                        <div className="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-blue-500/20 transition-colors">
                                            {partyBHash ? (
                                                <div className="h-full flex flex-col items-center justify-center p-8">
                                                    <div className="w-14 h-14 bg-emerald-500/[0.1] border border-emerald-500/[0.2] rounded-2xl flex items-center justify-center mb-4">
                                                        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                                                    </div>
                                                    <p className="font-bold text-white text-base">Authenticated</p>
                                                    <p className="text-[10px] text-emerald-400/60 font-mono mt-2 break-all text-center max-w-full px-4">{partyBHash}</p>
                                                </div>
                                            ) : (
                                                <div className="h-full p-5">
                                                    <FaceVerification partyName={formData.partyBName} onVerified={(hash) => verifyParty('B', hash)} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-slide-up text-center py-16">
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-15 rounded-full"></div>
                                    <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Agreement sealed</h2>
                                <p className="text-base text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
                                    The Agreement Verification ID has been created and your agreement is now securely finalized.
                                </p>
                                <button 
                                    onClick={() => router.push(`/agreements/${agreementId}`)} 
                                    className="group inline-flex items-center px-8 py-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5"
                                >
                                    <Link2 className="w-4.5 h-4.5 mr-2" />
                                    View certificate
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StepIndicator({ currentStep, stepNum, icon, label }: { currentStep: number, stepNum: number, icon: React.ReactNode, label: string }) {
    const isCompleted = currentStep > stepNum;
    const isActive = currentStep === stepNum;
    const isUpcoming = currentStep < stepNum;

    return (
        <div className="flex flex-col items-center group">
            <div className={`
                relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 z-10
                ${isCompleted ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''}
                ${isActive ? 'bg-white/[0.05] border border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : ''}
                ${isUpcoming ? 'bg-white/[0.02] text-gray-600 border border-white/[0.06]' : ''}
            `}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : icon}
            </div>
            <span className={`
                mt-2 text-[10px] font-bold tracking-wider uppercase transition-colors
                hidden md:block
                ${isCompleted ? 'text-white' : ''}
                ${isActive ? 'text-blue-400' : ''}
                ${isUpcoming ? 'text-gray-600' : ''}
            `}>
                {label}
            </span>
        </div>
    );
}
