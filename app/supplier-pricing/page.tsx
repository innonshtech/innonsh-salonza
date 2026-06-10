"use client";

import { Check, Zap, Rocket, Star } from "lucide-react";

export default function SupplierPricingPage() {
    const plans = [
        {
            name: "Pioneer",
            price: "Free",
            icon: <Star className="w-8 h-8 text-slate-400" />,
            features: ["10 Free Listings", "15% Sales Commission", "Standard Support", "Basic Analytics"],
            buttonText: "START FOR FREE",
            color: "slate"
        },
        {
            name: "Growth",
            price: "₹1,499",
            period: "/month",
            icon: <Zap className="w-8 h-8 text-amber-500" />,
            features: ["100 Product Listings", "8% Sales Commission", "Priority Search Ranking", "Customer Insights"],
            buttonText: "GO GROWTH",
            color: "amber",
            popular: true
        },
        {
            name: "Enterprise",
            price: "₹4,999",
            period: "/month",
            icon: <Rocket className="w-8 h-8 text-indigo-600" />,
            features: ["Unlimited Listings", "3% Sales Commission", "Verified Badge", "Monthly Marketing Campaign", "Bulk Order Suite"],
            buttonText: "GO ENTERPRISE",
            color: "indigo"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">Supply the Best Salons</h1>
                    <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">Choose a plan that scales with your distribution network. Empower 1000+ salons across the platform.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div key={plan.name} className={`relative bg-white rounded-[40px] p-10 border-2 transition-all hover:scale-105 duration-300 ${plan.popular ? 'border-indigo-600 shadow-2xl shadow-indigo-100' : 'border-slate-100 shadow-xl shadow-slate-200'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-16 h-16 bg-${plan.color}-50 rounded-3xl flex items-center justify-center mb-6`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                                    {plan.period && <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">{plan.period}</span>}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                                        <div className={`w-5 h-5 rounded-full bg-${plan.color}-100 flex items-center justify-center`}>
                                            <Check className={`w-3 h-3 text-${plan.color === 'slate' ? 'slate-500' : plan.color + '-600'}`} />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${plan.popular ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center text-slate-400 font-bold text-sm flex items-center justify-center gap-2">
                    <Info className="w-5 h-5" />
                    All plans include integrated shipping and secure B2B payments.
                </div>
            </div>
        </div>
    );
}

function Info({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
    )
}
