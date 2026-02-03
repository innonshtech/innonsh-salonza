// "use client";

// import { useState } from "react";
// import {
//     Star,
//     MessageCircle,
//     Filter,
//     Search,
//     TrendingUp,
//     AlertCircle
// } from "lucide-react";

// export default function FeedbackPage() {
//     return (
//         <div className="space-y-8 pb-10">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Feedback</h1>
//                     <p className="mt-1 text-sm text-slate-600 font-medium uppercase tracking-wider">Analyze customer satisfaction and reviews</p>
//                 </div>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
//                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Rating</div>
//                     <div className="flex items-center gap-2">
//                         <div className="text-3xl font-black text-slate-900">4.8</div>
//                         <div className="flex text-amber-500">
//                             {[1, 2, 3, 4].map(i => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
//                             <Star className="w-4 h-4 fill-amber-200 text-amber-200" />
//                         </div>
//                     </div>
//                 </div>
//                 {/* ... other stats ... */}
//                 <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
//                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Reviews</div>
//                     <div className="text-3xl font-black text-slate-900">142</div>
//                 </div>
//                 <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
//                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Positive</div>
//                     <div className="text-3xl font-black text-emerald-600">92%</div>
//                 </div>
//                 <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
//                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Negative</div>
//                     <div className="text-3xl font-black text-red-600">8%</div>
//                 </div>
//             </div>

//             {/* Reviews List */}
//             <div className="bg-white rounded-[40px] border-2 border-slate-100 shadow-sm overflow-hidden">
//                 <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
//                     <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
//                         <MessageCircle className="w-5 h-5 text-indigo-600" />
//                         LATEST REVIEWS
//                     </h3>
//                     <div className="flex gap-2">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                             <input type="text" placeholder="Search comments..." className="pl-10 pr-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:border-indigo-500 outline-none transition-all" />
//                         </div>
//                         <button className="p-2 border-2 border-slate-100 rounded-xl text-slate-400 hover:border-slate-300 transition-all">
//                             <Filter className="w-5 h-5" />
//                         </button>
//                     </div>
//                 </div>

//                 <div className="divide-y divide-slate-100">
//                     {[1, 2, 3].map(i => (
//                         <div key={i} className="p-6 hover:bg-slate-50/50 transition-colors">
//                             <div className="flex justify-between items-start mb-4">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">J</div>
//                                     <div>
//                                         <div className="font-black text-slate-900 uppercase tracking-tight text-sm">John Doe</div>
//                                         <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Haircut • 2 hours ago</div>
//                                     </div>
//                                 </div>
//                                 <div className="flex gap-0.5">
//                                     {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-amber-500 text-amber-500" />)}
//                                 </div>
//                             </div>
//                             <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
//                                 "Amazing service! The stylist really understood what I wanted. Definitely coming back."
//                             </p>
//                             <div className="mt-4 flex gap-2">
//                                 <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-md">Positive</span>
//                                 <span className="px-2 py-1 bg-slate-50 text-slate-400 text-[8px] font-black uppercase rounded-md border border-slate-100">Verified Visit</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }
"use client";

import { useState, useEffect } from "react";
import {
    Star,
    MessageCircle,
    Filter,
    Search,
    TrendingUp,
    AlertCircle,
    ThumbsUp,
    ThumbsDown,
    User,
    Calendar,
    Loader2,
    PieChart,
    TrendingDown
} from "lucide-react";

