'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { FileDown, RefreshCw, CheckCircle2, ShieldCheck, FileText, Download, Calendar, MapPin, DollarSign, Tag, Check, XCircle, Lock } from 'lucide-react';

export default function AgreementDetail() {
    const router = useRouter();
    const params = useParams();
    const [agreement, setAgreement] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (!userStr) {
            router.push('/auth');
            return;
        }
        setUser(JSON.parse(userStr));
        fetchAgreement();
    }, [router, params.id]);

    const fetchAgreement = async () => {
        try {
            const res = await fetch(`/api/agreements/${params.id}`);
            const data = await res.json();
            setAgreement(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        window.open(`/api/agreements/${params.id}/pdf`, '_blank');
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Loading secure agreement...</p>
        </div>
    );
    
    if (!agreement) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Agreement Not Found</h2>
                <p className="text-gray-500 mb-6">The document you are looking for does not exist or you do not have permission to view it.</p>
                <button onClick={() => router.push('/dashboard')} className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors font-medium">Return to Dashboard</button>
            </div>
        </div>
    );

    const isFullyVerified = agreement.partyAVerified && agreement.partyBVerified;

    return (
        <div className="max-w-5xl mx-auto px-4 py-16">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 animate-slide-up">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50/80 border border-blue-100 text-blue-700 text-sm font-semibold mb-4 backdrop-blur-sm">
                        <Lock className="w-4 h-4 mr-1.5" /> Immutable Record
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">{agreement.title}</h1>
                    <p className="mt-3 text-lg text-gray-500 font-medium">Agreement ID: <span className="font-mono text-gray-400 ml-1 text-sm">{agreement._id}</span></p>
                </div>
                <div className="mt-6 md:mt-0 flex shrink-0">
                    <button onClick={downloadPDF} className="group relative inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold rounded-full text-white bg-gray-900 hover:bg-black overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)]">
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                        <Download className="mr-2 w-5 h-5 transition-transform group-hover:-translate-y-0.5" /> Download Certificate
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content (Left) */}
                <div className="lg:col-span-8 space-y-10 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                    
                    {/* The Certificate Paper Motif */}
                    <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-400 to-primary"></div>
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity pointer-events-none"></div>
                        
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ring-1 ring-gray-100">
                                <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Terms & Conditions</h2>
                        </div>
                        
                        <div className="prose prose-blue max-w-none">
                            <p className="text-lg text-gray-700 leading-relaxed font-medium bg-gray-50/50 p-6 rounded-2xl border border-gray-100 inline-block w-full">
                                {agreement.description}
                            </p>
                        </div>

                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-gray-100">
                            <div>
                                <p className="flex items-center text-sm font-semibold text-gray-500 mb-1"><Tag className="w-4 h-4 mr-1.5" /> Type</p>
                                <p className="text-base text-gray-900 font-bold capitalize">{agreement.agreementType}</p>
                            </div>
                            <div>
                                <p className="flex items-center text-sm font-semibold text-gray-500 mb-1"><DollarSign className="w-4 h-4 mr-1.5" /> Amount</p>
                                <p className="text-base text-gray-900 font-bold">{agreement.amount ? `$${agreement.amount}` : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="flex items-center text-sm font-semibold text-gray-500 mb-1"><Calendar className="w-4 h-4 mr-1.5" /> Due Date</p>
                                <p className="text-base text-gray-900 font-bold">{new Date(agreement.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="flex items-center text-sm font-semibold text-gray-500 mb-1"><MapPin className="w-4 h-4 mr-1.5" /> Location</p>
                                <p className="text-base text-gray-900 font-bold">{agreement.location || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Parties Section */}
                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Parties Involved</h2>
                            {isFullyVerified && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700 ring-1 ring-green-200/50 shadow-sm">
                                    <ShieldCheck className="w-4 h-4 mr-1.5" /> Fully Executed
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                            {/* Decorative connector for desktop */}
                            <div className="hidden sm:block absolute left-1/2 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent -translate-x-1/2"></div>
                            
                            <PartyCard 
                                label="Party A (Initiator)"
                                name={agreement.partyAName}
                                email={agreement.partyAEmail}
                                verified={agreement.partyAVerified}
                            />
                            <PartyCard 
                                label="Party B (Counterparty)"
                                name={agreement.partyBName}
                                email={agreement.partyBEmail}
                                verified={agreement.partyBVerified}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="lg:col-span-4 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                    
                    <div className="bg-[#0A192F] rounded-3xl p-1 relative overflow-hidden shadow-2xl">
                        {/* Glow effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 opacity-20 blur-2xl rounded-[30px] z-0 pointer-events-none transition-opacity duration-500"></div>
                        
                        <div className="relative bg-[#0A192F] rounded-[28px] p-8 z-10 h-full flex flex-col items-center text-center border border-white/10">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                                <ShieldCheck className="w-8 h-8 text-blue-400" />
                            </div>
                            
                            <h2 className="text-xl font-bold text-white mb-2">Integrity Hash (CIH)</h2>
                            
                            {agreement.cihHash ? (
                                <div className="w-full mt-4">
                                    <p className="text-xs text-blue-200/60 mb-3 font-medium">Cryptographically sealed on <br/>{new Date(agreement.updatedAt).toLocaleString()}</p>
                                    <div className="bg-[#030914] text-[#4ADE80] p-5 rounded-2xl font-mono text-xs break-all border border-b-white/5 shadow-inner leading-relaxed">
                                        {agreement.cihHash}
                                    </div>
                                    <div className="mt-6 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-semibold w-full">
                                        <Check className="w-4 h-4 mr-2" /> Verified Authentic
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 w-full">
                                    <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-4 rounded-2xl mb-4 text-sm font-medium">
                                        Pending Final Verification
                                    </div>
                                    <p className="text-sm text-blue-100/50 leading-relaxed">
                                        Biometric signatures from both parties are required to generate the CIH cryptographic proof.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Activity Timeline</h3>
                        <div className="space-y-6">
                            <div className="relative pl-6 border-l-2 border-gray-100">
                                <div className="absolute w-3 h-3 bg-white border-2 border-primary rounded-full -left-[7px] top-1"></div>
                                <p className="text-sm font-bold text-gray-900">Agreement Drafted</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(agreement.createdAt).toLocaleString()}</p>
                            </div>
                            {agreement.partyAVerified && (
                                <div className="relative pl-6 border-l-2 border-gray-100">
                                    <div className="absolute w-3 h-3 bg-white border-2 border-primary rounded-full -left-[7px] top-1"></div>
                                    <p className="text-sm font-bold text-gray-900">{agreement.partyAName} Verified</p>
                                    <p className="text-xs text-gray-500 mt-1">Biometric confirmation complete</p>
                                </div>
                            )}
                            {agreement.partyBVerified && (
                                <div className="relative pl-6 border-l-2 border-gray-100">
                                    <div className="absolute w-3 h-3 bg-white border-2 border-primary rounded-full -left-[7px] top-1"></div>
                                    <p className="text-sm font-bold text-gray-900">{agreement.partyBName} Verified</p>
                                    <p className="text-xs text-gray-500 mt-1">Biometric confirmation complete</p>
                                </div>
                            )}
                            {isFullyVerified && (
                                <div className="relative pl-6">
                                    <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1 ring-4 ring-green-50"></div>
                                    <p className="text-sm font-bold text-gray-900">CIH Proof Generated</p>
                                    <p className="text-xs text-green-600 font-medium mt-1">Agreement locked and secure</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PartyCard({ label, name, email, verified }: { label: string, name: string, email: string, verified: boolean }) {
    return (
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100/80 transition-shadow hover:shadow-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{label}</p>
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-white ring-1 ring-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 shadow-sm">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                    <p className="text-lg font-bold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">{email}</p>
                </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200/60 mt-2">
                {verified ? (
                    <div className="flex items-center text-sm font-semibold text-green-700">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        Biometric Verified
                    </div>
                ) : (
                    <div className="flex items-center text-sm font-medium text-orange-600">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-2">
                            <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
                        </div>
                        Pending Verification
                    </div>
                )}
            </div>
        </div>
    );
}
