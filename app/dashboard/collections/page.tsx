// "use client";

// import { useEffect, useState } from "react";
// import {
//     TrendingUp,
//     Users,
//     DollarSign,
//     User,
//     Calendar,
//     ChevronRight,
//     ArrowRight,
//     Armchair,
//     CheckCircle2,
//     CreditCard,
//     Banknote,
//     Receipt
// } from "lucide-react";

// interface StaffCollection {
//     staffName: string;
//     totalAmount: number;
//     customerCount: number;
//     sales: any[];
// }

// export default function CollectionsPage() {
//     const [salon, setSalon] = useState<any>(null);
//     const [stats, setStats] = useState<{
//         data: StaffCollection[];
//         totalCollection: number;
//         totalCash: number;
//         totalOnline: number;
//         totalCustomers: number;
//     } | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const saved = localStorage.getItem("salon");
//         if (saved) {
//             const s = JSON.parse(saved);
//             setSalon(s);
//             fetchAnalytics(s._id);
//         }
//     }, []);

//     async function fetchAnalytics(salonId: string) {
//         setLoading(true);
//         try {
//             const res = await fetch(`/api/analytics/daily?salonId=${salonId}`);
//             const data = await res.json();
//             if (data.success) {
//                 setStats({
//                     data: data.data,
//                     totalCollection: data.totalCollection,
//                     totalCash: data.totalCash,
//                     totalOnline: data.totalOnline,
//                     totalCustomers: data.totalCustomers
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching analytics:", error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-[400px]">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-14 w-14 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
//                     <p className="mt-4 text-slate-600 font-medium tracking-wide">Calculating Daily Wealth...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-8 pb-10">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daily Collection</h1>
//                     <p className="mt-1 text-sm text-slate-600 font-medium">Analytics and earnings for today</p>
//                 </div>
//                 <div className="bg-white px-4 py-2 rounded-xl border-2 border-slate-100 shadow-sm flex items-center gap-2">
//                     <Calendar className="w-4 h-4 text-purple-600" />
//                     <span className="text-sm font-bold text-slate-700">
//                         {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
//                     </span>
//                 </div>
//             </div>

//             {/* Top Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
//                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
//                     <div className="relative z-10">
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
//                                 <DollarSign className="w-6 h-6" />
//                             </div>
//                             <span className="text-sm font-bold uppercase tracking-widest opacity-80 text-[10px]">Total Revenue</span>
//                         </div>
//                         <div className="text-3xl font-black mb-1">₹{stats?.totalCollection || 0}</div>
//                     </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
//                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
//                     <div className="relative z-10">
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
//                                 <Banknote className="w-6 h-6" />
//                             </div>
//                             <span className="text-sm font-bold uppercase tracking-widest opacity-80 text-[10px]">Cash Earning</span>
//                         </div>
//                         <div className="text-3xl font-black mb-1">₹{stats?.totalCash || 0}</div>
//                     </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
//                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
//                     <div className="relative z-10">
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
//                                 <CreditCard className="w-6 h-6" />
//                             </div>
//                             <span className="text-sm font-bold uppercase tracking-widest opacity-80 text-[10px]">Online Earning</span>
//                         </div>
//                         <div className="text-3xl font-black mb-1">₹{stats?.totalOnline || 0}</div>
//                     </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
//                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
//                     <div className="relative z-10">
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
//                                 <Users className="w-6 h-6" />
//                             </div>
//                             <span className="text-sm font-bold uppercase tracking-widest opacity-80 text-[10px]">Total Customers</span>
//                         </div>
//                         <div className="text-3xl font-black mb-1">{stats?.totalCustomers || 0}</div>
//                     </div>
//                 </div>
//             </div>

//             {/* Staff Breakdown */}
//             <div className="space-y-6">
//                 <div className="flex items-center gap-2 px-2">
//                     <Armchair className="w-5 h-5 text-purple-600" />
//                     <h2 className="text-xl font-black text-slate-900 tracking-tight">Staff Productivity</h2>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {stats?.data.filter(s => s.customerCount > 0 || s.staffName !== "Unassigned").map((s, idx) => (
//                         <div key={idx} className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all group">
//                             <div className="flex items-start justify-between mb-6">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 font-black text-xl shadow-inner">
//                                         {s.staffName.charAt(0).toUpperCase()}
//                                     </div>
//                                     <div>
//                                         <h3 className="font-bold text-slate-900 text-lg leading-tight">{s.staffName}</h3>
//                                         <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Professional</p>
//                                     </div>
//                                 </div>
//                                 <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-green-100 uppercase">
//                                     ACTIVE
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:border-purple-200 transition-colors">
//                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Collection</p>
//                                     <p className="text-xl font-black text-slate-900">₹{s.totalAmount}</p>
//                                 </div>
//                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:border-purple-200 transition-colors">
//                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Served</p>
//                                     <p className="text-xl font-black text-slate-900">{s.customerCount}</p>
//                                 </div>
//                             </div>

