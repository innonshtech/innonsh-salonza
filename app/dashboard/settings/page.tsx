"use client";

import { useEffect, useState } from "react";
import { loadRazorpay } from "@/utils/loadRazorpay";
import {
  Settings as SettingsIcon,
  Store,
  Link as LinkIcon,
  CreditCard,
  Check,
  Crown,
  Zap,
  Shield,
  Globe,
  Image as ImageIcon,
  Upload,
  Trash2,
  Loader2,
  Bell,
  Palette
} from "lucide-react";
import Link from "next/link";

interface Salon {
  _id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: string;
  mainImage?: string;
}

export default function SettingsPage() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'subscription'>('general');
  const [uploading, setUploading] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const saved = localStorage.getItem("salon");
    if (saved) setSalon(JSON.parse(saved));
  }, []);

  async function startSubscription(type: 'basic' | 'pro') {
    if (!salon) return;

    setLoading(true);
    try {
      const res = await fetch("/api/payments/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId: salon._id,
          planType: type,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Failed to start subscription");
        return;
      }

      // Load Razorpay script dynamically
      const ok = await loadRazorpay();
      if (!ok) {
        alert("Failed to load Razorpay");
        return;
      }

      // Razorpay Checkout Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: salon.name,
        description: `${type.toUpperCase()} Plan Subscription`,
        handler: function (response: any) {
          alert("Payment Successful! Your subscription is now active.");
          console.log(response);
          window.location.reload();
        },
        theme: {
          color: "#6C4EFF",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error starting subscription:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !salon) return;

    setUploading(true);
    try {
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", uploadPreset!);

      const res = await fetch(url, { method: "POST", body: fd });
      const data = await res.json();
      const imageUrl = data.secure_url;

      // Update salon profile
      const updateRes = await fetch("/api/salon/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId: salon._id,
          updates: { mainImage: imageUrl }
        }),
      });

      const updateData = await updateRes.json();
      if (updateData.success) {
        const updatedSalon = { ...salon, mainImage: imageUrl };
        setSalon(updatedSalon);
        localStorage.setItem("salon", JSON.stringify(updatedSalon));
        alert("Salon image updated successfully!");
      }

    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveImage() {
    if (!salon || !confirm("Remove salon image?")) return;

    setUploading(true);
    try {
      const updateRes = await fetch("/api/salon/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId: salon._id,
          updates: { mainImage: "" }
        }),
      });

      const updateData = await updateRes.json();
      if (updateData.success) {
        const updatedSalon = { ...salon, mainImage: "" };
        setSalon(updatedSalon);
        localStorage.setItem("salon", JSON.stringify(updatedSalon));
      }
    } catch (error) {
      console.error("Remove error:", error);
    } finally {
      setUploading(false);
    }
  }

  if (!salon) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const plans = [
    {
      name: 'Basic',
      type: 'basic' as const,
      price: 299,
      description: 'Perfect for solo stylists and small salons',
      popular: false,
      features: [
        'Branded booking website',
        'Live queue system',
        'Owner dashboard',
        'Up to 50 bookings/month',
        'SMS & Email notifications',
        'Basic analytics',
        'Mobile responsive',
        'Email support',
      ],
    },
    {
      name: 'Pro',
      type: 'pro' as const,
      price: 699,
      description: 'For growing salons with multiple staff',
      popular: true,
      features: [
        'Everything in Basic',
        'Unlimited bookings',
        'Staff management',
        'Multi-chair queue system',
        'Advanced analytics',
        'Priority customer support',
        'Custom branding',
        'Payment integration',
        'API access',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-600">Manage your salon settings and subscription</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${activeTab === 'general'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5" />
              <span>General</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${activeTab === 'subscription'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Subscription</span>
            </div>
          </button>
        </nav>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Salon Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Salon Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Salon Name
                </label>
                <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-slate-900 font-medium">{salon.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subdomain
                </label>
                <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-slate-900 font-medium">{salon.slug}.yourdomain.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Salon Image */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Salon Image</h2>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="relative group">
                <div className="w-64 h-48 rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                  {salon.mainImage ? (
                    <img
                      src={salon.mainImage}
                      alt="Salon"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No image uploaded</p>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                  )}
                </div>
                {salon.mainImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-slate-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Upload Salon Photo</h3>
                  <p className="text-sm text-slate-600">
                    This image will be featured at the top of your public booking page.
                    Recommended size: 1200x800px.
                  </p>
                </div>

                <label className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50">
                  <Upload className="w-5 h-5 mr-2" />
                  <span>{uploading ? 'Uploading...' : 'Choose Image'}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-1">Your Public Booking Site</h3>
                <p className="text-sm text-purple-800 mb-4">
                  Share this link with your customers to let them book appointments online
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 px-4 py-3 bg-white rounded-lg border border-purple-200">
                    <code className="text-sm text-purple-600">
                      {typeof window !== 'undefined' ? `${window.location.origin}/${salon.slug}` : `yourdomain.com/${salon.slug}`}
                    </code>
                  </div>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.origin}/${salon.slug}`);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Notifications</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Manage how you receive notifications about bookings and queue updates
              </p>
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                Configure →
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Palette className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Branding</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Customize your booking page colors, logo, and styling
              </p>
              <Link href={"/dashboard/setup"} className="text-sm font-medium text-purple-600 hover:text-purple-700">
                Customize →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          {/* Current Plan Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Current Plan</h2>
                <p className="text-slate-600 mt-1">Choose the plan that fits your needs</p>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold text-green-700">Active</p>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.type}
                className={`relative bg-white rounded-xl border-2 p-8 ${plan.popular
                  ? 'border-purple-300 shadow-lg'
                  : 'border-slate-200'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Crown className="w-4 h-4" />
                      <span>MOST POPULAR</span>
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-start justify-center">
                      <span className="text-2xl font-bold text-slate-900 mt-2">₹</span>
                      <span className="text-5xl font-bold text-purple-600">{plan.price}</span>
                      <span className="text-slate-600 mt-8 ml-2">/month</span>
                    </div>
                  </div>

                  <button
                    onClick={() => startSubscription(plan.type)}
                    disabled={loading}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                  >
                    {loading ? 'Processing...' : 'Subscribe Now'}
                  </button>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Secure Payment</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• All payments are processed securely through Razorpay</li>
                  <li>• 14-day free trial on all plans</li>
                  <li>• Cancel anytime, no questions asked</li>
                  <li>• Upgrade or downgrade your plan at any time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Basic</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Bookings per month', basic: '50', pro: 'Unlimited' },
                    { name: 'Queue system', basic: true, pro: true },
                    { name: 'Staff management', basic: false, pro: true },
                    { name: 'Analytics', basic: 'Basic', pro: 'Advanced' },
                    { name: 'Support', basic: 'Email', pro: 'Priority' },
                    { name: 'Custom branding', basic: false, pro: true },
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-700">{row.name}</td>
                      <td className="py-3 px-4 text-center">
                        {typeof row.basic === 'boolean' ? (
                          row.basic ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-slate-400">—</span>
                          )
                        ) : (
                          <span className="text-slate-700">{row.basic}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-slate-400">—</span>
                          )
                        ) : (
                          <span className="text-slate-700">{row.pro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}