"use client";

import { useState } from "react";
import { Star, X, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function FeedbackModal({ isOpen, onClose, customer, salonId }: any) {
  if (!isOpen || !customer) return null;

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!rating) {
      showToast("Please provide a rating", "error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/feedback/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: customer.name,
          phone: customer.phone,
          rating,
          comment,
          salonId: salonId
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      showToast("Feedback submitted", "success");
      onClose();
    } catch (error: any) {
      console.error(error);
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-5 text-white">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 fill-white" />
              Customer Feedback
            </h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-purple-100 text-xs mt-1">How was the service today?</p>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-3">
            <div className="space-y-1 text-sm text-slate-600">
              <label className="text-xs font-semibold text-slate-500 uppercase">Customer Name</label>
              <input
                type="text"
                value={customer.name || ""}
                disabled
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none font-medium cursor-not-allowed text-sm"
              />
            </div>
            {customer.phone && (
              <div className="space-y-1 text-sm text-slate-600">
                <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={customer.phone || ""}
                  disabled
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none font-medium cursor-not-allowed text-sm"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-500 uppercase block text-center mb-3">Rate the Experience *</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110 outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      (hoveredRating || rating) >= value 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "fill-slate-100 text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Additional Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={3}
              className="w-full text-sm px-3 py-2 resize-none bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex justify-between items-center pt-2 gap-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2 text-sm text-slate-500 font-medium hover:text-slate-800 transition-colors"
            >
              Skip Feedback
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all ${
                loading || rating === 0 
                  ? "bg-purple-300 cursor-not-allowed shadow-none" 
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
