import { supabase } from "@/lib/supabase";

export interface BookingDB {
  id: string;
  salon_id: string;
  branch_id?: string;
  customer_name: string;
  customer_phone?: string;
  total_duration?: number;
  total_price?: number;
  date: string;
  scheduled_at: string;
  is_walk_in?: boolean;
  status?: string;
  payment_status?: string;
  paid_amount?: number;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
}

export class BookingRepository {
  private static mapToModel(booking: any) {
    if (!booking) return null;
    
    // Extract services from booking_services join table
    const serviceIds: any[] = [];
    if (booking.booking_services && Array.isArray(booking.booking_services)) {
      booking.booking_services.forEach((bs: any) => {
        if (bs.services) {
          serviceIds.push({
            _id: bs.services.id,
            id: bs.services.id,
            name: bs.services.name,
            price: bs.services.price,
            duration: bs.services.duration,
            category: bs.services.category,
            description: bs.services.description,
            image: bs.services.image,
            isActive: bs.services.is_active
          });
        }
      });
    }

    const firstService = serviceIds.length > 0 ? serviceIds[0] : null;

    return {
      _id: booking.id,
      id: booking.id,
      salonId: booking.salon_id,
      branchId: booking.branch_id,
      customerName: booking.customer_name,
      customerPhone: booking.customer_phone || "",
      totalDuration: booking.total_duration || 0,
      totalPrice: booking.total_price || 0,
      date: booking.date,
      scheduledAt: booking.scheduled_at,
      isWalkIn: booking.is_walk_in !== undefined ? booking.is_walk_in : false,
      status: booking.status || "upcoming",
      paymentStatus: booking.payment_status || "pending",
      paidAmount: booking.paid_amount || 0,
      startedAt: booking.started_at,
      completedAt: booking.completed_at,
      createdAt: booking.created_at,
      serviceIds: serviceIds,
      serviceId: firstService, // Backward compatibility
      toObject: function() {
        return this;
      }
    };
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, booking_services(services(*))")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async findOne(query: { salonId?: string }) {
    let builder = supabase.from("bookings").select("*, booking_services(services(*))");
    if (query.salonId) {
      builder = builder.eq("salon_id", query.salonId);
    }
    
    // Sort by createdAt desc to match findOne behavior in some notification APIs
    const { data, error } = await builder.order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    return this.mapToModel(data);
  }

  static async find(query: any) {
    let builder = supabase.from("bookings").select("*, booking_services(services(*))");

    if (query.salonId) {
      builder = builder.eq("salon_id", query.salonId);
    }
    if (query.customerPhone) {
      builder = builder.eq("customer_phone", query.customerPhone);
    }
    if (query.status) {
      if (query.status.$in && Array.isArray(query.status.$in)) {
        builder = builder.in("status", query.status.$in);
      } else {
        builder = builder.eq("status", query.status);
      }
    }
    if (query.date) {
      if (query.date.$gte) {
        builder = builder.gte("date", new Date(query.date.$gte).toISOString());
      }
      if (query.date.$lt) {
        builder = builder.lt("date", new Date(query.date.$lt).toISOString());
      }
      if (query.date.$lte) {
        builder = builder.lte("date", new Date(query.date.$lte).toISOString());
      }
    }

    // Default sort by date ascending
    const { data, error } = await builder.order("date", { ascending: true });
    if (error) throw error;
    return data.map((b: any) => this.mapToModel(b));
  }

  static async create(bookingData: {
    salonId: string;
    branchId?: string;
    customerName: string;
    customerPhone?: string;
    totalDuration?: number;
    totalPrice?: number;
    date: Date;
    scheduledAt?: Date;
    isWalkIn?: boolean;
    status?: string;
    serviceId?: string; // Legacy field support
    serviceIds?: string[]; // Multiple services support
  }) {
    // 1. Insert booking record
    const dateStr = bookingData.date.toISOString();
    const schedStr = (bookingData.scheduledAt || bookingData.date).toISOString();

    const { data: booking, error: bError } = await supabase
      .from("bookings")
      .insert({
        salon_id: bookingData.salonId,
        branch_id: bookingData.branchId || null,
        customer_name: bookingData.customerName,
        customer_phone: bookingData.customerPhone || null,
        total_duration: bookingData.totalDuration || 0,
        total_price: bookingData.totalPrice || 0,
        date: dateStr,
        scheduled_at: schedStr,
        is_walk_in: bookingData.isWalkIn !== undefined ? bookingData.isWalkIn : false,
        status: bookingData.status || "upcoming",
        payment_status: "pending"
      })
      .select("*")
      .single();

    if (bError) throw bError;

    // 2. Populate serviceIds join table
    const serviceIdsToInsert = bookingData.serviceIds || [];
    if (bookingData.serviceId && !serviceIdsToInsert.includes(bookingData.serviceId)) {
      serviceIdsToInsert.push(bookingData.serviceId);
    }

    if (serviceIdsToInsert.length > 0) {
      const joinRows = serviceIdsToInsert.map(sid => ({
        booking_id: booking.id,
        service_id: sid
      }));

      const { error: jError } = await supabase
        .from("booking_services")
        .insert(joinRows);

      if (jError) throw jError;
    }

    // 3. Fetch completed populated booking
    return await this.findById(booking.id);
  }

  static async update(id: string, updates: Partial<BookingDB> & {
    salonId?: string;
    customerName?: string;
    customerPhone?: string;
    totalDuration?: number;
    totalPrice?: number;
    scheduledAt?: string | Date;
    isWalkIn?: boolean;
    paymentStatus?: string;
    paidAmount?: number;
    startedAt?: string | Date;
    completedAt?: string | Date;
  }) {
    const pgUpdates: any = {};
    if (updates.salon_id !== undefined) pgUpdates.salon_id = updates.salon_id;
    if (updates.salonId !== undefined) pgUpdates.salon_id = updates.salonId;
    if (updates.customerName !== undefined) pgUpdates.customer_name = updates.customerName;
    if (updates.customerPhone !== undefined) pgUpdates.customer_phone = updates.customerPhone;
    if (updates.totalDuration !== undefined) pgUpdates.total_duration = updates.totalDuration;
    if (updates.totalPrice !== undefined) pgUpdates.total_price = updates.totalPrice;
    if (updates.date !== undefined) pgUpdates.date = updates.date;
    if (updates.scheduled_at !== undefined) pgUpdates.scheduled_at = updates.scheduled_at;
    if (updates.scheduledAt !== undefined) pgUpdates.scheduled_at = (updates as any).scheduledAt;
    if (updates.isWalkIn !== undefined) pgUpdates.is_walk_in = updates.isWalkIn;
    if (updates.status !== undefined) pgUpdates.status = updates.status;
    if (updates.paymentStatus !== undefined) pgUpdates.payment_status = updates.paymentStatus;
    if (updates.paidAmount !== undefined) pgUpdates.paid_amount = updates.paidAmount;
    if (updates.startedAt !== undefined) pgUpdates.started_at = updates.startedAt instanceof Date ? updates.startedAt.toISOString() : updates.startedAt;
    if (updates.completedAt !== undefined) pgUpdates.completed_at = updates.completedAt instanceof Date ? updates.completedAt.toISOString() : updates.completedAt;

    const { data, error } = await supabase
      .from("bookings")
      .update(pgUpdates)
      .eq("id", id)
      .select("*, booking_services(services(*))")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async findByIdAndUpdate(id: string, updateObj: any, options?: { new: boolean }) {
    return this.update(id, updateObj);
  }

  static async delete(id: string) {
    const { data, error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id)
      .select("*, booking_services(services(*))")
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }
}
