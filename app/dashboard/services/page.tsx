"use client";

import { useEffect, useState, useRef } from "react";
import {
  Scissors,
  Plus,
  Trash2,
  Clock,
  IndianRupee,
  Edit,
  X,
  Save,
  Image as ImageIcon,
} from "lucide-react";

interface Service {
  _id: string;
  name: string;
  duration: number;
  price: number;
  image?: string | null;
  description?: string;
}

export default function ManageServices() {
  const [salon, setSalon] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Add form
  const [name, setName] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState<number | "">("");
  const [editPrice, setEditPrice] = useState<number | "">("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const saved = localStorage.getItem("salon");
    if (saved) {
      const s = JSON.parse(saved);
      setSalon(s);
      loadServices(s._id);
    }
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadServices(id: string) {
    try {
      setLoading(true);
      const res = await fetch(`/api/salon/services/list?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data?.services) {
        setServices(data.services);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("loadServices:", err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0] ?? null;
    console.log(file)
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }

  function handleEditImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setEditImageFile(file);
    if (file) {
      setEditImagePreview(URL.createObjectURL(file));
    } else {
      setEditImagePreview(null);
    }
  }

  async function uploadToCloudinary(file: File) {
    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary not configured (check NEXT_PUBLIC_ env vars)");
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    const res = await fetch(url, {
      method: "POST",
      body: fd,
    });
    console.log("Cloudinary response:", res);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error("Cloudinary upload failed: " + errText);
    }

    const data = await res.json();
    
    return data.secure_url as string;
  }

  async function addService(e: React.FormEvent) {
    e.preventDefault();
    if (!salon) return alert("Salon not found in localStorage");

    if (!name || !duration || !price) {
      return alert("Please fill name, duration and price");
    }

    setLoading(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        salonId: salon._id,
        name: name.trim(),
        duration: Number(duration),
        price: Number(price),
        description: description.trim() || undefined,
        image: imageUrl,
      };

      const res = await fetch("/api/salon/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // reload
        await loadServices(salon._id);
        // reset
        setName("");
        setDuration("");
        setPrice("");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
      } else {
        console.error("Add service failed:", data);
        alert(data?.message || "Failed to add service");
      }
    } catch (err: any) {
      console.error("addService error:", err);
      alert(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(service: Service) {
    setEditingId(service._id);
    setEditName(service.name || "");
    setEditDuration(service.duration ?? "");
    setEditPrice(service.price ?? "");
    setEditDescription(service.description || "");
    setEditImagePreview(service.image || null);
    setEditImageFile(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditDuration("");
    setEditPrice("");
    setEditDescription("");
    setEditImageFile(null);
    setEditImagePreview(null);
  }

  async function saveEdit(id: string) {
    if (!editingId) return;
    if (!editName || !editDuration || !editPrice) {
      return alert("Please fill name, duration and price");
    }

    setBusyId(id);
    try {
      let imageUrl: string | undefined | null = editImagePreview ?? undefined;
      if (editImageFile) {
        imageUrl = await uploadToCloudinary(editImageFile);
      }

      // If imageUrl is null/undefined we won't include it, server may keep existing
      const payload: any = {
        id,
        name: editName.trim(),
        duration: Number(editDuration),
        price: Number(editPrice),
        description: editDescription?.trim() || undefined,
      };

      // only include image if user uploaded or cleared it
      if (editImageFile) payload.image = imageUrl;
      if (editImagePreview === null) {
        // user intentionally cleared preview -> remove image
        payload.image = null;
      }

      const res = await fetch("/api/salon/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await loadServices(salon._id);
        cancelEdit();
      } else {
        console.error("Update failed:", data);
        alert(data?.message || "Failed to update service");
      }
    } catch (err: any) {
      console.error("saveEdit error:", err);
      alert(err?.message || "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteService(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setBusyId(id);
    try {
      const res = await fetch("/api/salon/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await loadServices(salon._id);
      } else {
        console.error("Delete failed:", data);
        alert(data?.message || "Failed to delete");
      }
    } catch (err) {
      console.error("deleteService error:", err);
      alert("Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  // helper: clear add image
  function clearAddImage() {
    setImageFile(null);
    setImagePreview(null);
    // also clear input value if needed (we don't keep ref to file input here)
  }

  // helper: clear edit image (user wants to remove image)
  function removeEditImage() {
    setEditImageFile(null);
    setEditImagePreview(null); // set to null meaning "remove image" on save
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manage Services</h1>
        <p className="mt-2 text-slate-600">
          Add and manage services offered at {salon?.name || "your salon"}
        </p>
      </div>

      {/* Add Service */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Add New Service</h2>
        </div>

        <form onSubmit={addService} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Service Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Scissors className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="e.g., Haircut"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (minutes)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  placeholder="30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                  min={1}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  placeholder="500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                  min={0}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Image (optional)</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-100">
                <ImageIcon className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">Choose Image</span>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>

              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="preview" className="w-24 h-24 object-cover rounded-md border" />
                  <button
                    type="button"
                    onClick={clearAddImage}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                    title="Remove"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 border border-dashed border-slate-200 rounded-md flex items-center justify-center text-slate-400 text-sm">
                  No image
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              {loading ? "Adding..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Your Services</h2>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
            {services.length} {services.length === 1 ? "Service" : "Services"}
          </span>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No services yet</h3>
            <p className="text-slate-600">Add your first service using the form above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((service) => {
              const isEditing = editingId === service._id;
              return (
                <div
                  key={service._id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  {isEditing ? (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        value={editDuration}
                        onChange={(e) => setEditDuration(e.target.value === "" ? "" : Number(e.target.value))}
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value === "" ? "" : Number(e.target.value))}
                        className="px-3 py-2 border rounded-lg"
                      />
                      <div className="md:col-span-3">
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                          rows={2}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md cursor-pointer">
                          <ImageIcon className="w-4 h-4" />
                          <input type="file" accept="image/*" onChange={handleEditImageSelect} className="hidden" />
                          <span className="text-xs">Replace Image</span>
                        </label>

                        {editImagePreview ? (
                          <div className="relative">
                            <img src={editImagePreview} className="w-20 h-20 object-cover rounded-md border" />
                            <button type="button" onClick={removeEditImage} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow">
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 border border-dashed rounded-md flex items-center justify-center text-xs text-slate-400">
                            No image
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex items-center justify-center border">
                        {service.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                        ) : (
                          <Scissors className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{service.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {service.duration} mins
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {service.price}
                          </span>
                        </div>
                        {service.description && <p className="text-sm text-slate-600 mt-2">{service.description}</p>}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(service._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Save"
                          disabled={busyId === service._id}
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button onClick={cancelEdit} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Cancel">
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(service)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" title="Edit">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteService(service._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete" disabled={busyId === service._id}>
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Scissors className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Service Management Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Services are shown to customers on your public booking page</li>
              <li>• Set realistic durations to manage your schedule effectively</li>
              <li>• Update prices regularly to reflect current market rates</li>
              <li>• Use clear, descriptive names so customers know exactly what they&apos;re booking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
