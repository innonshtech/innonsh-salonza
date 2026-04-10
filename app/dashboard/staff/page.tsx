"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
  Users,
  UserPlus,
  Phone,
  Briefcase,
  Award,
  CircleDot,
  Loader2,
  X,
  AlertCircle,
  UserX,
} from "lucide-react";

export default function StaffPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    phone: "",
    skills: "",
  });

  const salon =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("salon") || "{}")
      : {};

  // Load staff
  const loadStaff = async () => {
    try {
      const res = await fetch(`/api/staff/list?salonId=${salon._id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (err) {
      console.log("Error loading staff:", err);
      showToast("Failed to load staff members", "error");
      setError("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (salon?._id) {
      loadStaff();
    } else {
      setLoading(false);
    }
  }, [salon?._id]);

  // Validate phone number (exactly 10 digits)
  function validatePhone(phone: string): boolean {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }

  // Add Staff
  const handleAddStaff = async () => {
    if (!newStaff.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!validatePhone(newStaff.phone)) {
      setPhoneError("Phone number must be exactly 10 digits (numbers only)");
      return;
    }

    setSubmitting(true);
    setError("");
    setPhoneError("");

    try {
      const res = await fetch("/api/staff/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          salonId: salon._id,
          name: newStaff.name,
          phone: newStaff.phone,
          skills: newStaff.skills.split(",").map((s) => s.trim()),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setNewStaff({ name: "", phone: "", skills: "" });
        loadStaff();
        showToast("Staff added successfully!", "success");
      } else {
        showToast(data.message || "Failed to add staff", "error");
      }
    } catch (err) {
      console.log(err);
      showToast("An error occurred while adding staff", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Update Status
  const updateStatus = async (staffId: string, status: string) => {
    try {
      const res = await fetch("/api/staff/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ staffId, status }),
      });

      const data = await res.json();
      if (data.success) {
        setStaff((prev: any) => 
          prev.map((s: any) => s._id === staffId ? { ...s, status } : s)
        );
        showToast("Staff status updated!", "success");
      } else {
        showToast(data.message || "Failed to update status", "error");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update staff status", "error");
    }
  };

  // Delete Staff
  const deleteStaff = async (staffId: string) => {
    if (!confirm("Are you sure you want to delete this staff member? This action cannot be undone.")) return;

    try {
      const res = await fetch("/api/staff/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ staffId }),
      });

      const data = await res.json();
      if (data.success) {
        loadStaff();
        showToast("Staff member deleted successfully!", "success");
      } else {
        showToast(data.message || "Failed to delete staff", "error");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      showToast("Failed to delete staff", "error");
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 border-green-200";
      case "busy":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "break":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "offline":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin text-[#6C4EFF]" />
          <span className="text-lg">Loading staff members...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-600 mt-1">
            Manage your team members and their real-time availability
          </p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            setError("");
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#6C4EFF] text-white font-semibold hover:bg-[#5a3fd6] transition-colors shadow-sm"
        >
          <UserPlus className="w-5 h-5" />
          Add Staff Member
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-[#6C4EFF]" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Staff</p>
              <p className="text-2xl font-bold text-slate-900">{staff.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CircleDot className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {staff.filter((s: any) => s.status === "available").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <CircleDot className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">Busy</p>
              <p className="text-2xl font-bold text-yellow-600">
                {staff.filter((s: any) => s.status === "busy").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <CircleDot className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">On Break</p>
              <p className="text-2xl font-bold text-orange-600">
                {staff.filter((s: any) => s.status === "break").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Active Professionals</h2>
        </div>

        <div className="p-6">
          {staff.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-600 font-bold mb-1">No staff members yet</p>
              <p className="text-slate-500 text-sm">
                Get started by adding your first team member
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {staff.map((member: any) => (
                <div
                  key={member._id}
                  className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-purple-200 transition-all hover:shadow-md group"
                >
                  {/* Staff Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg text-white font-black text-xl">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 leading-tight">
                          {member.name}
                        </h3>
                        <p className="text-xs font-black text-purple-600 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          Professional
                        </p>
                      </div>
                    </div>

                    <div
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${getStatusColor(
                        member.status
                      )}`}
                    >
                      {member.status}
                    </div>
                  </div>

                  {/* Staff Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{member.phone || "N/A"}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expertise</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 truncate">
                        <Award className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">
                          {member.skills?.length > 0 ? member.skills[0] : "Generalist"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Control */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 transition-all group-hover:bg-white group-hover:border-purple-100">
                    <p className="text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <CircleDot className="w-3 h-3" />
                        Manage Availability
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "available", color: "hover:bg-green-500 hover:text-white" },
                        { id: "busy", color: "hover:bg-yellow-500 hover:text-white" },
                        { id: "break", color: "hover:bg-orange-500 hover:text-white" },
                        { id: "offline", color: "hover:bg-red-500 hover:text-white" }
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => updateStatus(member._id, s.id)}
                          className={`px-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                            member.status === s.id
                               ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                               : `bg-white text-slate-600 border-slate-200 ${s.color}`
                          }`}
                        >
                          {s.id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => deleteStaff(member._id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all"
                      >
                        <UserX className="w-4 h-4" />
                        Remove Member
                      </button>
                      <button className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline">
                        View Analytics
                      </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600 rounded-2xl shadow-lg ring-4 ring-purple-100">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Add Professional</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Team Member</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-700 text-xs font-bold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                    Full Identity *
                  </label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="e.g. Sameer Khan"
                      value={newStaff.name}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner"
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                    Contact Phone *
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                    <input
                      type="tel"
                      placeholder="10 digit cellular number"
                      value={newStaff.phone}
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl font-bold text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner ${phoneError ? 'border-red-500' : 'border-slate-100'}`}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, phone: e.target.value })
                      }
                    />
                  </div>
                  {phoneError && (
                    <p className="text-red-500 text-[10px] font-black uppercase mt-2 ml-1">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                    Expertise Skills
                  </label>
                  <div className="relative group">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="e.g. Haircut, Facial, Spa"
                      value={newStaff.skills}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner"
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, skills: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-2 ml-1 italic">
                    Use commas to separate multiple talents
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-4 p-8 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Add Member
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}