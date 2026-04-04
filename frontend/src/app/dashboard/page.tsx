'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Plus, FileText, CheckCircle2, Clock, AlertCircle, Activity, FileCheck2, ChevronRight, ArrowUpRight } from 'lucide-react';

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
            const res = await fetch(`/api/agreements?email=${email}`);
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
                return { icon: <CheckCircle2 className="w-3.5 h-3.5" />, cls: 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/[0.15]' };
            case 'Pending Verification':
                return { icon: <Clock className="w-3.5 h-3.5" />, cls: 'text-amber-400 bg-amber-500/[0.08] border-amber-500/[0.15]' };
            default:
                return { icon: <AlertCircle className="w-3.5 h-3.5" />, cls: 'text-gray-400 bg-white/[0.04] border-white/[0.08]' };
        }
    };

    if (!user) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );

    const verifiedCount = agreements.filter((a: any) => a.status === 'Verified').length;
    const pendingCount = agreements.filter((a: any) => a.status === 'Pending Verification').length;

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#050A18] pb-20">

            {/* Header */}
            <div className="border-b border-white/[0.04] bg-[#050A18]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                                <Activity className="w-3.5 h-3.5" />
                                <span>Dashboard</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                Welcome back, {user.name.split(' ')[0]}
                            </h1>
                            <p className="mt-2 text-sm text-gray-500 font-medium">
                                Monitor your active commitments and immutable records.
                            </p>
                        </div>
                        <Link href="/agreements/new" className="group flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0">
                            <Plus className="w-4.5 h-4.5 mr-2 transition-transform group-hover:rotate-90" />
                            New Agreement
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <MetricCard 
                        icon={<FileText className="w-5 h-5 text-blue-400" />}
                        title="Total agreements"
                        value={agreements.length}
                        accent="blue"
                        loading={isLoading}
                    />
                    <MetricCard 
                        icon={<Clock className="w-5 h-5 text-amber-400" />}
                        title="Pending verification"
                        value={pendingCount}
                        accent="amber"
                        loading={isLoading}
                    />
                    <MetricCard 
                        icon={<FileCheck2 className="w-5 h-5 text-emerald-400" />}
                        title="Verified & sealed"
                        value={verifiedCount}
                        accent="emerald"
                        loading={isLoading}
                    />
                </div>

                {/* Activity */}
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-white tracking-tight">Recent activity</h2>
                    </div>

                    <div className="rounded-2xl border border-white/[0.06] bg-[#0B1120]/60 overflow-hidden">
                        {isLoading ? (
                            <div className="divide-y divide-white/[0.04]">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="p-6 flex items-center justify-between animate-pulse">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white/[0.04] rounded-xl"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-white/[0.04] rounded w-48"></div>
                                                <div className="h-3 bg-white/[0.03] rounded w-32"></div>
                                            </div>
                                        </div>
                                        <div className="h-6 bg-white/[0.04] rounded-full w-24"></div>
                                    </div>
                                ))}
                            </div>
                        ) : agreements.length === 0 ? (
                            <div className="p-16 text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
                                    <FileText className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">No active PACTs</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                                    Create your first digital commitment to generate an immutable, verifiable record.
                                </p>
                                <Link 
                                    href="/agreements/new" 
                                    className="inline-flex items-center text-blue-400 font-semibold text-sm hover:text-blue-300 transition-colors"
                                >
                                    Get started <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        ) : (
                            <ul className="divide-y divide-white/[0.04]">
                                {agreements.map((agreement: any) => (
                                    <li key={agreement._id} className="group hover:bg-white/[0.02] transition-colors duration-200">
                                        <Link href={`/agreements/${agreement._id}`} className="block px-6 py-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center min-w-0">
                                                    <div className="hidden sm:flex w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] items-center justify-center mr-4 shrink-0 group-hover:border-indigo-500/20 transition-colors">
                                                        <FileText className="w-4.5 h-4.5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-white truncate mb-0.5 group-hover:text-blue-400 transition-colors">{agreement.title}</p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            With {agreement.partyAEmail === user.email ? agreement.partyBName : agreement.partyAName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 shrink-0 ml-4">
                                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(agreement.status).cls}`}>
                                                        {getStatusStyle(agreement.status).icon}
                                                        <span className="hidden sm:inline">{agreement.status}</span>
                                                    </div>
                                                    <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon, title, value, accent, loading }: { icon: React.ReactNode, title: string, value: number, accent: string, loading: boolean }) {
    return (
        <div className="group rounded-2xl p-6 border border-white/[0.06] bg-[#0B1120]/60 transition-all duration-300 hover:border-white/[0.1]">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-white/[0.1] transition-colors">
                    {icon}
                </div>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
            {loading ? (
                <div className="h-9 w-16 bg-white/[0.04] rounded animate-pulse"></div>
            ) : (
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
            )}
        </div>
    );
}
