'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Plus, FileText, CheckCircle2, Clock, AlertCircle, TrendingUp, Activity, FileCheck2, ChevronRight } from 'lucide-react';

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
            setAgreements(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Verified':
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'Pending Verification':
                return <Clock className="w-4 h-4 text-orange-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'Verified':
                return 'bg-green-500/10 text-green-700 border-green-200/50';
            case 'Pending Verification':
                return 'bg-orange-500/10 text-orange-700 border-orange-200/50';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    const verifiedCount = agreements.filter((a: any) => a.status === 'Verified').length;
    const pendingCount = agreements.filter((a: any) => a.status === 'Pending Verification').length;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#F5F7FA] pb-20">
            {/* Dashboard Header Area */}
            <div className="bg-white border-b border-gray-200/80 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 mb-2">
                            <Activity className="w-4 h-4 text-primary" />
                            <span>Overview</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Welcome back, {user.name.split(' ')[0]}</h1>
                        <p className="mt-2 text-base text-gray-500 max-w-xl">
                            Here's what's happening with your digital commitments today.
                        </p>
                    </div>
                    <div>
                        <Link href="/agreements/new" className="group flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl text-white bg-gray-900 hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95">
                            <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
                            Create Agreement
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <MetricCard 
                        icon={<FileText className="w-6 h-6 text-blue-600" />}
                        title="Total Agreements"
                        value={agreements.length}
                        trend="+12% this month"
                        color="blue"
                        loading={isLoading}
                    />
                    <MetricCard 
                        icon={<Clock className="w-6 h-6 text-orange-600" />}
                        title="Pending Verification"
                        value={pendingCount}
                        trend="Action required"
                        color="orange"
                        loading={isLoading}
                    />
                    <MetricCard 
                        icon={<FileCheck2 className="w-6 h-6 text-green-600" />}
                        title="Verified & Active"
                        value={verifiedCount}
                        trend="Cryptographically secured"
                        color="green"
                        loading={isLoading}
                    />
                </div>

                {/* Main Content Area */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Activity</h2>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">View all</button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                        {isLoading ? (
                            <div className="divide-y divide-gray-50">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="p-6 flex items-center justify-between animate-pulse">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-100 rounded w-48"></div>
                                                <div className="h-3 bg-gray-50 rounded w-32"></div>
                                            </div>
                                        </div>
                                        <div className="h-6 bg-gray-50 rounded-full w-24"></div>
                                    </div>
                                ))}
                            </div>
                        ) : agreements.length === 0 ? (
                            <div className="p-16 text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-gray-50/50">
                                    <FileText className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No agreements yet</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                                    Create your first immutable micro-agreement to secure a transaction, loan, or promise.
                                </p>
                                <Link 
                                    href="/agreements/new" 
                                    className="inline-flex items-center text-primary font-semibold hover:text-blue-800 transition-colors"
                                >
                                    Get started <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100/80">
                                {agreements.map((agreement: any) => (
                                    <li key={agreement._id} className="group hover:bg-gray-50/50 transition-colors">
                                        <Link href={`/agreements/${agreement._id}`} className="block px-6 py-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center min-w-0">
                                                    <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 items-center justify-center mr-4 shrink-0 group-hover:bg-white group-hover:border-gray-200 transition-colors">
                                                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-base font-bold text-gray-900 truncate mb-1">{agreement.title}</p>
                                                        <p className="text-sm text-gray-500 truncate flex items-center">
                                                            <span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                                                            With <span className="font-medium text-gray-700 mx-1">{agreement.partyAEmail === user.email ? agreement.partyBName : agreement.partyAName}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end shrink-0 ml-4">
                                                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBg(agreement.status)}`}>
                                                        {getStatusIcon(agreement.status)}
                                                        <span className="ml-1.5">{agreement.status}</span>
                                                    </div>
                                                    <p className="mt-2 text-xs font-medium text-gray-400">
                                                        Due: {new Date(agreement.dueDate).toLocaleDateString()}
                                                    </p>
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

function MetricCard({ icon, title, value, trend, color, loading }: { icon: React.ReactNode, title: string, value: number, trend: string, color: 'blue' | 'orange' | 'green', loading: boolean }) {
    const bgColors = {
        blue: 'bg-blue-50',
        orange: 'bg-orange-50',
        green: 'bg-green-50'
    };
    
    return (
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColors[color]} group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    <TrendingUp className="w-3 h-3" />
                    <span>Live</span>
                </div>
            </div>
            
            <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
            {loading ? (
                <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mt-2 mb-2"></div>
            ) : (
                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
            )}
            <p className="text-xs text-gray-400 font-medium mt-2">{trend}</p>
        </div>
    );
}
