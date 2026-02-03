"use client";

import { useEffect, useState } from "react";
import {
    Tag,
    Plus,
    Trash2,
    Loader2,
    TrendingUp,
    Zap,
    Gift,
    X,
    AlertCircle
} from "lucide-react";

interface Offer {
    _id: string;
    title: string;
    subtitle: string;
    description: string;
    originalPrice: number;
    discountedPrice: number;
    percentage: number;
    isActive: boolean;
}

export default function ManageOffers() {
    const [salon, setSalon] = useState<any>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        originalPrice: "",
        discountedPrice: "",
        percentage: "",
    });

    useEffect(() => {
        const saved = localStorage.getItem("salon");
        if (saved) {
            const s = JSON.parse(saved);
            setSalon(s);
            loadOffers(s._id);
        } else {
            setInitialLoading(false);
        }
    }, []);

    async function loadOffers(salonId: string) {
        try {
            const res = await fetch(`/api/salon/offer/list?salonId=${salonId}`);
            const data = await res.json();
            if (data.success) {
                setOffers(data.offers || []);
            }
        } catch (err) {
            console.error("Offer load error:", err);
        } finally {
            setInitialLoading(false);
        }
    }

    async function handleAddOffer(e: React.FormEvent) {
        e.preventDefault();
        if (!salon) return;

        setLoading(true);
        try {
            const res = await fetch("/api/salon/offer/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    salonId: salon._id,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setShowAddModal(false);
                setFormData({
                    title: "",
                    subtitle: "",
                    description: "",
                    originalPrice: "",
                    discountedPrice: "",
                    percentage: "",
                });
                loadOffers(salon._id);
            }
        } catch (err) {
            console.error("Add offer error:", err);
        } finally {
            setLoading(false);
        }
    }

    async function deleteOffer(id: string) {
        if (!confirm("Are you sure you want to delete this offer?")) return;

        try {
            const res = await fetch("/api/salon/offer/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ offerId: id }),
            });
            const data = await res.json();
            if (data.success) {
                loadOffers(salon._id);
            }
        } catch (err) {
            console.error("Delete offer error:", err);
        }
    }

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Special Offers</h1>
                    <p className="text-slate-600 mt-1">
                        Create and manage deals to attract more customers to your salon.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Offer
                </button>
            </div>

            {/* Offers Grid */}
            {offers.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Tag className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No active offers</h3>
                    <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                        Promote your services by creating special discounts and packages for your clients.
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="text-purple-600 font-semibold hover:text-purple-700"
                    >
                        Create your first offer →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div
                            key={offer._id}
                            className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <Gift className="w-6 h-6 text-purple-600 group-hover:text-white" />
                                </div>
                                <button
                                    onClick={() => deleteOffer(offer._id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-3">
                                {offer.subtitle || "Limited Time"}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">{offer.title}</h3>
                            <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                                {offer.description}
                            </p>

                            <div className="flex items-end justify-between mt-auto pt-6 border-t border-slate-100">
                                <div>
                                    <div className="text-sm text-slate-500 line-through">₹{offer.originalPrice}</div>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                        ₹{offer.discountedPrice}
                                    </div>
                                </div>
                                {offer.percentage && (
                                    <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-lg text-sm">
                                        {offer.percentage}% OFF
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setShowAddModal(false)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">New Special Offer</h3>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAddOffer} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Offer Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g., First Visit Special"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Badge/Subtitle</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 20% OFF or Limited Time"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                                <textarea
                                    placeholder="Tell clients what's included in this offer..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Original Price (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="2500"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Discounted Price (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="1999"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                        value={formData.discountedPrice}
                                        onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Discount Percentage (%)</label>
                                <input
                                    type="number"
                                    placeholder="20"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    value={formData.percentage}
                                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-900 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-2 px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        "Create Offer"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
