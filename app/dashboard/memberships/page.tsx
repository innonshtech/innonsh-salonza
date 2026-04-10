"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
    CreditCard,
    Plus,
    CheckCircle2,
    Users,
    Crown,
    Gift,
    X,
    Edit2,
    Trash2,
    Loader2
} from "lucide-react";

interface MembershipPlan {
    _id: string;
    name: string;
    price: number;
    validity: number;
    discount: number;
    benefits: string;
    isActive: boolean;
    createdAt: string;
    membersCount?: number;
}

export default function MembershipsPage() {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        validity: "365",
        discount: "10",
        benefits: "",
        isActive: true
    });

    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;
        fetchPlans();
        return () => {
            mountedRef.current = false;
        };
    }, []);



    async function fetchPlans() {
        setLoading(true);
        try {
            console.log("🔄 Fetching membership plans...");
            const res = await fetch("/api/membership/list", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setPlans(data.data || []);
            } else {
                showToast(data.message || "Failed to fetch plans", "error");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            showToast("Failed to fetch membership plans", "error");
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            name: formData.name,
            price: Number(formData.price),
            validity: Number(formData.validity),
            discount: Number(formData.discount),
            benefits: formData.benefits,
            isActive: formData.isActive,
            ...(editingId && { planId: editingId })
        };

        try {
            const url = editingId ? "/api/membership/update" : "/api/membership/create";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                showToast(editingId ? "Plan updated successfully!" : "Plan created successfully!", "success");
                setShowModal(false);
                resetForm();
                fetchPlans(); // Refresh list to reflect backend in real-time
            } else {
                showToast(data.message || "Failed to save plan", "error");
            }
        } catch (error) {
            console.error("Save Error:", error);
            showToast("Failed to save membership plan", "error");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function deletePlan(planId: string) {
        if (!confirm("Are you sure you want to delete this membership plan?")) return;

        try {
            const res = await fetch("/api/membership/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ planId })
            });

            const data = await res.json();
            if (data.success) {
                showToast("Plan deleted successfully!", "success");
                // Remove from UI instantly
                setPlans(plans.filter(p => p._id !== planId));
            } else {
                showToast(data.message || "Failed to delete plan", "error");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            showToast("Failed to delete plan", "error");
        }
    }

    function openEdit(plan: MembershipPlan) {
        setEditingId(plan._id);
        setFormData({
            name: plan.name,
            price: plan.price.toString(),
            validity: plan.validity.toString(),
            discount: plan.discount.toString(),
            benefits: plan.benefits,
            isActive: plan.isActive
        });
        setShowModal(true);
    }

    function resetForm() {
        setEditingId(null);
        setFormData({
            name: "",
            price: "",
            validity: "365",
            discount: "10",
            benefits: "",
            isActive: true
        });
    }

    if (loading && plans.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="animate-spin h-10 w-10 text-purple-600 mx-auto" />
                    <p className="mt-4 text-slate-600">Loading Membership Plans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Membership Plans</h1>
                    <p className="text-slate-500 mt-1">Manage subscription plans and benefits for your salon</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Create New Plan
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                        <Crown className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{plans.length}</div>
                        <div className="text-sm text-slate-500">Total Plans</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                        <Gift className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{plans.filter(p => p.isActive).length}</div>
                        <div className="text-sm text-slate-500">Active Plans</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{plans.reduce((acc, p) => acc + (p.membersCount || 0), 0)}</div>
                        <div className="text-sm text-slate-500">Total Members</div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {plans.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <CreditCard className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No plans found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">
                        You haven't created any membership plans yet. Start by creating one to reward your loyal customers.
                    </p>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add First Plan
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan._id}
                            className={`group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all overflow-hidden flex flex-col ${!plan.isActive ? 'opacity-75 grayscale-[0.5]' : ''}`}
                        >
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${plan.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {plan.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEdit(plan)}
                                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deletePlan(plan._id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-3xl font-black text-slate-900">₹{plan.price}</span>
                                    <span className="text-sm text-slate-500 font-medium">/ {plan.validity} Days</span>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                            <Gift className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{plan.discount}% Member Discount</span>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Benefits</p>
                                        <div className="flex flex-wrap gap-2">
                                            {plan.benefits && typeof plan.benefits === 'string' ? (
                                                plan.benefits.split(',').map((benefit, idx) => (
                                                    benefit.trim() && (
                                                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                            {benefit.trim()}
                                                        </div>
                                                    )
                                                ))
                                            ) : (
                                                <p className="text-xs text-slate-400 italic">No specific benefits listed</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Users className="w-4 h-4" />
                                    <span className="text-xs font-bold">{plan.membersCount || 0} Members</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">Created {new Date(plan.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setShowModal(false)} />

                    <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200">
                        {/* Modal Header */}
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">{editingId ? "Edit Membership Plan" : "Create New Plan"}</h2>
                                <p className="text-slate-400 text-sm mt-1">Configure your membership offering</p>
                            </div>
                            <button
                                onClick={() => !isSubmitting && setShowModal(false)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-all"
                                disabled={isSubmitting}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Plan Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                        placeholder="e.g. Platinum Membership"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Validity (Days)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.validity}
                                        onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                        placeholder="365"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Discount (%)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                        placeholder="10"
                                    />
                                </div>

                                <div className="flex items-end pb-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-all ${formData.isActive ? 'bg-purple-600' : 'bg-slate-300'}`} />
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'translate-x-6' : ''}`} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">Set as Active</span>
                                    </label>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Benefits (Comma separated)</label>
                                    <textarea
                                        required
                                        value={formData.benefits}
                                        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none min-h-[100px]"
                                        placeholder="e.g. Free haircut, 10% off products, Priority booking"
                                    />
                                    <p className="text-xs text-slate-400 mt-2 italic">* Separate multiple benefits with commas</p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => !isSubmitting && setShowModal(false)}
                                    className="flex-1 px-6 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? "Update Plan" : "Create Plan")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
