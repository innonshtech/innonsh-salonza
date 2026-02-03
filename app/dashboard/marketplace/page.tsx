// "use client";

// import { useEffect, useState } from "react";
// import {
//     ShoppingBag,
//     Search,
//     Truck,
//     Star,
//     Filter,
//     Package,
//     ArrowRight,
//     Info
// } from "lucide-react";

// export default function MarketplacePage() {
//     const [products, setProducts] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState("");

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     async function fetchProducts() {
//         setLoading(true);
//         try {
//             const res = await fetch(`/api/marketplace/list`);
//             const data = await res.json();
//             if (data.success) {
//                 setProducts(data.products);
//             }
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="space-y-8 pb-10">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-3xl font-black text-slate-900 tracking-tight">Supplies Marketplace</h1>
//                     <p className="mt-1 text-sm text-slate-600 font-medium uppercase tracking-wider">Order professional products directly from certified suppliers</p>
//                 </div>
//                 <button className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all active:scale-95">
//                     <Truck className="w-5 h-5 text-indigo-600" />
//                     MY ORDERS
//                 </button>
//             </div>

//             {/* Banner */}
//             <div className="bg-gradient-to-br from-indigo-600 top to-blue-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
//                 <div className="absolute top-0 right-0 p-8 opacity-10">
//                     <ShoppingBag className="w-48 h-48 -rotate-12" />
//                 </div>
//                 <div className="relative z-10 max-w-lg">
//                     <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 backdrop-blur-md">
//                         New Arrivals
//                     </div>
//                     <h2 className="text-4xl font-black mb-4 leading-tight">Professional Salon Equipments & Kits</h2>
//                     <p className="text-blue-100 font-medium mb-6">Exclusive B2B pricing for registered salons. Bulk discounts available on hair care kits.</p>
//                     <button className="bg-white text-indigo-700 px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-lg flex items-center gap-2">
//                         EXPLORE KITS
//                         <ArrowRight className="w-5 h-5" />
//                     </button>
//                 </div>
//             </div>

//             {/* Toolbar */}
//             <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="relative flex-1">
//                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                     <input
//                         type="text"
//                         placeholder="Search for shampoos, kits, dryers, etc..."
//                         className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-medium transition-all shadow-sm"
//                     />
//                 </div>
//                 <button className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-600 font-black flex items-center gap-2 shadow-sm hover:border-slate-300">
//                     <Filter className="w-5 h-5" />
//                     FILTERS
//                 </button>
//             </div>

//             {/* Product Grid */}
//             {loading ? (
//                 <div className="py-32 flex justify-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
//                 </div>
//             ) : products.length === 0 ? (
//                 <div className="py-32 text-center opacity-30">
//                     <Package className="w-20 h-20 mx-auto mb-4" />
//                     <p className="text-xl font-black uppercase tracking-widest">No supplies found</p>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     {products.map(p => (
//                         <div key={p._id} className="bg-white rounded-3xl border-2 border-slate-100 p-4 shadow-sm hover:border-indigo-300 transition-all group">
//                             <div className="aspect-square bg-slate-50 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center text-slate-300">
//                                 {p.image ? (
//                                     <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
//                                 ) : (
//                                     <Package className="w-12 h-12" />
//                                 )}
//                                 <div className="absolute top-2 left-2 flex flex-col gap-1">
//                                     <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-[8px] font-black uppercase text-indigo-600 border border-indigo-100">
//                                         {p.category}
//                                     </span>
//                                 </div>
//                             </div>

//                             <div className="mb-4">
//                                 <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{p.brand || 'Professional'}</div>
//                                 <h3 className="font-black text-slate-900 leading-tight mb-2 uppercase tracking-tight">{p.name}</h3>
//                                 <div className="flex items-center gap-4">
//                                     <div className="text-xl font-black text-indigo-600">₹{p.businessPrice || p.price}</div>
//                                     {p.businessPrice && (
//                                         <div className="text-xs text-slate-400 line-through font-bold">₹{p.price}</div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
//                                 <div className="flex items-center gap-1">
//                                     <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
//                                     <span className="text-[10px] font-black text-slate-700">4.8</span>
//                                 </div>
//                                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
//                                     ORDER NOW
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import {
    ShoppingBag,
    Search,
    Truck,
    Star,
    Filter,
    Package,
    ArrowRight,
    Info,
    Tag,
    CheckCircle,
    Loader2,
    Box,
    TrendingUp,
    Percent
} from "lucide-react";

export default function MarketplacePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        setLoading(true);
        try {
            const res = await fetch(`/api/marketplace/list`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Supplies Marketplace</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Order professional products directly from certified suppliers
                </p>
            </div>

            {/* Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <ShoppingBag className="w-32 h-32 -rotate-12" />
                </div>
                <div className="relative z-10 max-w-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-medium uppercase backdrop-blur-sm">
                            B2B Exclusive
                        </div>
                        <CheckCircle className="w-3 h-3 text-white/80" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Professional Salon Supplies</h2>
                    <p className="text-purple-100 text-sm mb-4">
                        Exclusive wholesale pricing for registered salons. Bulk discounts available.
                    </p>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-purple-700 font-medium rounded-lg hover:bg-slate-100 transition-colors text-sm">
                        Explore Products
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-initial">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm font-medium"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === "all" ? "All Categories" : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm">
                        <Truck className="w-4 h-4" />
                        My Orders
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Box className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-slate-900">{products.length}</div>
                        <div className="text-xs text-slate-500">Available Products</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Percent className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-slate-900">20-40%</div>
                        <div className="text-xs text-slate-500">B2B Discount</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-slate-900">4.8</div>
                        <div className="text-xs text-slate-500">Avg. Rating</div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Available Products</h3>
                    <span className="text-sm text-slate-500">{filteredProducts.length} products</span>
                </div>

                {loading ? (
                    <div className="py-16 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                        <p className="text-slate-600 font-medium">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Package className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No products found</h3>
                        <p className="text-slate-600 text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(p => (
                            <div key={p._id} className="bg-white rounded-lg border border-slate-200 p-3 hover:border-purple-300 transition-colors group">
                                {/* Product Image */}
                                <div className="aspect-square bg-slate-50 rounded-lg mb-3 relative overflow-hidden flex items-center justify-center">
                                    {p.image ? (
                                        <img 
                                            src={p.image} 
                                            alt={p.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <Package className="w-10 h-10 text-slate-300" />
                                    )}
                                    {p.businessPrice && p.businessPrice < p.price && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-medium">
                                            {Math.round((1 - p.businessPrice / p.price) * 100)}% OFF
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">{p.brand || 'Professional'}</span>
                                        <div className="flex items-center gap-0.5">
                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-medium text-slate-700">4.8</span>
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-medium text-slate-900 text-sm leading-tight line-clamp-2">{p.name}</h3>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-900">₹{p.businessPrice || p.price}</span>
                                        {p.businessPrice && p.businessPrice < p.price && (
                                            <span className="text-xs text-slate-400 line-through">₹{p.price}</span>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs text-slate-500">{p.category}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors text-sm">
                                    Order Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Info className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-blue-900 mb-1">Marketplace Benefits</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Exclusive wholesale pricing for registered salon businesses</li>
                            <li>• Bulk order discounts and free shipping on large orders</li>
                            <li>• Certified professional-grade products from trusted brands</li>
                            <li>• Fast delivery with order tracking and customer support</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Supplier Info */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5 text-white">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Trusted Suppliers</h3>
                        <p className="text-slate-300 text-sm mb-3">
                            All products are sourced from certified suppliers with proven track records. 
                            Quality assurance and professional-grade standards guaranteed.
                        </p>
                        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors text-sm">
                            View Supplier Certificates
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}