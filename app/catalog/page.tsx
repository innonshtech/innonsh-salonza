"use client";

import { useState, useEffect } from "react";
import { Scissors, Star, Clock, MapPin, Phone } from "lucide-react";

export default function PublicCatalog() {
    const [salon, setSalon] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        // Mocking for now, in real case this would fetch by ID in URL
        const saved = localStorage.getItem("salon");
        if (saved) setSalon(JSON.parse(saved));
        fetchServices();
    }, []);

    const fetchServices = async () => {
        // mock fetch
        setServices([
            { name: "Haircut", price: 500, duration: "30 mins", description: "Premium style haircut with wash" },
            { name: "Hair Color", price: 2500, duration: "90 mins", description: "L'Oreal Professional Color" },
            { name: "Facial", price: 1200, duration: "45 mins", description: "Deep cleansing facial" }
        ]);
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Salon Hero */}
            <div className="h-64 bg-slate-900 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h1 className="text-4xl font-black uppercase tracking-tight">{salon?.name || 'Luxury Salon'}</h1>
                    <div className="flex items-center gap-4 mt-2 text-sm font-bold text-white/70">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            4.9 (120 Reviews)
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            Open • Closes at 9PM
                        </div>
                    </div>
                </div>
            </div>

            {/* Catalog */}
            <div className="max-w-4xl mx-auto p-8 space-y-12">
                <div className="text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Scissors className="w-8 h-8 text-slate-900" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900">Service Menu</h2>
                    <div className="w-12 h-1.5 bg-slate-900 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="space-y-8">
                    {services.map(s => (
                        <div key={s.name} className="flex justify-between items-start group">
                            <div className="flex-1">
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{s.name}</h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">{s.description}</p>
                                <div className="text-[10px] font-black text-slate-300 uppercase mt-2">{s.duration}</div>
                            </div>
                            <div className="text-xl font-black text-slate-900">₹{s.price}</div>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="pt-20 border-t border-slate-100 grid grid-cols-2 gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</div>
                            <div className="text-sm font-bold text-slate-900 truncate">123 Beauty Lane, City</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                            <Phone className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</div>
                            <div className="text-sm font-bold text-slate-900">+91 98765 43210</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
