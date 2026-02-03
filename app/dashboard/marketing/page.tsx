// "use client";

// import { useState } from "react";
// import {
//     Megaphone,
//     Send,
//     Users,
//     Calendar,
//     MessageSquare,
//     Mail,
//     BarChart3,
//     Plus
// } from "lucide-react";

// export default function MarketingPage() {
//     const [campaignType, setCampaignType] = useState("sms");

//     return (
//         <div className="space-y-8 pb-10">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campaign Creator</h1>
//                     <p className="mt-1 text-sm text-slate-600 font-medium uppercase tracking-wider">Reach your customers with personalized offers</p>
//                 </div>
//                 <button className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-all flex items-center gap-2">
//                     <Plus className="w-5 h-5" />
//                     NEW CAMPAIGN
//                 </button>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-4">
//                     <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
//                         <Users className="w-6 h-6 text-indigo-600" />
//                     </div>
//                     <div>
//                         <div className="text-2xl font-black text-slate-900">1,240</div>
//                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reach Potential</div>
//                     </div>
//                 </div>
//                 <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-4">
//                     <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
//                         <Send className="w-6 h-6 text-emerald-600" />
//                     </div>
//                     <div>
//                         <div className="text-2xl font-black text-slate-900">85%</div>
//                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Open Rate</div>
//                     </div>
//                 </div>
//                 <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-4">
//                     <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center">
//                         <BarChart3 className="w-6 h-6 text-violet-600" />
//                     </div>
//                     <div>
//                         <div className="text-2xl font-black text-slate-900">₹12.4k</div>
//                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign Revenue</div>
//                     </div>
//                 </div>
//             </div>

//             {/* Campaign Builder (Draft) */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div className="bg-white rounded-[40px] border-2 border-slate-100 p-8 shadow-sm space-y-6">
//                     <h3 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4 uppercase tracking-tight">Step 1: Build Message</h3>

//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => setCampaignType("sms")}
//                             className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${campaignType === 'sms' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50 hover:border-slate-200'}`}
//                         >
//                             <MessageSquare className={`w-6 h-6 ${campaignType === 'sms' ? 'text-indigo-600' : 'text-slate-400'}`} />
//                             <span className={`text-[10px] font-black uppercase ${campaignType === 'sms' ? 'text-indigo-600' : 'text-slate-400'}`}>SMS</span>
//                         </button>
//                         <button
//                             onClick={() => setCampaignType("whatsapp")}
//                             className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${campaignType === 'whatsapp' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-50 hover:border-slate-200'}`}
//                         >
//                             <Send className={`w-6 h-6 ${campaignType === 'whatsapp' ? 'text-emerald-600' : 'text-slate-400'}`} />
//                             <span className={`text-[10px] font-black uppercase ${campaignType === 'whatsapp' ? 'text-emerald-600' : 'text-slate-400'}`}>WhatsApp</span>
//                         </button>
//                         <button
//                             onClick={() => setCampaignType("email")}
//                             className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${campaignType === 'email' ? 'border-violet-600 bg-violet-50' : 'border-slate-50 hover:border-slate-200'}`}
//                         >
//                             <Mail className={`w-6 h-6 ${campaignType === 'email' ? 'text-violet-600' : 'text-slate-400'}`} />
//                             <span className={`text-[10px] font-black uppercase ${campaignType === 'email' ? 'text-violet-600' : 'text-slate-400'}`}>Email</span>
//                         </button>
//                     </div>

//                     <div className="space-y-4 pt-4">
//                         <div>
//                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Campaign Name</label>
//                             <input type="text" placeholder="e.g. New Year Special Discount" className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all" />
//                         </div>
//                         <div>
//                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Message Content</label>
//                             <textarea rows={4} placeholder="Hi [Name], get 20% off on all services this week! Use code NY2024." className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all" />
//                             <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Credits: 1 SMS (130 chars left)</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
//                     <div className="absolute top-0 right-0 p-8 opacity-10">
//                         <Megaphone className="w-48 h-48 -rotate-12" />
//                     </div>
//                     <div className="relative z-10 h-full flex flex-col justify-between">
//                         <div>
//                             <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Campaign Preview</h3>
//                             <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
//                                 <div className="flex items-center gap-3 mb-4">
//                                     <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-sm font-black">TSG</div>
//                                     <div>
//                                         <div className="font-black text-xs">TrimSetGo (via {campaignType.toUpperCase()})</div>
//                                         <div className="text-[8px] text-white/50 font-bold uppercase">Today • 10:30 AM</div>
//                                     </div>
//                                 </div>
//                                 <div className="text-xs font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
//                                     Hi Sameer, get 20% off on all services this week! Use code NY2024. Tap here to book: trimsetgo.live/salon
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="pt-8 flex flex-col gap-4">
//                             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
//                                 <span>Estimated Cost</span>
//                                 <span>₹0.25 / Message</span>
//                             </div>
//                             <button className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-widest">
//                                 LAUNCH CAMPAIGN
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import {
    Megaphone,
    Send,
    Users,
    Calendar,
    MessageSquare,
    Mail,
    BarChart3,
    Plus,
    Target,
    ArrowRight,
    Bell,
    Smartphone,
    MailOpen
} from "lucide-react";

