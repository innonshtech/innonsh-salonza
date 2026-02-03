"use client";

import { useState, useEffect } from "react";
import {
    Package,
    ShoppingBag,
    TrendingUp,
    Plus,
    Search,
    ChevronRight,
    Truck,
    DollarSign,
    LogOut,
    ShieldCheck,
    Clock,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SupplierDashboard() {
    const { logout } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [vForm, setVForm] = useState({
        businessName: "",
        gstNumber: "",
        businessAddress: "",
        businessDescription: ""
    });

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            if (parsed.verificationStatus === 'verified') {
                fetchProducts(parsed._id);
            } else {
                setLoading(false);
            }
        }
    }, []);

    async function fetchProducts(supplierId: string) {
        setLoading(true);
        try {
            const res = await fetch(`/api/marketplace/list?supplierId=${supplierId}`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/supplier/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...vForm, userId: user._id })
            });
            const data = await res.json();
            if (data.success) {
                const updatedUser = { ...user, ...vForm, verificationStatus: 'pending' };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-300">Loading Session...</div>;

    // 1. UNAPPLIED - Show Verification Form
    if (user.verificationStatus === 'unapplied') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl shadow-indigo-100 p-10 border-2 border-indigo-50">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Truck className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Become a Partner</h1>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Verification Required</p>
                        </div>
                    </div>

                    <form onSubmit={handleVerifySubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Legal Business Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter registered business name"
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all"
                                    value={vForm.businessName}
                                    onChange={e => setVForm({ ...vForm, businessName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">GST / Tax Number</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="GSTIN12345678"
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all"
                                    value={vForm.gstNumber}
                                    onChange={e => setVForm({ ...vForm, gstNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Business Address</label>
                                <textarea
                                    rows={2}
                                    placeholder="Warehouse or Office address"
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all"
                                    value={vForm.businessAddress}
                                    onChange={e => setVForm({ ...vForm, businessAddress: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-[20px] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'SUBMITTING...' : 'SUBMIT FOR VERIFICATION'}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest border-t border-slate-50 pt-8">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Secure & Confidential Verification
                    </div>
                </div>
            </div>
        )
    }

    // 2. PENDING - Show Waiting State
    if (user.verificationStatus === 'pending') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-8 bg-white p-12 rounded-[50px] border-2 border-slate-100 shadow-xl">
                    <div className="relative inline-block">
                        <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <Clock className="w-16 h-16 text-amber-500" />
                        </div>
                        <div className="absolute top-0 right-0 w-8 h-8 bg-white border-4 border-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-amber-500 font-black text-xs">!</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Vetting in Progress</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Thank you for your application, **{user.businessName}**.
                            Our team is currently reviewing your documents. You'll receive full access to the marketplace once verified.
                        </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Wait</div>
                        <div className="text-xl font-black text-slate-900">24-48 Hours</div>
                    </div>
                    <button
                        onClick={logout}
                        className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        )
    }

    // 3. REJECTED - Show Error
    if (user.verificationStatus === 'rejected') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-white p-12 rounded-[50px] border-2 border-red-50 shadow-xl shadow-red-100">
                    <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Application Rejected</h2>
                    <p className="text-slate-500 font-medium mb-8">
                        Unfortunately, we couldn't verify your business details. Please contact support at **partners@trimsetgo.live** for more information.
                    </p>
                    <button onClick={logout} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest">LOGOUT</button>
                </div>
            </div>
        )
    }

    // 4. VERIFIED - Show Full Dashboard
    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Supplier Dashboard</h1>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                VERIFIED
                            </span>
                        </div>
                        <p className="text-slate-600 font-medium text-sm uppercase tracking-wider">Managing **{user.businessName}**</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={logout}
                            className="bg-white border-2 border-red-100 px-6 py-3 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
                        >
                            <LogOut className="w-5 h-5" />
                            LOGOUT
                        </button>
                        <button className="bg-white border-2 border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            VIEW ORDERS
                        </button>
                        <button className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-blue-100 hover:scale-105 transition-all flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            ADD PRODUCT
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                            <TrendingUp className="w-20 h-20 text-indigo-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Sales</div>
                            <div className="text-3xl font-black text-slate-900">₹45,200</div>
                            <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold mt-1">
                                +12% vs last month
                            </div>
                        </div>
                    </div>
                    {/* ... other stats ... */}
                    <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                            <Package className="w-20 h-20 text-blue-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Products</div>
                            <div className="text-3xl font-black text-slate-900">{products.length}</div>
                            <div className="text-[10px] text-slate-400 font-bold mt-1">
                                {4 - products.length > 0 ? `${4 - products.length} more allowed in Basic` : 'Listing limit reached'}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                            <Truck className="w-20 h-20 text-emerald-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Orders</div>
                            <div className="text-3xl font-black text-slate-900">12</div>
                            <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold mt-1">
                                Needs attention
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                            <DollarSign className="w-20 h-20 text-amber-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Plan</div>
                            <div className="text-3xl font-black text-slate-900 uppercase">Free</div>
                            <button className="text-[10px] text-indigo-600 font-black mt-1 uppercase hover:underline">
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-900">Your Product Portfolio</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search your products..." className="pl-10 pr-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:border-indigo-500 outline-none transition-all" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-20 flex justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-20 text-center opacity-30">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-4" />
                            <p className="font-black uppercase tracking-widest">No products listed yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Product Details</th>
                                        <th className="px-6 py-4">Inventory</th>
                                        <th className="px-6 py-4">Price (B2B)</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.map(p => (
                                        <tr key={p._id} className="hover:bg-slate-50/30">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{p.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold">{p.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-black text-slate-700">{p.stock} units</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-black text-slate-900">₹{p.businessPrice || p.price}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase border border-emerald-100">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
