"use client";

import { useEffect, useState } from "react";
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
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    phone: "",
    role: "stylist",
    skills: "",
  });

  const salon =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("salon") || "{}")
      : {};

  // Load staff
  const loadStaff = async () => {
    try {
      const res = await fetch(`/api/staff/list?salonId=${salon._id}`);
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (err) {
      console.log("Error loading staff:", err);
      setError("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (salon?._id) loadStaff();
  }, [salon?._id]);

  // Add Staff
  const handleAddStaff = async () => {
    if (!newStaff.name.trim()) {
      setError("Name is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/staff/add", {
        method: "POST",
        body: JSON.stringify({
          salonId: salon._id,
          name: newStaff.name,
          phone: newStaff.phone,
          role: newStaff.role,
          skills: newStaff.skills.split(",").map((s) => s.trim()),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setNewStaff({ name: "", phone: "", role: "stylist", skills: "" });
        loadStaff();
      } else {
        setError(data.message || "Failed to add staff");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred while adding staff");
    } finally {
      setSubmitting(false);
    }
  };

  // Update Status
  const updateStatus = async (staffId: string, status: string) => {
    const res = await fetch("/api/staff/status", {
      method: "POST",
      body: JSON.stringify({ staffId, status }),
    });

    const data = await res.json();
    if (data.success) loadStaff();
  };

  // Disable Staff
  const disableStaff = async (staffId: string) => {
    if (!confirm("Are you sure you want to disable this staff member?")) return;

    const res = await fetch("/api/staff/delete", {
      method: "DELETE",
      body: JSON.stringify({ staffId }),
    });

    const data = await res.json();
    if (data.success) loadStaff();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 border-green-200";
      case "busy":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "break":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "offline":
        return "bg-slate-100 text-slate-700 border-slate-200";
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
            Manage your team members and their availability
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
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-[#6C4EFF]" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Staff</p>
              <p className="text-2xl font-bold text-slate-900">{staff.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CircleDot className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Available</p>
              <p className="text-2xl font-bold text-slate-900">
                {staff.filter((s: any) => s.currentStatus === "available").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <CircleDot className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Busy</p>
              <p className="text-2xl font-bold text-slate-900">
                {staff.filter((s: any) => s.currentStatus === "busy").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg">
              <CircleDot className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Offline</p>
              <p className="text-2xl font-bold text-slate-900">
                {staff.filter((s: any) => s.currentStatus === "offline").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Staff Members</h2>
        </div>

        <div className="p-6">
          {staff.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium mb-1">No staff members yet</p>
              <p className="text-slate-500 text-sm">
                Get started by adding your first team member
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {staff.map((member: any) => (
                <div
                  key={member._id}
                  className="border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors"
                >
                  {/* Staff Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-[#6C4EFF]">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {member.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600 mt-0.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span className="capitalize">{member.role}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        member.currentStatus
                      )}`}
                    >
                      {member.currentStatus}
                    </span>
                  </div>

                  {/* Staff Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{member.phone || "No phone number"}</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <Award className="w-4 h-4 text-slate-400 mt-0.5" />
                      <span>
                        {member.skills?.length > 0
                          ? member.skills.join(", ")
                          : "No skills listed"}
                      </span>
                    </div>
                  </div>

                  {/* Status Control */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-slate-700 mb-2 uppercase tracking-wide">
                      Update Status
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {["available", "busy", "break", "offline"].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(member._id, status)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            member.currentStatus === status
                              ? "bg-[#6C4EFF] text-white border-[#6C4EFF]"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <span className="capitalize">{status}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => disableStaff(member._id)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors border border-red-100"
                  >
                    <UserX className="w-4 h-4" />
                    Disable Staff Member
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <UserPlus className="w-5 h-5 text-[#6C4EFF]" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Add Staff Member</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter staff member name"
                    value={newStaff.name}
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C4EFF] focus:border-transparent"
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={newStaff.phone}
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C4EFF] focus:border-transparent"
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={newStaff.role}
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C4EFF] focus:border-transparent appearance-none bg-white"
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, role: e.target.value })
                    }
                  >
                    <option value="stylist">Stylist</option>
                    <option value="manager">Manager</option>
                    <option value="receptionist">Receptionist</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Skills
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Hair cutting, Coloring, Styling"
                    value={newStaff.skills}
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C4EFF] focus:border-transparent"
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, skills: e.target.value })
                    }
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Separate multiple skills with commas
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C4EFF] text-white rounded-lg font-semibold hover:bg-[#5a3fd6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Add Staff
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