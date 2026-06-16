import { supabase } from "@/lib/supabase";

export interface QueueItemDB {
  id: string;
  salon_id: string;
  branch_id?: string;
  customer_name: string;
  customer_phone?: string;
  scheduled_at?: string;
  is_walk_in?: boolean;
  booking_id?: string;
  position: number;
  status?: string;
  estimated_minutes?: number;
  staff_id?: string;
  created_at?: string;
}

export class QueueRepository {
  private static mapToModel(item: any) {
    if (!item) return null;

    // Extract services and serviceIds from queue_services join table
    const serviceIds: string[] = [];
    const services: { name: string; duration: number }[] = [];
    
    if (item.queue_services && Array.isArray(item.queue_services)) {
      item.queue_services.forEach((qs: any) => {
        if (qs.services) {
          serviceIds.push(qs.services.id);
          services.push({
            name: qs.services.name,
            duration: qs.services.duration
          });
        }
      });
    }

    const firstServiceId = serviceIds.length > 0 ? serviceIds[0] : null;

    return {
      _id: item.id,
      id: item.id,
      salonId: item.salon_id,
      branchId: item.branch_id,
      customerName: item.customer_name,
      customerPhone: item.customer_phone || "",
      scheduledAt: item.scheduled_at,
      isWalkIn: item.is_walk_in !== undefined ? item.is_walk_in : false,
      bookingId: item.booking_id,
      position: item.position,
      status: item.status || "waiting",
      estimatedMinutes: item.estimated_minutes || 0,
      staffId: item.staff_id,
      createdAt: item.created_at,
      serviceIds,
      services, // Array of name & duration
      serviceId: firstServiceId, // Backward compatibility
      toObject: function() {
        return this;
      }
    };
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("queue_items")
      .select("*, queue_services(services(*))")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async find(query: any) {
    let builder = supabase.from("queue_items").select("*, queue_services(services(*))");

    if (query.salonId) {
      builder = builder.eq("salon_id", query.salonId);
    }
    if (query.status) {
      builder = builder.eq("status", query.status);
    }

    // Default sort by position ascending
    const { data, error } = await builder.order("position", { ascending: true });
    if (error) throw error;
    return data.map((item: any) => this.mapToModel(item));
  }

  static async findOne(query: any) {
    let builder = supabase.from("queue_items").select("*, queue_services(services(*))");

    if (query.salonId) {
      builder = builder.eq("salon_id", query.salonId);
    }
    if (query.bookingId) {
      builder = builder.eq("booking_id", query.bookingId);
    }
    
    // Support sorting and limits if query has them
    let sortAsc = true;
    if (query.sort) {
      if (query.sort.position === -1) sortAsc = false;
    }
    builder = builder.order("position", { ascending: sortAsc });

    const { data, error } = await builder.limit(1).maybeSingle();
    if (error) throw error;
    return this.mapToModel(data);
  }

  static async create(itemData: {
    salonId: string;
    branchId?: string;
    customerName: string;
    customerPhone?: string;
    scheduledAt?: Date;
    isWalkIn?: boolean;
    bookingId?: string;
    position: number;
    estimatedMinutes?: number;
    staffId?: string;
    serviceIds?: string[];
    serviceId?: string; // Legacy
  }) {
    const schedStr = itemData.scheduledAt ? itemData.scheduledAt.toISOString() : null;

    const { data: item, error: iError } = await supabase
      .from("queue_items")
      .insert({
        salon_id: itemData.salonId,
        branch_id: itemData.branchId || null,
        customer_name: itemData.customerName,
        customer_phone: itemData.customerPhone || null,
        scheduled_at: schedStr,
        is_walk_in: itemData.isWalkIn !== undefined ? itemData.isWalkIn : false,
        booking_id: itemData.bookingId || null,
        position: itemData.position,
        status: "waiting",
        estimated_minutes: itemData.estimatedMinutes || 0,
        staff_id: itemData.staffId || null
      })
      .select("*")
      .single();

    if (iError) throw iError;

    const servicesToInsert = itemData.serviceIds || [];
    if (itemData.serviceId && !servicesToInsert.includes(itemData.serviceId)) {
      servicesToInsert.push(itemData.serviceId);
    }

    if (servicesToInsert.length > 0) {
      const joinRows = servicesToInsert.map(sid => ({
        queue_item_id: item.id,
        service_id: sid
      }));

      const { error: jError } = await supabase
        .from("queue_services")
        .insert(joinRows);

      if (jError) throw jError;
    }

    return await this.findById(item.id);
  }

  static async update(id: string, updates: Partial<QueueItemDB> & {
    salonId?: string;
    customerName?: string;
    customerPhone?: string;
    isWalkIn?: boolean;
    bookingId?: string;
    estimatedMinutes?: number;
    staffId?: string;
  }) {
    const pgUpdates: any = {};
    if (updates.salonId !== undefined) pgUpdates.salon_id = updates.salonId;
    if (updates.customerName !== undefined) pgUpdates.customer_name = updates.customerName;
    if (updates.customerPhone !== undefined) pgUpdates.customer_phone = updates.customerPhone;
    if (updates.isWalkIn !== undefined) pgUpdates.is_walk_in = updates.isWalkIn;
    if (updates.bookingId !== undefined) pgUpdates.booking_id = updates.bookingId;
    if (updates.position !== undefined) pgUpdates.position = updates.position;
    if (updates.status !== undefined) pgUpdates.status = updates.status;
    if (updates.estimatedMinutes !== undefined) pgUpdates.estimated_minutes = updates.estimatedMinutes;
    if (updates.staffId !== undefined) pgUpdates.staff_id = updates.staffId;

    const { data, error } = await supabase
      .from("queue_items")
      .update(pgUpdates)
      .eq("id", id)
      .select("*, queue_services(services(*))")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async findByIdAndUpdate(id: string, updateObj: any, options?: { new: boolean }) {
    return this.update(id, updateObj);
  }

  static async delete(id: string) {
    const { data, error } = await supabase
      .from("queue_items")
      .delete()
      .eq("id", id)
      .select("*, queue_services(services(*))")
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async deleteMany(query: { salonId: string }) {
    const { data, error } = await supabase
      .from("queue_items")
      .delete()
      .eq("salon_id", query.salonId)
      .select("id");

    if (error) throw error;
    return { deletedCount: data.length };
  }
}
