"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Store,
    Package,
    CheckCircle2,
    XCircle,
    TrendingUp,
    ShieldAlert,
    LogOut,
    ChevronRight,
    Search,
    CheckCircle,
    X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SuperAdminDashboard() {
    const { logout } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [pending, setPending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        setLoading(true);
        try {
            const res = await fetch("/api/super-admin/stats");
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
                setPending(data.pendingVerifications);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleAction(userId: string, action: "verify" | "reject") {
        try {
            const res = await fetch("/api/super-admin/users/action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, action })
            });
            const data = await res.json();
            if (data.success) {
                fetchStats(); // Refresh
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (loading && !stats) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-300">Loading Intelligence...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Top Bar */}
                <div className="flex justify-between items-center border-b border-slate-900 pb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Control Center</h1>
                        </div>
                        <p className="text-slate-500 font-bold text-xs tracking-widest uppercase">Global Operations & Intelligence</p>
                    </div>
                    <button
                        onClick={logout}
                        className="group flex items-center gap-3 bg-slate-900 px-6 py-3 rounded-2xl font-black text-xs hover:bg-red-500 transition-all border border-slate-800"
                    >
                        <LogOut className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                        LOGOUT SYSTEM
                    </button>
                </div>

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Salons"
                        value={stats?.totalSalons || 0}
                        icon={<Store className="w-8 h-8 text-indigo-400" />}
                        trend="+12 New this week"
                    />
                    <StatCard
                        title="Total Suppliers"
                        value={stats?.totalSuppliers || 0}
                        icon={<Users className="w-8 h-8 text-blue-400" />}
                        trend={`${stats?.verifiedSuppliers} Verified`}
                    />
                    <StatCard
                        title="Live Products"
                        value={stats?.totalProducts || 0}
                        icon={<Package className="w-8 h-8 text-emerald-400" />}
                        trend="B2B Active"
                    />
                    <StatCard
                        title="Pending Actions"
                        value={stats?.pendingCount || 0}
                        icon={<ShieldAlert className="w-8 h-8 text-amber-400" />}
                        trend="Requires Review"
                        warning={stats?.pendingCount > 0}
                    />
                </div>

                {/* Pending Verifications */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black tracking-widest uppercase flex items-center gap-3">
                            <span className="w-2 h-8 bg-amber-500 rounded-full block"></span>
                            Verification Requests
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {pending.length === 0 ? (
                            <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 p-12 rounded-[40px] text-center">
                                <CheckCircle2 className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                <p className="font-black uppercase tracking-widest text-slate-700">All Partners Vetted</p>
                            </div>
                        ) : (
                            pending.map(sup => (
                                <div key={sup._id} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-indigo-500/50 transition-all">
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 font-black text-xl">
                                            {sup.businessName?.[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black tracking-tight">{sup.businessName}</h3>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 py-1 px-3 bg-indigo-500/10 rounded-full border border-indigo-500/20">GST: {sup.gstNumber}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-1 px-3 bg-slate-800 rounded-full border border-slate-700">Owner: {sup.name}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm mt-3 font-medium max-w-lg italic">"{sup.businessAddress}"</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleAction(sup._id, 'verify')}
                                            className="bg-emerald-600 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            APPROVE
                                        </button>
                                        <button
                                            onClick={() => handleAction(sup._id, 'reject')}
                                            className="bg-slate-800 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            REJECT
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Global Analytics Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[50px] p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <TrendingUp className="w-64 h-64 text-indigo-500" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black tracking-tighter uppercase mb-6 flex items-center gap-3">
                                Marketplace Growth
                                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-md">+24%</span>
                            </h3>
                            <div className="h-64 flex items-end gap-3 px-4">
                                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                                    <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-xl group relative cursor-pointer">
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-xl group-hover:bg-indigo-400 transition-all duration-700"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[50px] p-10 flex flex-col justify-between items-start text-white shadow-2xl shadow-indigo-500/20">
                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">Platform Vitals</h3>
                            <p className="text-white/60 font-medium text-sm leading-relaxed mb-6">
                                The TrimsetGo ecosystem currently houses **{stats?.totalSalons} active units**. Maintain 100% oversight on B2B supply chains.
                            </p>
                            <button className="bg-white text-indigo-600 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                GENERATE AUDIT
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, warning }: any) {
    return (
        <div className={`bg-slate-900 border ${warning ? 'border-amber-500/50 shadow-lg shadow-amber-500/5' : 'border-slate-800'} p-8 rounded-[40px] relative overflow-hidden group hover:border-slate-700 transition-all`}>
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-500">
                {icon}
            </div>
            <div className="relative z-10">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{title}</div>
                <div className="text-4xl font-black tracking-tighter mb-2">{value}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${warning ? 'text-amber-500 underline' : 'text-slate-400 opacity-60'}`}>{trend}</div>
            </div>
        </div>
    );
}
