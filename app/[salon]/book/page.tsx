"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle,
  Scissors,
  ArrowLeft,
  IndianRupee,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Service {
  _id: string;
  name: string;
  duration: number;
  price: number;
}

interface Salon {
  _id: string;
  name: string;
  slug: string;
}

export default function BookingPage() {
  const params = useParams();
  const salonSlug = params.salon as string;

  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // FORM FIELDS
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    loadSalonData();
  }, [salonSlug]);

  // LOAD SALON + SERVICES
  async function loadSalonData() {
    try {
      const res = await fetch(`/api/public/salon/${salonSlug}`);
      const data = await res.json();

      if (data.success) {
        setSalon(data.salon);
        setServices(data.services || []);
      } else {
        setError("Salon not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load salon data");
    } finally {
      setLoading(false);
    }
  }

  // HANDLE MULTI-SELECTION
  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  }

  // CALCULATE TOTALS
  const totalDuration = selectedServices
    .map((id) => services.find((s) => s._id === id)?.duration || 0)
    .reduce((a, b) => a + b, 0);

  const totalPrice = selectedServices
    .map((id) => services.find((s) => s._id === id)?.price || 0)
    .reduce((a, b) => a + b, 0);

  // SUBMIT
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      setError("Please select at least one service");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings/create-multi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonSlug,
          customerName,
          customerPhone,
          customerEmail,
          serviceIds: selectedServices,
          date: `${selectedDate}T${selectedTime}:00`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to create booking");
      }
    } catch (error) {
      setError("Something went wrong! Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // TIME SLOTS
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
  ];

  const today = new Date().toISOString().split("T")[0];

  // SUCCESS PAGE
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-[#6C4EFF] to-purple-600 p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <CheckCircle className="text-green-500 w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-purple-100">
              We're looking forward to seeing you
            </p>
          </div>

          {/* Success Body */}
          <div className="p-8">
            <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-[#6C4EFF]" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Booking at</p>
                  <p className="font-bold text-slate-900 text-lg">{salon?.name}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Name</p>
                    <p className="text-slate-900 font-medium">{customerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Date & Time</p>
                    <p className="text-slate-900 font-medium">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-slate-600 text-sm">at {selectedTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Scissors className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 uppercase font-medium mb-2">
                      Services Booked
                    </p>
                    <div className="space-y-2">
                      {selectedServices.map((id) => {
                        const s = services.find((x) => x._id === id);
                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between text-sm bg-white p-2 rounded border border-slate-200"
                          >
                            <span className="text-slate-900 font-medium">{s?.name}</span>
                            <div className="flex items-center gap-3 text-slate-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {s?.duration}min
                              </span>
                              <span className="flex items-center gap-0.5 font-semibold text-slate-900">
                                <IndianRupee className="w-3 h-3" />
                                {s?.price}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 mt-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-bold text-slate-900">Total Amount</span>
                    <span className="font-bold text-[#6C4EFF] flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {totalPrice}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Total duration: {totalDuration} minutes
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">Important</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Please arrive 10 minutes before your appointment time. If you need to cancel
                    or reschedule, please contact the salon directly.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/${salonSlug}`}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#6C4EFF] text-white rounded-lg font-semibold hover:bg-[#5a3fd6] transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Salon
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#6C4EFF]" />
          <p className="text-slate-600">Loading salon details...</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error && !salon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-lg border border-slate-200 text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-red-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6C4EFF] text-white rounded-lg font-semibold hover:bg-[#5a3fd6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href={`/${salonSlug}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to {salon?.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-[#6C4EFF]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Book Your Appointment
              </h1>
              <p className="text-slate-600 text-sm">Complete the form below to schedule your visit</p>
            </div>
          </div>
        </div>
      </header>

      {/* FORM */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-900 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* CUSTOMER INFO */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                  <User className="w-4 h-4 text-[#6C4EFF]" />
                </div>
                Personal Information
              </h2>
              <p className="text-sm text-slate-600 mt-1">We'll use this to confirm your booking</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C4EFF] focus:border-transparent"
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C4EFF] focus:border-transparent"
                      placeholder="Enter phone number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C4EFF] focus:border-transparent"
                      placeholder="Enter email address"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICES */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                  <Scissors className="w-4 h-4 text-[#6C4EFF]" />
                </div>
                Select Services
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Choose one or more services (you can select multiple)
              </p>
            </div>

            <div className="p-6">
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <Scissors className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No services available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((s) => {
                    const isSelected = selectedServices.includes(s._id);
                    return (
                      <button
                        key={s._id}
                        type="button"
                        onClick={() => toggleService(s._id)}
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all text-left ${
                          isSelected
                            ? "border-[#6C4EFF] bg-purple-50 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-[#6C4EFF] rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className="pr-8">
                          <h3 className="font-semibold text-slate-900 mb-2">{s.name}</h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-slate-600">
                              <Clock className="w-4 h-4" />
                              {s.duration} min
                            </span>
                            <span className="flex items-center gap-0.5 font-bold text-[#6C4EFF]">
                              <IndianRupee className="w-4 h-4" />
                              {s.price}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TOTALS */}
              {selectedServices.length > 0 && (
                <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-[#6C4EFF] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-[#6C4EFF]" />
                    <span className="font-bold text-slate-900">Selected Services Summary</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <p className="text-2xl font-bold text-slate-900">
                        {selectedServices.length}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">Services</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <p className="text-2xl font-bold text-slate-900">{totalDuration}</p>
                      <p className="text-xs text-slate-600 mt-1">Minutes</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <p className="text-2xl font-bold text-[#6C4EFF] flex items-center justify-center gap-0.5">
                        <IndianRupee className="w-5 h-5" />
                        {totalPrice}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">Total</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* DATE + TIME */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                  <Calendar className="w-4 h-4 text-[#6C4EFF]" />
                </div>
                Choose Date & Time
              </h2>
              <p className="text-sm text-slate-600 mt-1">Pick your preferred appointment slot</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C4EFF] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C4EFF] focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Choose a time slot</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* SUBMIT */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <button
              type="submit"
              disabled={submitting || selectedServices.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#6C4EFF] text-white rounded-lg font-bold text-lg hover:bg-[#5a3fd6] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Booking
                  {selectedServices.length > 0 && (
                    <span className="ml-2 flex items-center gap-0.5">
                      (<IndianRupee className="w-4 h-4" />
                      {totalPrice})
                    </span>
                  )}
                </>
              )}
            </button>

            {selectedServices.length === 0 && (
              <p className="text-center text-sm text-slate-500 mt-3">
                Please select at least one service to continue
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}