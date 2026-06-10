"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
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
    X,
    Eye,
    Edit2,
    Trash2
} from "lucide-react";

type Salon = {
    _id: string;
    name?: string;
};

type Client = {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    gender?: "male" | "female" | "other";
    notes?: string;
    rating?: number;
    loyaltyPoints?: number;
    totalVisits?: number;
    totalSpent?: number;
    lastVisit?: string;
};

type ClientFormData = {
    name: string;
    phone: string;
    email: string;
    gender: "male" | "female" | "other";
    notes: string;
    rating: number;
};

export default function ClientsPage() {
    const { showToast } = useToast();
    const [salon, setSalon] = useState<Salon | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [viewingClient, setViewingClient] = useState<Client | null>(null);
    const [formData, setFormData] = useState<ClientFormData>({
        name: "",
        phone: "",
        email: "",
        gender: "male",
        notes: "",
        rating: 0
    });
    const [phoneError, setPhoneError] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const fetchClients = useCallback(async (salonId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/clients/list?salonId=${salonId}`);
            const data = await res.json();
            if (data.success) {
                setClients(data.clients);
            } else {
                console.error("Failed to fetch clients:", data.message);
                showToast(data.message || "Failed to load clients", "error");
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
            showToast("Failed to load clients", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        const saved = localStorage.getItem("salon");
        if (saved) {
            const s: Salon = JSON.parse(saved);
            setSalon(s);
            fetchClients(s._id);
        }
    }, [fetchClients]);

    // Validate phone number (exactly 10 digits)
    function validatePhone(phone: string): boolean {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }

    async function handleAddClient(e: React.FormEvent) {
        e.preventDefault();
        setPhoneError("");
        const salonId = salon?._id;

        if (!salonId) {
            showToast("Salon context not found", "error");
            return;
        }

        if (!validatePhone(formData.phone)) {
            setPhoneError("Phone number must be exactly 10 digits (numbers only)");
            return;
        }

        try {
            const res = await fetch(`/api/clients/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    salonId,
                    rating: formData.rating > 0 ? formData.rating : undefined
                })
            });
            const data = await res.json();
            if (data.success) {
                setShowAddModal(false);
                setFormData({ name: "", phone: "", email: "", gender: "male", notes: "", rating: 0 });
                fetchClients(salonId);
                showToast("Client added successfully!", "success");
            } else {
                showToast(data.message || "Error adding client", "error");
            }
        } catch (error) {
            console.error("Error adding client:", error);
            showToast("Failed to add client", "error");
        }
    }

    async function handleUpdateClient(e: React.FormEvent) {
        e.preventDefault();
        setPhoneError("");
        const salonId = salon?._id;

        if (!editingClient) return;
        if (!salonId) {
            showToast("Salon context not found", "error");
            return;
        }

        if (!validatePhone(formData.phone)) {
            setPhoneError("Phone number must be exactly 10 digits (numbers only)");
            return;
        }

        try {
            const res = await fetch(`/api/clients/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingClient._id, ...formData })
            });
            const data = await res.json();
            if (data.success) {
                setShowEditModal(false);
                setEditingClient(null);
                setFormData({ name: "", phone: "", email: "", gender: "male", notes: "", rating: 0 });
                fetchClients(salonId);
                showToast("Client updated successfully!", "success");
            } else {
                showToast(data.message || "Error updating client", "error");
            }
        } catch (error) {
            console.error("Error updating client:", error);
            showToast("Failed to update client", "error");
        }
    }

    async function deleteClient(id: string) {
        if (!confirm("Are you sure you want to delete this client?")) return;
        const salonId = salon?._id;
        if (!salonId) {
            showToast("Salon context not found", "error");
            return;
        }
        try {
            const res = await fetch(`/api/clients/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                fetchClients(salonId);
                showToast("Client deleted successfully!", "success");
            } else {
                showToast(data.message || "Error deleting client", "error");
            }
        } catch (error) {
            console.error("Error deleting client:", error);
            showToast("Failed to delete client", "error");
        }
    }

    function openEdit(client: Client) {
        setEditingClient(client);
        setFormData({
            name: client.name || "",
            phone: client.phone || "",
            email: client.email || "",
            gender: client.gender || "male",
            notes: client.notes || "",
            rating: client.rating || 0
        });
        setShowEditModal(true);
    }

    function openView(client: Client) {
        setViewingClient(client);
        setShowViewModal(true);
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
                    <h1 className="text-2xl font-semibold text-slate-900">Client CRM</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage customer relationships and loyalty for {salon?.name || "your salon"}
          </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    New Client
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
                    <div key={client._id} className="bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-sm hover:border-indigo-200 transition-all group relative">
                        {/* Loyalty Badge */}
                        <div className="absolute top-0 right-0 p-3">
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-amber-100 animate-pulse">
                                <Star className="w-3 h-3 fill-amber-500" />
                                {client.loyaltyPoints} Points
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xl font-black uppercase">
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

                        <div className={`grid gap-4 mb-6 ${(client.rating ?? 0) > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                            <div className="bg-slate-50 p-3 rounded-2xl">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Visits</div>
                                <div className="text-lg font-black text-slate-900">{client.totalVisits}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Spent</div>
                                <div className="text-lg font-black text-slate-900">₹{client.totalSpent}</div>
                            </div>
                            {(client.rating ?? 0) > 0 && (
                                <div className="bg-slate-50 p-3 rounded-2xl">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= (client.rating ?? 0) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-slate-400">
                                <History className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase">Last visit: {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'Never'}</span>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === client._id ? null : client._id)}
                                    className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </button>

                                {openMenuId === client._id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                                        <button
                                            onClick={() => { openView(client); setOpenMenuId(null); }}
                                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" /> View Details
                                        </button>
                                        <button
                                            onClick={() => { openEdit(client); setOpenMenuId(null); }}
                                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => { if (confirm("Delete this client?")) { deleteClient(client._id); } setOpenMenuId(null); }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
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
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                        <div className="bg-linear-to-br from-indigo-900 to-indigo-800 p-6 text-white flex justify-between items-center">
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
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Phone Number *</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:border-indigo-500 outline-none font-medium ${phoneError ? 'border-red-500' : 'border-slate-100'}`}
                                        placeholder="10 digit phone"
                                    />
                                    {phoneError && (
                                        <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as ClientFormData["gender"] })}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-medium"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Rating (1-5)</label>
                                    <select
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-medium"
                                    >
                                        <option value={0}>Not Rated</option>
                                        <option value={1}>1 - Poor</option>
                                        <option value={2}>2 - Fair</option>
                                        <option value={3}>3 - Good</option>
                                        <option value={4}>4 - Very Good</option>
                                        <option value={5}>5 - Excellent</option>
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

            {/* Edit Client Modal */}
            {showEditModal && editingClient && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                        <div className="bg-linear-to-br from-indigo-900 to-indigo-800 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-black">Edit Client</h3>
                            <button onClick={() => { setShowEditModal(false); setEditingClient(null); }} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateClient} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Full Name *</label>
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
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Phone Number *</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:border-indigo-500 outline-none font-medium ${phoneError ? 'border-red-500' : 'border-slate-100'}`}
                                        placeholder="10 digit phone"
                                    />
                                    {phoneError && (
                                        <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as ClientFormData["gender"] })}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-medium"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Rating (1-5)</label>
                                    <select
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-medium"
                                    >
                                        <option value={0}>Not Rated</option>
                                        <option value={1}>1 - Poor</option>
                                        <option value={2}>2 - Fair</option>
                                        <option value={3}>3 - Good</option>
                                        <option value={4}>4 - Very Good</option>
                                        <option value={5}>5 - Excellent</option>
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
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-medium"
                                        rows={3}
                                        placeholder="Additional notes about this client"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); setEditingClient(null); }}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                                >
                                    UPDATE CLIENT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Client Modal */}
            {showViewModal && viewingClient && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                        <div className="bg-linear-to-br from-indigo-900 to-indigo-800 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-black">Client Details</h3>
                            <button onClick={() => { setShowViewModal(false); setViewingClient(null); }} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</div>
                                    <div className="text-lg font-bold text-slate-900">{viewingClient.name}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Phone</div>
                                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                                        <Phone className="w-4 h-4" /> {viewingClient.phone}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email</div>
                                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                                        <Mail className="w-4 h-4" /> {viewingClient.email || 'Not provided'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Gender</div>
                                    <div className="text-slate-900 font-medium capitalize">{viewingClient.gender}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Rating</div>
                                    <div className="flex items-center gap-1">
                                        {[1,2,3,4,5].map(star => (
                                            <Star key={star} className={`w-4 h-4 ${star <= (viewingClient.rating || 0) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                                        ))}
                                        <span className="ml-2 text-sm font-medium">{(viewingClient.rating || 0)} / 5</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Visits</div>
                                    <div className="text-lg font-bold text-slate-900">{viewingClient.totalVisits || 0}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Spent</div>
                                    <div className="text-lg font-bold text-slate-900">₹{viewingClient.totalSpent || 0}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Last Visit</div>
                                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                                        <Calendar className="w-4 h-4" /> {viewingClient.lastVisit ? new Date(viewingClient.lastVisit).toLocaleDateString() : 'Never'}
                                    </div>
                                </div>
                                {viewingClient.notes && (
                                    <div className="col-span-2">
                                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Notes</div>
                                        <div className="text-slate-700 bg-slate-50 p-3 rounded-xl">{viewingClient.notes}</div>
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => { setShowViewModal(false); setViewingClient(null); }}
                                    className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
