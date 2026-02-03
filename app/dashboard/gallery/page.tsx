"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Plus, Trash2, Loader2, X } from "lucide-react";

export default function ManageGallery() {
  const [salon, setSalon] = useState<any>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const saved = localStorage.getItem("salon");
    if (saved) {
      const s = JSON.parse(saved);
      setSalon(s);
      loadGallery(s._id);
    } else {
      setInitialLoading(false);
    }
  }, []);

  async function loadGallery(salonId: string) {
    try {
      const res = await fetch(`/api/salon/gallery/list?salonId=${salonId}`);
      const data = await res.json();
      if (data.success) {
        setGallery(data.gallery || []);
      }
    } catch (err) {
      console.error("Gallery load error:", err);
    } finally {
      setInitialLoading(false);
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function uploadToCloudinary(file: File) {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset!);

    const res = await fetch(url, { method: "POST", body: fd });
    const data = await res.json();
    return data.secure_url;
  }

  async function addImage(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile || !salon) return;

    setLoading(true);
    try {
      const imgUrl = await uploadToCloudinary(imageFile);

      await fetch(`/api/salon/gallery/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId: salon._id,
          imageUrl: imgUrl,
        }),
      });

      setPreview(null);
      setImageFile(null);
      await loadGallery(salon._id);
    } catch (err) {
      console.error("Add image error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteImage(url: string) {
    if (!confirm("Delete this image?")) return;

    const res = await fetch(`/api/salon/gallery/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salonId: salon._id, imageUrl: url }),
    });

    const data = await res.json();
    if (data.success) {
      loadGallery(salon._id);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manage Gallery</h1>
        <p className="text-slate-600 mt-1">
          Upload photos that appear in your public salon page gallery.
        </p>
      </div>

      {/* Add Image Card */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-600" /> Add New Photo
        </h2>

        <form onSubmit={addImage} className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer bg-slate-50 px-4 py-3 rounded-md border">
            <ImageIcon className="w-5 h-5 text-slate-500" />
            <span>Choose Image</span>
            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </label>

          {preview && (
            <div className="relative w-48 h-48 border rounded-md overflow-hidden">
              <img src={preview} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setImageFile(null);
                }}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Add Photo"}
          </button>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Gallery</h2>

        {gallery.length === 0 ? (
          <p className="text-slate-600">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  className="w-full h-48 rounded-xl object-cover border shadow-sm"
                  alt="Gallery"
                />

                {/* delete button */}
                <button
                  onClick={() => deleteImage(url)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
