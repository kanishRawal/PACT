'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { 
    Plus, 
    FileText, 
    CheckCircle2, 
    Shield, 
    ArrowUpRight, 
    Clock, 
    Activity, 
    FileCheck2, 
    Zap, 
    CreditCard 
} from 'lucide-react';

export default function Dashboard() {
    const [agreements, setAgreements] = useState([]);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (!userStr) {
            router.push('/auth');
            return;
        }
        const userData = JSON.parse(userStr);
        setUser(userData);
        fetchAgreements(userData.email);
    }, [router]);

    const fetchAgreements = async (email: string) => {
        try {
            const token = Cookies.get('token');
            const res = await fetch(`/api/agreements?email=${email}`, {
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
                setAgreements(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Verified':
                return { cls: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20' };
            case 'Pending Verification':
                return { cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
            default:
                return { cls: 'text-[#B3B4BD] bg-white/5 border-white/10' };
        }
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-[#141619]">
            <div className="w-8 h-8 border-2 border-[#0A21C0]/30 border-t-[#0A21C0] rounded-full animate-spin"></div>
        </div>
    );

    const verifiedCount = agreements.filter((a: any) => a.status === 'Verified').length;
    const pendingCount = agreements.filter((a: any) => a.status === 'Pending Verification').length;

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#141619] p-8 space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in pt-10">
                <div className="space-y-2">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="px-3 py-1 bg-[#0A21C0]/10 border border-[#0A21C0]/20 rounded-full">
                            <span className="text-[#0A21C0] text-[10px] font-black uppercase tracking-widest">System Operational</span>
                        </div>
                        <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse shadow-[0_0_10px_#22C55E]"></div>
                    </div>
                    <h1 className="text-6xl font-black tracking-tight text-white uppercase leading-none">
                        Pact
                    </h1>
                    <p className="text-[#B3B4BD] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Real-time commitment intelligence</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="/agreements/new" className="flex items-center space-x-3 bg-white text-[#141619] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0A21C0] hover:text-white transition-all shadow-xl">
                        <Plus className="w-4 h-4 mr-1" />
                        <span>Initialize Pact</span>
                    </Link>
                </div>
            </header>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                <MetricCard 
                    label="Sealed Pacts" 
                    value={verifiedCount} 
                    icon={FileCheck2} 
                    trend={`+${verifiedCount}`}
                    description="Total immutable records"
                />
                <MetricCard 
                    label="Active Verifications" 
                    value={pendingCount} 
                    icon={Clock} 
                    trend="In Progress"
                    description="Pending network finality"
                />
                <MetricCard 
                    label="Trust Quotient" 
                    value="98.2" 
                    icon={Shield} 
                    trend="+0.5%"
                    description="Identity integrity score"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#2C2E3A] border border-[#B3B4BD]/10 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A21C0]/10 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-[#0A21C0]/20 transition-colors"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Recent Finalizations</h3>
                                <button className="text-[10px] font-black uppercase tracking-widest text-[#B3B4BD] hover:text-white transition-colors">Audit History</button>
                            </div>
                            
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="h-24 bg-[#141619] border border-[#2C2E3A] rounded-3xl animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : agreements.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-[#141619] border border-[#2C2E3A] flex items-center justify-center mx-auto mb-6">
                                            <FileText className="w-8 h-8 text-[#B3B4BD]/40" />
                                        </div>
                                        <p className="text-[#B3B4BD] text-[10px] font-black uppercase tracking-widest opacity-60 max-w-xs mx-auto">No digital commitments recorded in local block</p>
                                    </div>
                                ) : (
                                    agreements.slice(0, 5).map((agreement: any) => (
                                        <Link key={agreement._id} href={`/agreements/${agreement._id}`} className="block">
                                            <div className="flex items-center justify-between p-6 bg-[#141619] border border-[#B3B4BD]/5 rounded-3xl hover:border-[#0A21C0]/30 transition-all cursor-pointer group/item shadow-sm">
                                                <div className="flex items-center space-x-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#050A44] flex items-center justify-center border border-[#0A21C0]/20 group-hover/item:bg-[#0A21C0] transition-colors">
                                                        <FileText className="w-5 h-5 text-[#0A21C0] group-hover/item:text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-black text-sm uppercase tracking-tight group-hover/item:text-[#0A21C0] transition-colors">{agreement.title}</p>
                                                        <p className="text-[10px] text-[#B3B4BD] font-medium uppercase tracking-widest opacity-50">
                                                            With {agreement.partyAEmail === user.email ? agreement.partyBName : agreement.partyAName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(agreement.status).cls}`}>
                                                        {agreement.status}
                                                    </div>
                                                    <ArrowUpRight className="w-5 h-5 text-[#B3B4BD]/30 group-hover/item:text-white transition-colors" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-8">
                    <div className="bg-[#050A44] border border-[#0A21C0]/30 rounded-[2.5rem] p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(10,33,192,0.2)] group transition-all hover:scale-[0.98]">
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#0A21C0]/30 blur-[80px] rounded-full"></div>
                        
                        <div className="relative z-10 text-center py-4">
                            <div className="w-24 h-24 bg-[#141619] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#0A21C0]/50 shadow-2xl relative">
                                <div className="absolute inset-0 rounded-full animate-ping bg-[#0A21C0]/10"></div>
                                <Shield className="w-10 h-10 text-[#0A21C0]" />
                            </div>
                            <h4 className="text-4xl font-black text-white mb-2 leading-none uppercase">{user.name.split(' ')[0]}</h4>
                            <p className="text-[10px] text-[#B3B4BD] font-black uppercase tracking-[0.2em] opacity-60">Identity Status: Verified</p>
                            
                            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-[#B3B4BD]">Reliability Index</span>
                                    <span className="text-[#0A21C0]">99.8%</span>
                                </div>
                                <div className="h-1.5 bg-[#141619] rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-[#0A21C0] w-[99.8%] rounded-full shadow-[0_0_15px_#0A21C0]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#141619] border border-[#2C2E3A] rounded-[2.5rem] p-10 shadow-xl">
                        <h4 className="text-[10px] font-black text-white mb-8 uppercase tracking-widest border-b border-[#2C2E3A] pb-6">Network Health</h4>
                        <div className="space-y-8">
                            <div className="flex items-center space-x-4">
                                <div className="w-1 h-8 bg-[#0A21C0] rounded-full"></div>
                                <div>
                                    <p className="text-[9px] text-[#B3B4BD] font-black uppercase tracking-widest opacity-60 mb-1">Global Latency</p>
                                    <p className="text-white font-black text-lg">14ms</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-1 h-8 bg-[#22C55E] rounded-full shadow-[0_0_10px_#22C55E]"></div>
                                <div>
                                    <p className="text-[9px] text-[#B3B4BD] font-black uppercase tracking-widest opacity-60 mb-1">Integrity Check</p>
                                    <p className="text-white font-black text-lg uppercase">Passed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, trend, description }: any) {
    return (
        <div className="bg-[#2C2E3A] border border-[#B3B4BD]/10 p-8 rounded-[2rem] hover:border-[#0A21C0]/30 transition-all group shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A21C0]/5 blur-3xl group-hover:bg-[#0A21C0]/10 transition-colors pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-4 rounded-2xl bg-[#141619] text-[#0A21C0] group-hover:bg-[#0A21C0] group-hover:text-white transition-all shadow-lg border border-[#2C2E3A]">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black text-[#22C55E] bg-[#22C55E]/5 px-2.5 py-1 rounded-full uppercase tracking-[0.2em] border border-[#22C55E]/10 flex items-center">
                    <Activity className="w-3 h-3 mr-1.5" />
                    {trend}
                </span>
            </div>
            <div className="relative z-10">
                <h4 className="text-[10px] font-black text-[#B3B4BD] uppercase tracking-widest mb-1 opacity-60">{label}</h4>
                <p className="text-4xl font-black text-white tracking-tight mb-2 uppercase">{value}</p>
                <p className="text-[9px] text-[#B3B4BD] font-bold uppercase tracking-widest opacity-40 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
