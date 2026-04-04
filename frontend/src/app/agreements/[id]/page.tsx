'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
    RefreshCw, 
    CheckCircle2, 
    ShieldCheck, 
    FileText, 
    Download, 
    Calendar, 
    MapPin, 
    DollarSign, 
    Tag, 
    Check, 
    XCircle, 
    Lock, 
    ExternalLink,
    Activity,
    Shield,
    Zap
} from 'lucide-react';

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
            const token = Cookies.get('token');
            const res = await fetch(`/api/agreements/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                Cookies.remove('user');
                Cookies.remove('token');
                router.push('/auth');
                return;
            }

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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#141619]">
            <div className="w-10 h-10 border-2 border-[#0A21C0]/20 border-t-[#0A21C0] rounded-full animate-spin mb-6"></div>
            <p className="text-[#B3B4BD] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing with Node...</p>
        </div>
    );

    if (!agreement) return (
        <div className="min-h-screen flex items-center justify-center bg-[#141619] p-8">
            <div className="text-center p-12 rounded-[2.5rem] border border-[#2C2E3A] bg-[#2C2E3A]/20 max-w-md w-full backdrop-blur-3xl shadow-2xl">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
                <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Record Terminated</h2>
                <p className="text-[#B3B4BD] text-xs mb-10 opacity-60 leading-relaxed uppercase tracking-widest">This document does not exist in the current stream or access has been revoked.</p>
                <button onClick={() => router.push('/dashboard')} className="w-full py-5 px-4 bg-white text-[#141619] rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0A21C0] hover:text-white shadow-xl">Return to Console</button>
            </div>
        </div>
    );

    const isFullyVerified = agreement.partyAVerified && agreement.partyBVerified;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 bg-[#141619]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 animate-fade-in">
                <div className="max-w-3xl space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="px-3 py-1 bg-[#0A21C0]/10 border border-[#0A21C0]/30 rounded-full flex items-center">
                            <Lock className="w-3 h-3 text-[#0A21C0] mr-2" />
                            <span className="text-[#0A21C0] text-[9px] font-black uppercase tracking-[0.2em]">Live Encryption Unit</span>
                        </div>
                        {isFullyVerified && (
                             <div className="px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-full flex items-center">
                                <ShieldCheck className="w-3 h-3 text-[#22C55E] mr-2" />
                                <span className="text-[#22C55E] text-[9px] font-black uppercase tracking-[0.2em]">AVID Active</span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">{agreement.title}</h1>
                    <div className="flex items-center space-x-4">
                        <p className="text-[10px] text-[#B3B4BD] font-black uppercase tracking-[0.4em] opacity-40">System_ID // {agreement._id}</p>
                        <div className="h-px bg-[#2C2E3A] flex-1"></div>
                    </div>
                </div>
                <div className="mt-10 md:mt-0 flex shrink-0">
                    <button onClick={downloadPDF} className="group relative overflow-hidden inline-flex items-center px-10 py-5 text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl text-white bg-[#0A21C0] hover:bg-white hover:text-[#141619] transition-all shadow-[0_0_40px_rgba(10,33,192,0.3)]">
                        <Download className="mr-3 w-4 h-4" /> 
                        Generate Certificate
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-10 animate-slide-up">
                    {/* Terms */}
                    <div className="rounded-[2.5rem] p-10 sm:p-14 border border-[#2C2E3A] bg-[#2C2E3A]/20 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A21C0]/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>

                        <div className="flex items-center space-x-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-[#050A44] border border-[#0A21C0]/30 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-[#0A21C0]" />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Core Commitment Stream</h2>
                        </div>

                        <div className="bg-[#141619] p-8 rounded-3xl border border-[#2C2E3A] shadow-inner mb-12">
                            <p className="text-sm text-white leading-relaxed font-medium opacity-90">
                                {agreement.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-[#2C2E3A]">
                            <DetailBlock icon={Tag} label="Type" value={agreement.agreementType} />
                            <DetailBlock icon={DollarSign} label="Nominal" value={agreement.amount ? `$${agreement.amount}` : 'N/A'} />
                            <DetailBlock icon={Calendar} label="Finality" value={new Date(agreement.dueDate).toLocaleDateString()} />
                            <DetailBlock icon={MapPin} label="Locale" value={agreement.location || 'N/A'} />
                        </div>
                    </div>

                    {/* Parties */}
                    <div className="rounded-[2.5rem] p-10 sm:p-14 border border-[#2C2E3A] bg-[#2C2E3A]/20 backdrop-blur-3xl">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#141619] border border-[#2C2E3A] flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-[#22C55E]" />
                                </div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Party Verification Unit</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <PartyCard
                                label="Initiator"
                                name={agreement.partyAName}
                                email={agreement.partyAEmail}
                                verified={agreement.partyAVerified}
                            />
                            <PartyCard
                                label="Recipient"
                                name={agreement.partyBName}
                                email={agreement.partyBEmail}
                                verified={agreement.partyBVerified}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-10 animate-slide-up">
                    {/* AVID Console */}
                    <div className="rounded-[2.5rem] border border-[#0A21C0]/30 bg-[#050A44] p-10 relative overflow-hidden shadow-[0_30px_60px_rgba(10,33,192,0.2)]">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#0A21C0]/20 blur-[60px] rounded-full"></div>
                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-[#141619] border border-[#0A21C0]/40 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                <Activity className="w-10 h-10 text-[#0A21C0]" />
                            </div>

                            <h2 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Security Console</h2>
                            <p className="text-[10px] text-[#B3B4BD] font-black uppercase tracking-[0.2em] mb-8 opacity-60">Verification_ID (AVID)</p>

                            {agreement.cihHash ? (
                                <div className="space-y-6">
                                    <div className="bg-[#141619] text-[#22C55E] p-6 rounded-2xl font-mono text-[10px] break-all border border-[#22C55E]/20 leading-relaxed text-left shadow-inner">
                                        {agreement.cihHash}
                                    </div>
                                    <div className="flex items-center justify-center space-x-3 text-[#22C55E] bg-[#22C55E]/10 py-3 rounded-xl border border-[#22C55E]/20">
                                        <Zap className="w-4 h-4 shadow-[0_0_10px_#22C55E]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em]">Integrity Active</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-[#141619] text-amber-400 p-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20 shadow-inner">
                                        Status: Awaiting Nodes
                                    </div>
                                    <p className="text-[9px] text-[#B3B4BD] font-medium leading-relaxed uppercase tracking-tighter opacity-40">
                                        Multilateral biometric synchronization required to generate unique AVID hash.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Integrity Log */}
                    <div className="rounded-[2.5rem] p-10 border border-[#2C2E3A] bg-[#2C2E3A]/20 shadow-xl">
                        <h3 className="text-[10px] font-black text-[#B3B4BD] uppercase tracking-[0.3em] mb-10 border-b border-[#2C2E3A] pb-6 opacity-60">Integrity Log</h3>
                        <div className="space-y-8">
                            <TimelineItem label="Commitment Drafted" detail={new Date(agreement.createdAt).toLocaleString()} status="completed" />
                            {agreement.partyAVerified && (
                                <TimelineItem label={`Node_${agreement.partyAName.split(' ')[0]} Auth`} detail="Biometric Lock Captured" status="completed" />
                            )}
                            {agreement.partyBVerified && (
                                <TimelineItem label={`Node_${agreement.partyBName.split(' ')[0]} Auth`} detail="Biometric Lock Captured" status="completed" />
                            )}
                            {isFullyVerified ? (
                                <TimelineItem label="AVID Hash Sealed" detail="Permanent Record Locked" status="secure" isLast />
                            ) : (
                                <TimelineItem label="AVID Generation" detail="Awaiting Verifier Nodes" status="pending" isLast />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailBlock({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="space-y-2">
            <p className="flex items-center text-[9px] font-black text-[#B3B4BD] uppercase tracking-widest opacity-40 gap-2">
                <Icon className="w-3 h-3" /> {label}
            </p>
            <p className="text-sm text-white font-black uppercase tracking-tight">{value}</p>
        </div>
    );
}

function PartyCard({ label, name, email, verified }: { label: string, name: string, email: string, verified: boolean }) {
    return (
        <div className="p-8 rounded-3xl bg-[#141619] border border-[#2C2E3A] hover:border-[#0A21C0]/30 transition-all group shadow-sm">
            <p className="text-[10px] font-black text-[#B3B4BD] uppercase tracking-[0.3em] mb-6 opacity-40">{label}</p>
            <div className="flex items-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#050A44] border border-[#0A21C0]/20 flex items-center justify-center text-xl font-black text-[#0A21C0] group-hover:bg-[#0A21C0] group-hover:text-white transition-all">
                    {name ? name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="ml-5">
                    <p className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#0A21C0] transition-colors">{name || 'Node_X'}</p>
                    <p className="text-[10px] text-[#B3B4BD] font-black uppercase tracking-widest opacity-30">{email}</p>
                </div>
            </div>
            <div className="pt-6 border-t border-[#2C2E3A]">
                {verified ? (
                    <div className="flex items-center text-[10px] font-black text-[#22C55E] uppercase tracking-widest bg-[#22C55E]/5 px-4 py-2 rounded-xl border border-[#22C55E]/10">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Synchronized
                    </div>
                ) : (
                    <div className="flex items-center text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/5 px-4 py-2 rounded-xl border border-amber-500/10">
                        <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Pending Auth
                    </div>
                )}
            </div>
        </div>
    );
}

function TimelineItem({ label, detail, status, isLast }: { label: string, detail: string, status: 'completed' | 'secure' | 'pending', isLast?: boolean }) {
    const dotColor = status === 'secure' ? 'bg-[#22C55E]' : status === 'completed' ? 'bg-[#0A21C0]' : 'bg-[#2C2E3A]';
    return (
        <div className={`relative pl-8 ${!isLast ? 'border-l border-[#2C2E3A]' : ''} pb-0`}>
            <div className={`absolute w-3 h-3 ${dotColor} rounded-full -left-[6px] top-1 ${status === 'secure' ? 'ring-4 ring-[#22C55E]/20 shadow-[0_0_10px_#22C55E]' : status === 'completed' ? 'ring-4 ring-[#0A21C0]/10' : ''}`}></div>
            <p className="text-[11px] font-black text-white uppercase tracking-tight leading-none mb-2">{label}</p>
            <p className="text-[9px] text-[#B3B4BD] font-black uppercase tracking-widest opacity-40">{detail}</p>
        </div>
    );
}
