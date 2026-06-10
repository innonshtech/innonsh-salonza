"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Banknote, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Filter,
  BarChart3,
  Download,
  Armchair,
  CheckCircle2,
  ArrowRight,
  Receipt,
  Search,
  DollarSign,
  Loader2
} from "lucide-react";

export default function CollectionsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [salon, setSalon] = useState<any>(null);
  const [type, setType] = useState("daily"); // daily, monthly, quarterly, yearly
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("salon");
    if (saved) {
      setSalon(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (salon) {
      fetchRevenue();
    }
  }, [salon, type, date]);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics/revenue?type=${type}&date=${date}`);
      const data = await res.json();
      if (data.success) {
        setStats(data);
      } else {
        showToast(data.message, "error");
        setStats({ staffWise: [], totalRevenue: 0, totalCash: 0, totalOnline: 0, totalCustomers: 0 });
      }
    } catch (error) {
      showToast("Failed to fetch analytics", "error");
      setStats({ staffWise: [], totalRevenue: 0, totalCash: 0, totalOnline: 0, totalCustomers: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
      return (
          <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-3 border-purple-200 border-t-purple-600 mx-auto"></div>
                  <p className="mt-3 text-slate-600 font-medium">Calculating Collections...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Daily Collection</h1>
          <p className="mt-1 text-sm text-slate-600">
            Analytics and earnings for {type === 'daily' ? 'today' : `the ${type} period`} at {salon?.name} for {salon?.name || "your salon"}
          </p>
        </div>
        
        {/* Filters - Simple Logic */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="text-xs font-bold text-slate-600 bg-transparent outline-none px-2 py-1 cursor-pointer uppercase"
            >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
            </select>
            <div className="w-[1px] h-4 bg-slate-200" />
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="text-xs font-bold text-slate-600 bg-transparent outline-none px-2 py-1"
            />
            <button 
                onClick={fetchRevenue}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
                <Download className="w-3.5 h-3.5 text-slate-400" />
            </button>
        </div>
      </div>

      {/* Date Display */}
      <div className="flex items-center justify-between">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">
                  {new Date(stats?.range?.start || Date.now()).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
          </div>
      </div>

      {/* Top Stats Cards - Original Simple Gradient Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-lg text-white shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                      <span className="text-xs font-medium uppercase tracking-wide opacity-90">Total Revenue</span>
                      <div className="text-xl font-semibold mt-0.5">₹{stats?.totalRevenue || 0}</div>
                  </div>
              </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4 rounded-lg text-white shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                      <span className="text-xs font-medium uppercase tracking-wide opacity-90">Cash Earning</span>
                      <div className="text-xl font-semibold mt-0.5">₹{stats?.totalCash || 0}</div>
                  </div>
              </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                      <span className="text-xs font-medium uppercase tracking-wide opacity-90">Online Earning</span>
                      <div className="text-xl font-semibold mt-0.5">₹{stats?.totalOnline || 0}</div>
                  </div>
              </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-lg text-white shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5" />
                  </div>
                  <div>
                      <span className="text-xs font-medium uppercase tracking-wide opacity-90">Total Customers</span>
                      <div className="text-xl font-semibold mt-0.5">{stats?.totalCustomers || 0}</div>
                  </div>
              </div>
          </div>
      </div>

      {/* Staff Breakdown - Original Simple Cards */}
      <div className="space-y-4">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Armchair className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Staff Productivity</h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Collection breakdown by staff member</p>
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats?.staffWise?.map((s: any, idx: number) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 font-semibold text-lg">
                                  {s.staffName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                  <h3 className="font-semibold text-slate-900">{s.staffName}</h3>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{s.staffRole || 'Professional'}</p>
                              </div>
                          </div>
                          {s.active !== false && (
                            <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-100">
                                ACTIVE
                            </div>
                          )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-50 p-3 rounded border border-slate-200">
                              <p className="text-[9px] font-bold text-slate-500 uppercase mb-1 tracking-tighter">Collection</p>
                              <p className="text-lg font-semibold text-slate-900">₹{s.totalAmount}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded border border-slate-200">
                              <p className="text-[9px] font-bold text-slate-500 uppercase mb-1 tracking-tighter">Served</p>
                              <p className="text-lg font-semibold text-slate-900">{s.customerCount}</p>
                          </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                          <div className="flex items-center justify-between text-xs text-slate-500 hover:text-purple-600 transition-colors cursor-pointer group">
                              <span className="font-medium">View detailed services</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Recent Activity - Original Table Style */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Completed Services Today</h2>
              </div>
              <button className="text-xs font-semibold text-purple-600 hover:underline tracking-wide uppercase">
                  Export Report
              </button>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="bg-slate-50">
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Service</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mode</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Served By</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Amount</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {stats?.staffWise?.flatMap((s: any) => s.sales).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((sale: any, i: number) => {
                          const staff = stats.staffWise.find((sw: any) => sw.sales.some((sa: any) => sa._id === sale._id));
                          return (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-600 font-medium text-xs uppercase border border-slate-200">
                                            {sale.customerName.charAt(0)}
                                        </div>
                                        <span className="font-semibold text-slate-900 text-sm tracking-tight">{sale.customerName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {sale.serviceNames?.map((name: string, idx: number) => (
                                            <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold border border-purple-100">
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        {sale.paymentMethod === 'cash' && <Banknote className="w-3.5 h-3.5 text-emerald-500" />}
                                        {sale.paymentMethod === 'online' && <CreditCard className="w-3.5 h-3.5 text-blue-500" />}
                                        {sale.paymentMethod === 'split' && <Receipt className="w-3.5 h-3.5 text-amber-500" />}
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                            {sale.paymentMethod || 'cash'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-medium text-sm text-slate-600">
                                    {staff?.staffName || "Unassigned"}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-slate-900">₹{sale.finalAmount || sale.totalAmount}</span>
                                        {sale.discount?.amount > 0 && (
                                            <span className="text-[9px] text-red-500 font-black uppercase">-₹{sale.discount.amount} Disc</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                          );
                      })}
                      {(!stats || stats.totalCustomers === 0) && (
                          <tr>
                              <td colSpan={5} className="px-4 py-12 text-center">
                                  <div className="flex flex-col items-center gap-2 opacity-40">
                                      <TrendingUp className="w-8 h-8 text-slate-400" />
                                      <p className="text-sm font-semibold text-slate-500 tracking-tight">No transactions recorded yet</p>
                                  </div>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>

      {loading && stats && (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/10 opacity-90 backdrop-blur-sm">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Refreshing Data...</span>
            </div>
        </div>
      )}
    </div>
  );
}