//                             <div className="mt-6 pt-6 border-t border-slate-100">
//                                 <div className="flex items-center justify-between group-hover:text-purple-600 transition-colors">
//                                     <span className="text-xs font-bold text-slate-500 group-hover:text-purple-600">View detailed services</span>
//                                     <ArrowRight className="w-4 h-4" />
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Recent Activity / Transactions List */}
//             <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden">
//                 <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <CheckCircle2 className="w-5 h-5 text-emerald-500" />
//                         <h2 className="text-xl font-black text-slate-900">Completed Services Today</h2>
//                     </div>
//                     <button className="text-xs font-black text-purple-600 uppercase tracking-widest hover:underline">
//                         Export Report
//                     </button>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead>
//                             <tr className="bg-slate-50/50">
//                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
//                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
//                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode</th>
//                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Served By</th>
//                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-100">
//                             {stats?.data.flatMap(s => s.sales).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((sale, i) => (
//                                 <tr key={i} className="hover:bg-slate-50/50 transition-colors">
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center gap-3">
//                                             <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
//                                                 {sale.customerName.charAt(0)}
//                                             </div>
//                                             <span className="font-bold text-slate-900">{sale.customerName}</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex flex-wrap gap-1">
//                                             {(sale.serviceNames || [sale.serviceId?.name || "Service"]).map((name: string, idx: number) => (
//                                                 <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold border border-purple-100 whitespace-nowrap">
//                                                     {name}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center gap-2">
//                                             {sale.paymentMethod === 'cash' && <Banknote className="w-3.5 h-3.5 text-emerald-500" />}
//                                             {sale.paymentMethod === 'online' && <CreditCard className="w-3.5 h-3.5 text-blue-500" />}
//                                             {sale.paymentMethod === 'split' && <Receipt className="w-3.5 h-3.5 text-amber-500" />}
//                                             <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">
//                                                 {sale.paymentMethod || 'cash'}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center gap-2">
//                                             <User className="w-3.5 h-3.5 text-slate-400" />
//                                             <span className="text-sm font-semibold text-slate-600">
//                                                 {sale.staffId ? (stats.data.find(s => s.sales.some(sa => sa._id === sale._id))?.staffName || "Staff") : "Unassigned"}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 text-right">
//                                         <div className="flex flex-col items-end">
//                                             <span className="font-black text-slate-900">₹{sale.totalPrice || sale.price}</span>
//                                             {sale.discount?.amount > 0 && (
//                                                 <span className="text-[9px] text-red-500 font-bold uppercase">-₹{sale.discount.amount} Disc</span>
//                                             )}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                             {(!stats || stats.totalCustomers === 0) && (
//                                 <tr>
//                                     <td colSpan={4} className="px-6 py-20 text-center">
//                                         <div className="flex flex-col items-center gap-2 opacity-40">
//                                             <TrendingUp className="w-10 h-10" />
//                                             <p className="text-sm font-bold uppercase tracking-widest text-slate-500">No transactions recorded yet</p>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import {
    TrendingUp,
    Users,
    DollarSign,
    User,
    Calendar,
    ChevronRight,
    ArrowRight,
    Armchair,
    CheckCircle2,
    CreditCard,
    Banknote,
    Receipt,
    IndianRupee,
    Loader2
} from "lucide-react";

interface StaffCollection {
    staffName: string;
    totalAmount: number;
    customerCount: number;
    sales: any[];
}

