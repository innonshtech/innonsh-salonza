// "use client";

// import { useState } from "react";
// import {
//     CreditCard,
//     Plus,
//     CheckCircle2,
//     Users,
//     Clock,
//     ShieldCheck,
//     Star
// } from "lucide-react";

// export default function MembershipsPage() {
//     return (
//         <div className="space-y-8 pb-10">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-3xl font-black text-slate-900 tracking-tight">Memberships & Packages</h1>
//                     <p className="mt-1 text-sm text-slate-600 font-medium uppercase tracking-wider">Create subscription plans for your loyal clients</p>
//                 </div>
//                 <button className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-amber-100 hover:scale-105 transition-all flex items-center gap-2">
//                     <Plus className="w-5 h-5" />
//                     CREATE PLAN
//                 </button>
//             </div>

//             {/* Plans Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {/* Silver Plan */}
//                 <div className="bg-white rounded-[40px] border-2 border-slate-100 p-8 shadow-sm hover:border-amber-200 transition-all relative overflow-hidden group">
//                     <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:rotate-12 transition-transform">
//                         <Star className="w-24 h-24" />
//                     </div>
//                     <div className="relative z-10">
//                         <div className="bg-slate-100 w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-4">Silver Membership</div>
//                         <h3 className="text-2xl font-black text-slate-900 mb-2">₹1,999 / yr</h3>
//                         <p className="text-xs text-slate-500 font-bold mb-8 uppercase tracking-tighter">Perfect for regular visitors</p>

//                         <div className="space-y-4 mb-8">
//                             <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
//                                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
//                                 10% Off on All Services
//                             </div>
//                             <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
//                                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
//                                 Priority Booking
//                             </div>
//                             <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
//                                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
//                                 Birthday Special Offer
//                             </div>
//                         </div>

//                         <div className="flex items-center justify-between pt-6 border-t border-slate-50">
//                             <div className="flex items-center gap-2 text-slate-400">
//                                 <Users className="w-4 h-4" />
//                                 <span className="text-[10px] font-black uppercase tracking-widest">42 Active Members</span>
//                             </div>
//                             <button className="text-amber-600 font-black text-[10px] uppercase tracking-widest hover:underline">Edit Plan</button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Gold Plan */}
//                 <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[40px] p-8 text-white shadow-2xl shadow-amber-100 relative overflow-hidden group">
//                     <div className="absolute -right-4 -top-4 p-8 opacity-20 group-hover:scale-125 transition-transform duration-700">
//                         <Star className="w-32 h-32 fill-white" />
//                     </div>
//                     <div className="relative z-10 h-full flex flex-col justify-between">
//                         <div>
//                             <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-4 backdrop-blur-md">Gold Membership</div>
//                             <h3 className="text-3xl font-black mb-2">₹4,999 / yr</h3>
//                             <p className="text-xs text-white/70 font-bold mb-8 uppercase tracking-tighter italic">The Ultimate Salon Experience</p>

//                             <div className="space-y-4 mb-8">
//                                 <div className="flex items-center gap-3 text-sm font-bold">
//                                     <ShieldCheck className="w-4 h-4 text-white" />
//                                     25% Off on All Services
//                                 </div>
//                                 <div className="flex items-center gap-3 text-sm font-bold">
//                                     <ShieldCheck className="w-4 h-4 text-white" />
//                                     Free Hair Spa once a month
//                                 </div>
//                                 <div className="flex items-center gap-3 text-sm font-bold">
//                                     <ShieldCheck className="w-4 h-4 text-white" />
//                                     Dedicated Stylist
//                                 </div>
//                                 <div className="flex items-center gap-3 text-sm font-bold text-white/60">
//                                     <Clock className="w-4 h-4" />
//                                     Wait time: 0 Mins
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex items-center justify-between pt-6 border-t border-white/10">
//                             <div className="flex items-center gap-2">
//                                 <Users className="w-4 h-4" />
//                                 <span className="text-[10px] font-black uppercase tracking-widest">12 Active Members</span>
//                             </div>
//                             <button className="bg-white text-orange-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Manage</button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Add New */}
//                 <button className="bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center gap-4 hover:bg-slate-100 hover:border-slate-300 transition-all group">
//                     <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
//                         <Plus className="w-8 h-8 text-slate-400" />
//                     </div>
//                     <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Create New Tier</span>
//                 </button>
//             </div>
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import {
    CreditCard,
    Plus,
    CheckCircle2,
    Users,
    Clock,
    ShieldCheck,
    Star,
    Crown,
    Gift,
    Calendar,
    ArrowRight
} from "lucide-react";

