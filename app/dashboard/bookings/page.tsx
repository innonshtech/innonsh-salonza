"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Clock, 
  User,
  Phone,
  Mail,
  Scissors,
  Filter,
  Search,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download
} from "lucide-react";

interface Booking {
  _id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
  time?: string;
  serviceId: string;
  serviceName?: string;
  status?: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
}

export default function BookingsPage() {
  const [salon, setSalon] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    const saved = localStorage.getItem("salon");
    if (saved) {
      const s = JSON.parse(saved);
      setSalon(s);
      loadBookings(s._id);
    }
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, dateFilter, bookings]);

  async function loadBookings(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/list?id=${id}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  function filterBookings() {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerPhone?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === "today") {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime();
      });
    } else if (dateFilter === "upcoming") {
      filtered = filtered.filter(booking => new Date(booking.date) >= today);
    } else if (dateFilter === "past") {
      filtered = filtered.filter(booking => new Date(booking.date) < today);
    }

    setFilteredBookings(filtered);
  }

  function getStatusColor(status?: string) {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  function getStatusIcon(status?: string) {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function groupBookingsByDate() {
    const groups: { [key: string]: Booking[] } = {};
    
    filteredBookings.forEach(booking => {
      const dateKey = formatDate(booking.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(booking);
    });

    // Sort bookings within each date by time
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    return groups;
  }

  const groupedBookings = groupBookingsByDate();
  const totalBookings = bookings.length;
  const todayBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString();
  }).length;

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

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
        <p className="mt-2 text-slate-600">Manage all your customer appointments</p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Today's Bookings</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{todayBookings}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Filtered Results</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{filteredBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Search Customer
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Name, email or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {dateFilter === 'today' ? "Today's Appointments" : 
             dateFilter === 'upcoming' ? "Upcoming Appointments" :
             dateFilter === 'past' ? "Past Appointments" : "All Appointments"}
          </h2>
          <button className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookings found</h3>
            <p className="text-slate-600">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'No bookings have been made yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBookings).map(([date, dateBookings]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{date}</h3>
                    <p className="text-sm text-slate-600">{dateBookings.length} appointments</p>
                  </div>
                </div>

                {/* Bookings for this date */}
                <div className="space-y-3 ml-15">
                  {dateBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-purple-200 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Time */}
                        <div className="flex-shrink-0 text-center">
                          <div className="text-lg font-bold text-slate-900">
                            {formatTime(booking.date)}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-12 w-px bg-slate-300"></div>

                        {/* Customer Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="w-4 h-4 text-slate-600" />
                            <span className="font-semibold text-slate-900">{booking.customerName}</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                            {booking.customerPhone && (
                              <span className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{booking.customerPhone}</span>
                              </span>
                            )}
                            {booking.customerEmail && (
                              <span className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{booking.customerEmail}</span>
                              </span>
                            )}
                            {booking.serviceName && (
                              <span className="flex items-center space-x-1">
                                <Scissors className="w-3 h-3" />
                                <span>{booking.serviceName}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status || 'pending'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}