export default function MarketingPage() {
    const [campaignType, setCampaignType] = useState("sms");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Campaign Creator</h1>
                <p className="mt-1 text-sm text-slate-600">
                    {/* Reach your customers with personalized offers for {salon?.name || "your salon"} */}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-slate-900">1,240</div>
                        <div className="text-xs text-slate-500">Reach Potential</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Send className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-slate-900">85%</div>
                        <div className="text-xs text-slate-500">Avg. Open Rate</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-slate-900">₹12.4k</div>
                        <div className="text-xs text-slate-500">Campaign Revenue</div>
                    </div>
                </div>
            </div>

            {/* Campaign Builder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Message Builder */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Megaphone className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Build Message</h3>
                            <p className="text-xs text-slate-500">Create and customize your campaign message</p>
                        </div>
                    </div>

                    {/* Campaign Type Selector */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">Campaign Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setCampaignType("sms")}
                                className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${campaignType === 'sms' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:border-purple-300'}`}
                            >
                                <MessageSquare className={`w-4 h-4 ${campaignType === 'sms' ? 'text-purple-600' : 'text-slate-400'}`} />
                                <span className={`text-xs font-medium ${campaignType === 'sms' ? 'text-purple-700' : 'text-slate-600'}`}>SMS</span>
                            </button>
                            <button
                                onClick={() => setCampaignType("whatsapp")}
                                className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${campaignType === 'whatsapp' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-emerald-300'}`}
                            >
                                <Send className={`w-4 h-4 ${campaignType === 'whatsapp' ? 'text-emerald-600' : 'text-slate-400'}`} />
                                <span className={`text-xs font-medium ${campaignType === 'whatsapp' ? 'text-emerald-700' : 'text-slate-600'}`}>WhatsApp</span>
                            </button>
                            <button
                                onClick={() => setCampaignType("email")}
                                className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${campaignType === 'email' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300'}`}
                            >
                                <Mail className={`w-4 h-4 ${campaignType === 'email' ? 'text-blue-600' : 'text-slate-400'}`} />
                                <span className={`text-xs font-medium ${campaignType === 'email' ? 'text-blue-700' : 'text-slate-600'}`}>Email</span>
                            </button>
                        </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-2">Campaign Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. New Year Special Discount" 
                                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-sm"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-2">Message Content</label>
                            <textarea 
                                rows={4} 
                                placeholder="Hi [Name], get 20% off on all services this week! Use code NY2024." 
                                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-sm resize-none"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Characters: <span className="font-medium">130 left</span> • 1 SMS credit
                            </p>
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all">
                        <Plus className="w-4 h-4" />
                        Create Campaign
                    </button>
                </div>

                {/* Right Column - Preview */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5 text-white">
                    <div className="h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Campaign Preview</h3>
                                    <p className="text-xs text-slate-300">See how your message will appear to customers</p>
                                </div>
                            </div>

                            {/* Message Preview */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-xs font-semibold">
                                        TSG
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold">TrimSetGo Salon</div>
                                        <div className="text-[10px] text-white/50">via {campaignType.toUpperCase()} • Just now</div>
                                    </div>
                                </div>
                                
                                <div className="text-sm leading-relaxed bg-white/5 p-3 rounded border border-white/5">
                                    Hi Sameer, get 20% off on all services this week! Use code NY2024. Tap here to book: trimsetgo.live/salon
                                </div>
                            </div>
                        </div>

                        {/* Campaign Details */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-xs text-white/60">
                                    <span>Estimated Cost</span>
                                    <span className="font-medium">₹0.25 / message</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-white/60">
                                    <span>Delivery Channel</span>
                                    <span className="font-medium capitalize">{campaignType}</span>
                                </div>
                            </div>
                            
                            <button className="w-full py-2.5 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors text-sm flex items-center justify-center gap-1.5">
                                Launch Campaign
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign Templates */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MailOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Quick Templates</h3>
                            <p className="text-xs text-slate-500">Pre-designed messages for common scenarios</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                        {
                            title: "Birthday Offer",
                            description: "Send special birthday discounts",
                            icon: Bell,
                            color: "purple"
                        },
                        {
                            title: "Service Reminder",
                            description: "Remind customers of upcoming appointments",
                            icon: Calendar,
                            color: "emerald"
                        },
                        {
                            title: "New Service Launch",
                            description: "Announce new services or products",
                            icon: Megaphone,
                            color: "blue"
                        }
                    ].map((template, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 bg-${template.color}-100 rounded-lg flex items-center justify-center`}>
                                    <template.icon className={`w-5 h-5 text-${template.color}-600`} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-slate-900">{template.title}</h4>
                                    <p className="text-xs text-slate-500">{template.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-blue-900 mb-1">Marketing Best Practices</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Personalize messages with customer names for higher engagement</li>
                            <li>• Send promotional offers during non-peak hours for better visibility</li>
                            <li>• Keep messages concise and include clear call-to-action</li>
                            <li>• Track campaign performance to optimize future messages</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}