export default function MembershipsPage() {
    const [plans] = useState([
        {
            id: 1,
            name: "Silver Membership",
            price: "₹1,999",
            period: "per year",
            description: "Perfect for regular visitors",
            color: "slate",
            features: [
                "10% Off on All Services",
                "Priority Booking",
                "Birthday Special Offer",
                "Monthly Newsletter"
            ],
            members: 42,
            popular: false
        },
        {
            id: 2,
            name: "Gold Membership",
            price: "₹4,999",
            period: "per year",
            description: "The Ultimate Salon Experience",
            color: "amber",
            features: [
                "25% Off on All Services",
                "Free Hair Spa once a month",
                "Dedicated Stylist",
                "Zero Wait Time",
                "Complimentary Products"
            ],
            members: 12,
            popular: true
        }
    ]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Memberships & Packages</h1>
                <p className="mt-1 text-sm text-slate-600">
                    {/* Create subscription plans for your loyal clients at {salon?.name || "your salon"} */}
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-slate-900">{plans.reduce((acc, plan) => acc + plan.members, 0)}</div>
                        <div className="text-xs text-slate-500">Active Members</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Crown className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-slate-900">2</div>
                        <div className="text-xs text-slate-500">Active Plans</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Gift className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-slate-900">25%</div>
                        <div className="text-xs text-slate-500">Average Discount</div>
                    </div>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Silver Plan */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium mb-2">
                                Silver Membership
                            </span>
                            <div className="text-xl font-semibold text-slate-900">₹1,999</div>
                            <p className="text-xs text-slate-500 mt-0.5">per year</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-slate-600" />
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-5">Perfect for regular visitors</p>

                    <div className="space-y-3 mb-6">
                        {plans[0].features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <Users className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{plans[0].members} members</span>
                        </div>
                        <button className="px-4 py-1.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm">
                            Edit
                        </button>
                    </div>
                </div>

                {/* Gold Plan (Featured) */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-5 text-white lg:col-span-2">
                    <div className="h-full flex flex-col">
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs font-medium">
                                            Gold Membership
                                        </span>
                                        <span className="inline-block px-2 py-0.5 bg-white text-amber-600 rounded text-xs font-medium">
                                            Most Popular
                                        </span>
                                    </div>
                                    <div className="text-2xl font-semibold">₹4,999</div>
                                    <p className="text-sm text-white/80 mt-0.5">per year</p>
                                </div>
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <Crown className="w-5 h-5" />
                                </div>
                            </div>

                            <p className="text-sm text-white/90 mb-5">The Ultimate Salon Experience</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                {plans[1].features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                        <ShieldCheck className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/20">
                            <div className="flex items-center gap-1.5 text-white/80">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">{plans[1].members} members</span>
                            </div>
                            <button className="px-4 py-1.5 bg-white text-amber-600 font-medium rounded-lg hover:bg-slate-100 transition-colors text-sm">
                                Manage Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create New Plan */}
            <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-6 hover:border-slate-400 transition-colors">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
                        <Plus className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Create New Membership Plan</h3>
                        <p className="text-sm text-slate-600">Design custom packages to boost customer loyalty</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all">
                        <Plus className="w-4 h-4" />
                        Create New Plan
                    </button>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-blue-900 mb-1">Membership Best Practices</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Offer tiered plans to cater to different customer budgets</li>
                            <li>• Include exclusive benefits like birthday offers to increase loyalty</li>
                            <li>• Set automatic renewal with notifications for recurring revenue</li>
                            <li>• Track member usage and adjust benefits based on data</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Benefits Overview */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5 text-white">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Gift className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Membership Benefits</h3>
                        <p className="text-slate-300 text-sm mb-4">
                            Membership plans help increase customer retention by 60% and provide predictable recurring revenue.
                            Regular members spend 40% more than walk-in customers.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm">Increased Customer Loyalty</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm">Predictable Monthly Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm">Better Customer Data</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm">Higher Lifetime Value</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}