export default function CollectionsPage() {
    const [salon, setSalon] = useState<any>(null);
    const [stats, setStats] = useState<{
        data: StaffCollection[];
        totalCollection: number;
        totalCash: number;
        totalOnline: number;
        totalCustomers: number;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("salon");
        if (saved) {
            const s = JSON.parse(saved);
            setSalon(s);
            fetchAnalytics(s._id);
        }
    }, []);

    async function fetchAnalytics(salonId: string) {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics/daily?salonId=${salonId}`);
            const data = await res.json();
            if (data.success) {
                setStats({
                    data: data.data,
                    totalCollection: data.totalCollection,
                    totalCash: data.totalCash,
                    totalOnline: data.totalOnline,
                    totalCustomers: data.totalCustomers
                });
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-3 border-purple-200 border-t-purple-600 mx-auto"></div>
                    <p className="mt-3 text-slate-600 font-medium">Calculating Daily Collections...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Daily Collection</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Analytics and earnings for today at {salon?.name || "your salon"}
                </p>
            </div>

            {/* Date Display */}
            <div className="flex items-center justify-between">
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-slate-700">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-medium uppercase tracking-wide opacity-90">Total Revenue</span>
                            <div className="text-xl font-semibold mt-0.5">₹{stats?.totalCollection || 0}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4 rounded-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-medium uppercase tracking-wide opacity-90">Cash Earning</span>
                            <div className="text-xl font-semibold mt-0.5">₹{stats?.totalCash || 0}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-medium uppercase tracking-wide opacity-90">Online Earning</span>
                            <div className="text-xl font-semibold mt-0.5">₹{stats?.totalOnline || 0}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-lg text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-medium uppercase tracking-wide opacity-90">Total Customers</span>
                            <div className="text-xl font-semibold mt-0.5">{stats?.totalCustomers || 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Staff Breakdown */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Armchair className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Staff Productivity</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Collection breakdown by staff member</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stats?.data.filter(s => s.customerCount > 0 || s.staffName !== "Unassigned").map((s, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 font-semibold text-lg">
                                        {s.staffName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{s.staffName}</h3>
                                        <p className="text-xs text-slate-500">Professional</p>
                                    </div>
                                </div>
                                <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-100">
                                    ACTIVE
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                    <p className="text-[10px] font-medium text-slate-500 uppercase mb-1">Collection</p>
                                    <p className="text-lg font-semibold text-slate-900">₹{s.totalAmount}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                    <p className="text-[10px] font-medium text-slate-500 uppercase mb-1">Served</p>
                                    <p className="text-lg font-semibold text-slate-900">{s.customerCount}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100">
                                <div className="flex items-center justify-between text-xs text-slate-500 hover:text-purple-600 transition-colors cursor-pointer">
                                    <span>View detailed services</span>
                                    <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity / Transactions List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <h2 className="text-lg font-semibold text-slate-900">Completed Services Today</h2>
                    </div>
                    <button className="text-xs font-medium text-purple-600 hover:underline">
                        Export Report
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Service</th>
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Mode</th>
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Served By</th>
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats?.data.flatMap(s => s.sales).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((sale, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-600 font-medium text-xs uppercase">
                                                {sale.customerName.charAt(0)}
                                            </div>
                                            <span className="font-medium text-slate-900 text-sm">{sale.customerName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {(sale.serviceNames || [sale.serviceId?.name || "Service"]).map((name: string, idx: number) => (
                                                <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-medium border border-purple-100">
                                                    {name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            {sale.paymentMethod === 'cash' && <Banknote className="w-3 h-3 text-emerald-500" />}
                                            {sale.paymentMethod === 'online' && <CreditCard className="w-3 h-3 text-blue-500" />}
                                            {sale.paymentMethod === 'split' && <Receipt className="w-3 h-3 text-amber-500" />}
                                            <span className="text-xs font-medium text-slate-600 capitalize">
                                                {sale.paymentMethod || 'cash'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3 h-3 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-600">
                                                {sale.staffId ? (stats.data.find(s => s.sales.some(sa => sa._id === sale._id))?.staffName || "Staff") : "Unassigned"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="font-semibold text-slate-900">₹{sale.totalPrice || sale.price}</span>
                                            {sale.discount?.amount > 0 && (
                                                <span className="text-[10px] text-red-500 font-medium">-₹{sale.discount.amount} Disc</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!stats || stats.totalCustomers === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-40">
                                            <TrendingUp className="w-8 h-8 text-slate-400" />
                                            <p className="text-sm font-medium text-slate-500">No transactions recorded yet</p>
                                            <p className="text-xs text-slate-400">Completed services will appear here</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-blue-900 mb-1">Collection Insights</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Data updates in real-time as services are completed</li>
                            <li>• Export reports for accounting and tax purposes</li>
                            <li>• Track staff performance and commission calculations</li>
                            <li>• Monitor payment method preferences of your customers</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}