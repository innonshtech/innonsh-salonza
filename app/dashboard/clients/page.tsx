"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Search,
    UserPlus,
    Phone,
    Mail,
    Calendar,
    Star,
    MoreVertical,
    History,
    Tag,
    X
} from "lucide-react";

export default function ClientsPage() {
    const [salon, setSalon] = useState<any>(null);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        gender: "male",
        notes: ""
    });

    useEffect(() => {
        const saved = localStorage.getItem("salon");
        if (saved) {
            const s = JSON.parse(saved);
            setSalon(s);
            fetchClients(s._id);
        }
    }, []);

    async function fetchClients(salonId: string) {
        setLoading(true);
        try {
            const res = await fetch(`/api/clients/list?salonId=${salonId}`);
            const data = await res.json();
            if (data.success) {
                setClients(data.clients);
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddClient(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch(`/api/clients/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, salonId: salon._id })
            });
            const data = await res.json();
            if (data.success) {
                setShowAddModal(false);
                setFormData({ name: "", phone: "", email: "", gender: "male", notes: "" });
                fetchClients(salon._id);
            } else {
                alert(data.message || "Error adding client");
            }
        } catch (error) {
            console.error("Error adding client:", error);
        }
    }

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Client CRM</h1>
                    <p className="mt-1 text-sm text-slate-600 font-medium">Manage customer relationships and loyalty</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-blue-200 hover:scale-105 transition-all active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    NEW CLIENT
                </button>
            </div>

            {/* Toolbar */}
            <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-3xl focus:border-indigo-500 outline-none font-medium transition-all shadow-sm"
                />
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                    <div key={client._id} className="bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-sm hover:border-indigo-200 transition-all group overflow-hidden relative">
                        {/* Loyalty Badge */}
                        <div className="absolute top-0 right-0 p-3">
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-amber-100 animate-pulse">
                                <Star className="w-3 h-3 fill-amber-500" />
                                {client.loyaltyPoints} Points
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xl font-black uppercase">
                                {client.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{client.name}</h3>
                                <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span className="text-sm font-bold">{client.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 p-3 rounded-2xl">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Visits</div>
                                <div className="text-lg font-black text-slate-900">{client.totalVisits}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Spent</div>
                                <div className="text-lg font-black text-slate-900">₹{client.totalSpent}</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-slate-400">
                                <History className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase">Last visit: {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'Never'}</span>
                            </div>
                            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredClients.length === 0 && (
                    <div className="col-span-full py-32 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                                <Users className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-widest">No Clients Found</h3>
                                <p className="text-sm font-bold mt-1 tracking-tight">Try expanding your search or adding a new client</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Client Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-black">Add New Client</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddClient} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-medium"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-medium"
                                        placeholder="10 digit phone"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-medium"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Email (Optional)</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-medium"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                                >
                                    SAVE CLIENT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
