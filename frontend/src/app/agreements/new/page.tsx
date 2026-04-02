'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { CheckCircle2, ArrowRight, ArrowLeft, PenTool, UserCheck, ShieldCheck, Link2 } from 'lucide-react';

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
            setAgreementId(data._id);
            setStep(2);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyParty = async (party: 'A' | 'B', hash: string) => {
        try {
            await fetch(`/api/agreements/${agreementId}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ party, hash })
            });

            if (party === 'A') setPartyAHash(hash);
            if (party === 'B') setPartyBHash(hash);

            // If both verified, move to confirmation
            if (party === 'A' && partyBHash) setStep(3);
            if (party === 'B' && partyAHash) setStep(3);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#F5F7FA] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="mb-10 text-center animate-slide-up">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New PACT</h1>
                    <p className="mt-2 text-gray-500 font-medium">Draft your terms and verify identities cryptographically.</p>
                </div>

                {/* Wizard UI */}
                <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                    
                    {/* Progress Bar Header */}
                    <div className="bg-gray-50/80 border-b border-gray-100 px-8 py-6">
                        <div className="flex items-center justify-between max-w-2xl mx-auto relative z-10">
                            <StepIndicator currentStep={step} stepNum={1} icon={<PenTool className="w-5 h-5" />} label="Draft Terms" />
                            <div className={`flex-1 h-1 mx-4 rounded-full transition-colors duration-500 ease-in-out ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                            <StepIndicator currentStep={step} stepNum={2} icon={<UserCheck className="w-5 h-5" />} label="Verification" />
                            <div className={`flex-1 h-1 mx-4 rounded-full transition-colors duration-500 ease-in-out ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                            <StepIndicator currentStep={step} stepNum={3} icon={<ShieldCheck className="w-5 h-5" />} label="Secure Hash" />
                        </div>
                    </div>

                    <div className="p-8 sm:p-12">
                        {step === 1 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="border-b border-gray-100 pb-6 mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">1. Define the Agreement</h2>
                                    <p className="text-sm text-gray-500 mt-1">Provide the specifics of what is being agreed upon.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Contract Title <span className="text-red-500">*</span></label>
                                        <input name="title" onChange={handleInputChange} value={formData.title} placeholder="e.g. Graphic Design Services Retainer" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-gray-400" />
                                    </div>

                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Detailed Description <span className="text-red-500">*</span></label>
                                        <textarea name="description" onChange={handleInputChange} value={formData.description} rows={4} placeholder="Clearly outline the deliverables, expectations, and terms of this commitment..." className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-gray-400 resize-none"></textarea>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Agreement Category</label>
                                        <select name="agreementType" onChange={handleInputChange} value={formData.agreementType} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium cursor-pointer">
                                            <option value="money">Financial Loan / Payment</option>
                                            <option value="item return">Asset Handover</option>
                                            <option value="task commitment">Service / Task</option>
                                            <option value="custom">Custom Commitment</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Monetary Value (Optional)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-gray-500 font-bold">$</span>
                                            </div>
                                            <input type="number" name="amount" onChange={handleInputChange} value={formData.amount} placeholder="0.00" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-gray-400" />
                                        </div>
                                    </div>
                                    
                                    <div className="col-span-1 md:col-span-2 border-t border-gray-100 mt-4 pt-8 border-dashed">
                                        <div className="mb-4">
                                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Counterparty Details</h3>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Their Full Name <span className="text-red-500">*</span></label>
                                        <input name="partyBName" onChange={handleInputChange} value={formData.partyBName} placeholder="Jane Smith" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-gray-400" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Their Email <span className="text-red-500">*</span></label>
                                        <input type="email" name="partyBEmail" onChange={handleInputChange} value={formData.partyBEmail} placeholder="jane@example.com" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-gray-400" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Execution / Due Date <span className="text-red-500">*</span></label>
                                        <input type="date" name="dueDate" onChange={handleInputChange} value={formData.dueDate} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-gray-600" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Jurisdiction / Location (Optional)</label>
                                        <input name="location" onChange={handleInputChange} value={formData.location} placeholder="e.g. San Francisco, CA" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-gray-400" />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
                                    <button 
                                        onClick={createAgreement} 
                                        disabled={isSubmitting || !formData.title || !formData.description || !formData.partyBName || !formData.partyBEmail || !formData.dueDate}
                                        className="group inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isSubmitting ? 'Creating Record...' : 'Proceed to Verification'}
                                        {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-slide-up space-y-10">
                                <div className="text-center bg-blue-50 rounded-2xl p-8 border border-blue-100">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                                        <ShieldCheck className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Biometric Signatures Required</h2>
                                    <p className="mt-3 text-gray-600 max-w-lg mx-auto leading-relaxed font-medium">
                                        To cryptographically seal this agreement, both parties must provide local Face ID verification. Raw images are <span className="font-bold text-gray-900">never</span> saved or transmitted.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                                    <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gray-200 -translate-x-1/2"></div>
                                    
                                    {/* Party A */}
                                    <div className="flex flex-col">
                                        <div className="mb-4">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Party A (Initiator)</span>
                                            <h3 className="text-lg font-bold text-gray-900 mt-1">{formData.partyAName}</h3>
                                        </div>
                                        
                                        <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:border-blue-300 transition-colors">
                                            {partyAHash ? (
                                                <div className="h-full flex flex-col items-center justify-center p-8 bg-green-50/50">
                                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-50">
                                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <p className="font-bold text-gray-900 text-lg">Identity Verified</p>
                                                    <p className="text-xs text-green-700 font-mono mt-2 break-all text-center max-w-full px-4 overflow-hidden text-ellipsis whitespace-nowrap">{partyAHash}</p>
                                                </div>
                                            ) : (
                                                <div className="h-full p-6">
                                                    <FaceVerification partyName={formData.partyAName} onVerified={(hash) => verifyParty('A', hash)} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Party B */}
                                    <div className="flex flex-col">
                                        <div className="mb-4">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Party B (Counterparty)</span>
                                            <h3 className="text-lg font-bold text-gray-900 mt-1">{formData.partyBName}</h3>
                                        </div>
                                        
                                        <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:border-blue-300 transition-colors">
                                            {partyBHash ? (
                                                <div className="h-full flex flex-col items-center justify-center p-8 bg-green-50/50">
                                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-50">
                                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <p className="font-bold text-gray-900 text-lg">Identity Verified</p>
                                                    <p className="text-xs text-green-700 font-mono mt-2 break-all text-center max-w-full px-4 overflow-hidden text-ellipsis whitespace-nowrap">{partyBHash}</p>
                                                </div>
                                            ) : (
                                                <div className="h-full p-6">
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
                                <div className="relative w-32 h-32 mx-auto mb-8">
                                    <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 rounded-full"></div>
                                    <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl ring-8 ring-green-50">
                                        <CheckCircle2 className="w-16 h-16 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Immutable Proof Generated</h2>
                                <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
                                    The Commitment Integrity Hash (CIH) has been securely stamped into your cryptographic agreement certificate.
                                </p>
                                <div className="flex justify-center">
                                    <button 
                                        onClick={() => router.push(`/agreements/${agreementId}`)} 
                                        className="group relative inline-flex justify-center items-center px-10 py-4 text-base font-bold rounded-2xl text-white bg-gray-900 hover:bg-black transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95"
                                    >
                                        <Link2 className="w-5 h-5 mr-2" />
                                        Access Digital Certificate
                                    </button>
                                </div>
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
                relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 z-10
                ${isCompleted ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : ''}
                ${isActive ? 'bg-white border-2 border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-50' : ''}
                ${isUpcoming ? 'bg-gray-100 text-gray-400 border border-gray-200' : ''}
            `}>
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : icon}
            </div>
            <span className={`
                absolute md:relative md:mt-3 text-xs md:text-sm font-bold tracking-wide transition-colors
                hidden md:block
                ${isCompleted ? 'text-gray-900' : ''}
                ${isActive ? 'text-blue-600' : ''}
                ${isUpcoming ? 'text-gray-400' : ''}
            `}>
                {label}
            </span>
        </div>
    );
}