export default function FeedbackPage() {
    const [salon, setSalon] = useState<any>(null);
    const [reviews, setReviews] = useState([
        {
            id: 1,
            customerName: "John Doe",
            service: "Haircut & Styling",
            timeAgo: "2 hours ago",
            rating: 5,
            comment: "Amazing service! The stylist really understood what I wanted. Definitely coming back.",
            sentiment: "positive",
            verified: true
        },
        {
            id: 2,
            customerName: "Sarah Johnson",
            service: "Hair Coloring",
            timeAgo: "1 day ago",
            rating: 4,
            comment: "Good coloring service. The color came out nice, but the wait time was a bit longer than expected.",
            sentiment: "positive",
            verified: true
        },
        {
            id: 3,
            customerName: "Mike Wilson",
            service: "Beard Trim",
            timeAgo: "3 days ago",
            rating: 2,
            comment: "Stylist seemed rushed and didn't pay attention to details. Expected better for the price.",
            sentiment: "negative",
            verified: false
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("salon");
        if (saved) {
            const s = JSON.parse(saved);
            setSalon(s);
            // You can fetch reviews here if you have an API
            // fetchReviews(s._id);
        }
        setLoading(false);
    }, []);

    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             review.comment.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "all" || review.sentiment === filter;
        return matchesSearch && matchesFilter;
    });

    const totalReviews = reviews.length;
    const positiveReviews = reviews.filter(r => r.sentiment === "positive").length;
    const averageRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : "0.0";
    const negativeReviews = totalReviews - positiveReviews;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-3 border-purple-200 border-t-purple-600 mx-auto"></div>
                    <p className="mt-3 text-slate-600 font-medium">Loading Feedback...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Customer Feedback</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Analyze customer satisfaction and reviews for {salon?.name || "your salon"}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs font-medium text-slate-500 mb-1">Avg. Rating</div>
                            <div className="text-lg font-semibold text-slate-900">{averageRating}</div>
                        </div>
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4].map(i => (
                                <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                            ))}
                            <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="text-xs font-medium text-slate-500 mb-1">Total Reviews</div>
                    <div className="text-lg font-semibold text-slate-900">{totalReviews}</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs font-medium text-slate-500 mb-1">Positive</div>
                            <div className="text-lg font-semibold text-emerald-600">
                                {totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0}%
                            </div>
                        </div>
                        <ThumbsUp className="w-4 h-4 text-emerald-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs font-medium text-slate-500 mb-1">Negative</div>
                            <div className="text-lg font-semibold text-red-600">
                                {totalReviews > 0 ? Math.round((negativeReviews / totalReviews) * 100) : 0}%
                            </div>
                        </div>
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none font-medium text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-initial">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm font-medium"
                        >
                            <option value="all">All Reviews</option>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                        </select>
                    </div>
                    <button className="p-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold text-slate-900">Latest Reviews</h3>
                        </div>
                        <span className="text-sm text-slate-500">{filteredReviews.length} reviews</span>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {filteredReviews.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageCircle className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-1">No reviews found</h3>
                            <p className="text-slate-600 text-sm">Try adjusting your search or filter</p>
                        </div>
                    ) : (
                        filteredReviews.map((review) => (
                            <div key={review.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 font-semibold text-sm">
                                            {review.customerName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 text-sm">{review.customerName}</div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                                <span>{review.service}</span>
                                                <span>•</span>
                                                <span>{review.timeAgo}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-amber-200 fill-amber-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                
                                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                    "{review.comment}"
                                </p>
                                
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${review.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                        {review.sentiment === 'positive' ? (
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp className="w-3 h-3" />
                                                Positive
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <ThumbsDown className="w-3 h-3" />
                                                Negative
                                            </div>
                                        )}
                                    </span>
                                    {review.verified && (
                                        <span className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-xs font-medium border border-slate-200">
                                            Verified Visit
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <PieChart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Rating Distribution</h3>
                        <p className="text-xs text-slate-500">Breakdown of customer ratings</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => r.rating === rating).length;
                        const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                        
                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-12">
                                    <span className="text-sm font-medium text-slate-600">{rating}</span>
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                </div>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="text-sm font-medium text-slate-900 w-12 text-right">
                                    {percentage}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-blue-900 mb-1">Feedback Insights</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Respond to negative reviews within 24 hours to show you care</li>
                            <li>• Use positive feedback in your marketing materials (with permission)</li>
                            <li>• Track common themes in feedback to improve services</li>
                            <li>• Encourage happy customers to leave reviews for social proof</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5 text-white">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Customer Satisfaction</h3>
                        <p className="text-slate-300 text-sm mb-4">
                            Your salon maintains a {averageRating} star rating from {totalReviews} verified reviews. 
                            This puts you in the top 20% of salons in your area for customer satisfaction.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <div className="text-xs text-white/60 mb-1">Response Rate</div>
                                <div className="text-lg font-semibold">85%</div>
                            </div>
                            <div className="bg-white/10 p-3 rounded-lg">
                                <div className="text-xs text-white/60 mb-1">Improvement</div>
                                <div className="text-lg font-semibold text-emerald-400">+12%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}