'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { RefreshCw, CheckCircle2, ShieldCheck, FileText, Download, Calendar, MapPin, DollarSign, Tag, Check, XCircle, Lock, ExternalLink } from 'lucide-react';

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
            if (data.success) {
                setAgreement(data.data);
            } else {
                throw new Error(data.message);
            }
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
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm font-medium animate-pulse">Loading agreement...</p>
        </div>
    );
    
    if (!agreement) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center p-10 rounded-2xl border border-white/[0.06] bg-[#0B1120]/60 max-w-md w-full">
                <XCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Agreement not found</h2>
                <p className="text-gray-500 text-sm mb-6">This document does not exist or you do not have permission to view it.</p>
                <button onClick={() => router.push('/dashboard')} className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl transition-all font-semibold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">Return to dashboard</button>
            </div>
        </div>
    );

    const isFullyVerified = agreement.partyAVerified && agreement.partyBVerified;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 animate-slide-up">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-4">
                        <Lock className="w-3.5 h-3.5 mr-1.5" /> Securely protected
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{agreement.title}</h1>
                    <p className="mt-2 text-sm text-gray-500 font-mono">{agreement._id}</p>
                </div>
                <div className="mt-6 md:mt-0 flex shrink-0">
                    <button onClick={downloadPDF} className="group inline-flex items-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5">
                        <Download className="mr-2 w-4.5 h-4.5" /> Download PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                    
                    {/* Terms */}
                    <div className="rounded-2xl p-8 border border-white/[0.06] bg-[#0B1120]/60 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
                        
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                                <FileText className="w-4.5 h-4.5 text-gray-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Commitment terms</h2>
                        </div>
                        
                        <p className="text-base text-gray-300 leading-relaxed font-light bg-white/[0.02] p-6 rounded-xl border border-white/[0.04]">
                            {agreement.description}
                        </p>

                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/[0.04]">
                            <DetailBlock icon={<Tag className="w-4 h-4" />} label="Type" value={agreement.agreementType} />
                            <DetailBlock icon={<DollarSign className="w-4 h-4" />} label="Amount" value={agreement.amount ? `$${agreement.amount}` : 'N/A'} />
                            <DetailBlock icon={<Calendar className="w-4 h-4" />} label="Due date" value={new Date(agreement.dueDate).toLocaleDateString()} />
                            <DetailBlock icon={<MapPin className="w-4 h-4" />} label="Location" value={agreement.location || 'N/A'} />
                        </div>
                    </div>

                    {/* Parties */}
                    <div className="rounded-2xl p-8 border border-white/[0.06] bg-[#0B1120]/60">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">Parties</h2>
                            {isFullyVerified && (
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/[0.08] text-emerald-400 border border-emerald-500/[0.15]">
                                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Verified
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <PartyCard 
                                label="Initiator"
                                name={agreement.partyAName}
                                email={agreement.partyAEmail}
                                verified={agreement.partyAVerified}
                            />
                            <PartyCard 
                                label="Counterparty"
                                name={agreement.partyBName}
                                email={agreement.partyBEmail}
                                verified={agreement.partyBVerified}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                    
                    {/* CIH Hash */}
                    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#0B1428] to-[#0B1120] p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/[0.04] blur-[80px] rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-5">
                                <ShieldCheck className="w-7 h-7 text-blue-400" />
                            </div>
                            
                            <h2 className="text-base font-bold text-white mb-1">Verification Code</h2>
                            <p className="text-xs text-gray-500 mb-5">Agreement Verification ID (AVID)</p>
                            
                            {agreement.cihHash ? (
                                <div>
                                    <div className="bg-[#050A18] text-emerald-400 p-4 rounded-xl font-mono text-[11px] break-all border border-white/[0.04] leading-relaxed text-left">
                                        {agreement.cihHash}
                                    </div>
                                    <div className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500/[0.08] text-emerald-400 text-xs font-semibold border border-emerald-500/[0.15] w-full">
                                        <Check className="w-3.5 h-3.5 mr-1.5" /> Validated
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="bg-amber-500/[0.06] border border-amber-500/[0.1] text-amber-400 p-4 rounded-xl text-xs font-medium">
                                        Pending verification
                                    </div>
                                    <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                                        Both parties must complete biometric verification to generate the AVID.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="rounded-2xl p-8 border border-white/[0.06] bg-[#0B1120]/60">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5">Timeline</h3>
                        <div className="space-y-5">
                            <TimelineItem label="Commitment drafted" detail={new Date(agreement.createdAt).toLocaleString()} color="blue" />
                            {agreement.partyAVerified && (
                                <TimelineItem label={`${agreement.partyAName} authenticated`} detail="Biometric signature captured" color="indigo" />
                            )}
                            {agreement.partyBVerified && (
                                <TimelineItem label={`${agreement.partyBName} authenticated`} detail="Biometric signature captured" color="indigo" />
                            )}
                            {isFullyVerified && (
                                <TimelineItem label="AVID generated" detail="Record permanently locked" color="emerald" isLast />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailBlock({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div>
            <p className="flex items-center text-xs font-semibold text-gray-500 mb-1 gap-1.5">{icon} {label}</p>
            <p className="text-sm text-white font-semibold capitalize">{value}</p>
        </div>
    );
}

function PartyCard({ label, name, email, verified }: { label: string, name: string, email: string, verified: boolean }) {
    return (
        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">{label}</p>
            <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/[0.06] flex items-center justify-center text-sm font-bold text-white">
                    {name ? name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-semibold text-white">{name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{email}</p>
                </div>
            </div>
            <div className="pt-3 border-t border-white/[0.04]">
                {verified ? (
                    <div className="flex items-center text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Authenticated
                    </div>
                ) : (
                    <div className="flex items-center text-xs font-medium text-amber-400">
                        <RefreshCw className="w-3 h-3 mr-1.5" />
                        Pending
                    </div>
                )}
            </div>
        </div>
    );
}

function TimelineItem({ label, detail, color, isLast }: { label: string, detail: string, color: string, isLast?: boolean }) {
    const dotColor = color === 'emerald' ? 'bg-emerald-500' : color === 'indigo' ? 'bg-indigo-500' : 'bg-blue-500';
    return (
        <div className={`relative pl-6 ${!isLast ? 'border-l border-white/[0.06]' : ''} pb-0`}>
            <div className={`absolute w-2.5 h-2.5 ${dotColor} rounded-full -left-[5px] top-0.5 ${color === 'emerald' ? 'ring-4 ring-emerald-500/[0.1]' : ''}`}></div>
            <p className="text-sm font-semibold text-white leading-none mb-1">{label}</p>
            <p className="text-xs text-gray-500">{detail}</p>
        </div>
    );
}
