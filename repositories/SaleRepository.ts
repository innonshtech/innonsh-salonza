import { supabase } from "@/lib/supabase";

export interface SaleDB {
  id: string;
  salon_id: string;
  branch_id?: string;
  staff_id?: string;
  customer_name: string;
  customer_phone?: string;
  booking_id?: string;
  total_amount: number;
  discount_type?: string;
  discount_value?: number;
  discount_amount?: number;
  final_amount: number;
  payment_method?: string;
  payment_split_cash?: number;
  payment_split_online?: number;
  date?: string;
  created_at?: string;
}

export class SaleRepository {
  private static mapToModel(sale: any) {
    if (!sale) return null;

    // Extract services from sale_services join table
    const services: any[] = [];
    if (sale.sale_services && Array.isArray(sale.sale_services)) {
      sale.sale_services.forEach((ss: any) => {
        services.push({
          serviceId: ss.service_id,
          name: ss.name,
          price: ss.price
        });
      });
    }

    const firstService = services.length > 0 ? services[0] : null;

    return {
      _id: sale.id,
      id: sale.id,
      salonId: sale.salon_id,
      branchId: sale.branch_id,
      staffId: sale.staff_id,
      customerName: sale.customer_name,
      customerPhone: sale.customer_phone || "",
      bookingId: sale.booking_id,
      services,
      serviceId: firstService, // Legacy compatibility
      totalAmount: sale.total_amount,
      discount: {
        type: sale.discount_type || "none",
        value: sale.discount_value || 0,
        amount: sale.discount_amount || 0
      },
      finalAmount: sale.final_amount,
      paymentMethod: sale.payment_method || "cash",
      paymentSplit: {
        cash: sale.payment_split_cash || 0,
        online: sale.payment_split_online || 0
      },
      date: sale.date,
      createdAt: sale.created_at,
      toObject: function () {
        return this;
      }
    };
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("sales")
      .select("*, sale_services(*)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async find(query: any) {
    let builder = supabase.from("sales").select("*, sale_services(*)");

    if (query.salonId) {
      builder = builder.eq("salon_id", query.salonId);
    }
    if (query.date) {
      if (query.date.$gte) {
        builder = builder.gte("date", new Date(query.date.$gte).toISOString());
      }
      if (query.date.$lte) {
        builder = builder.lte("date", new Date(query.date.$lte).toISOString());
      }
      if (query.date.$lt) {
        builder = builder.lt("date", new Date(query.date.$lt).toISOString());
      }
    }

    const { data, error } = await builder.order("date", { ascending: false });
    if (error) throw error;
    return data.map(s => this.mapToModel(s));
  }

  static async create(saleData: {
    salonId: string;
    branchId?: string;
    staffId?: string;
    customerName: string;
    customerPhone?: string;
    bookingId?: string;
    services: { serviceId?: string; name: string; price: number }[];
    serviceId?: string; // Legacy
    totalAmount: number;
    discount?: { type: string; value: number; amount: number };
    finalAmount: number;
    paymentMethod?: string;
    paymentSplit?: { cash: number; online: number };
    date?: Date;
  }) {
    const saleDate = saleData.date ? saleData.date.toISOString() : new Date().toISOString();

    // 1. Insert base sale record
    const { data: sale, error: sError } = await supabase
      .from("sales")
      .insert({
        salon_id: saleData.salonId,
        branch_id: saleData.branchId || null,
        staff_id: saleData.staffId || null,
        customer_name: saleData.customerName,
        customer_phone: saleData.customerPhone || null,
        booking_id: saleData.bookingId || null,
        total_amount: saleData.totalAmount,
        discount_type: saleData.discount?.type || "none",
        discount_value: saleData.discount?.value || 0,
        discount_amount: saleData.discount?.amount || 0,
        final_amount: saleData.finalAmount,
        payment_method: saleData.paymentMethod || "cash",
        payment_split_cash: saleData.paymentSplit?.cash || 0,
        payment_split_online: saleData.paymentSplit?.online || 0,
        date: saleDate
      })
      .select("*")
      .single();

    if (sError) throw sError;

    // 2. Insert items into sale_services join table
    const servicesToInsert = [...(saleData.services || [])];

    // Add legacy single serviceId if not already in array
    if (saleData.serviceId && !servicesToInsert.some(s => s.serviceId === saleData.serviceId)) {
      servicesToInsert.push({
        serviceId: saleData.serviceId,
        name: "Service",
        price: saleData.totalAmount
      });
    }

    if (servicesToInsert.length > 0) {
      const joinRows = servicesToInsert.map(s => ({
        sale_id: sale.id,
        service_id: s.serviceId || null,
        name: s.name,
        price: s.price
      }));

      const { error: jError } = await supabase
        .from("sale_services")
        .insert(joinRows);

      if (jError) throw jError;
    }

    return await this.findById(sale.id);
  }

  static async update(id: string, updates: Partial<SaleDB>) {
    // Basic fields only, usually sales are not heavily modified
    const pgUpdates: any = { ...updates };
    const { data, error } = await supabase
      .from("sales")
      .update(pgUpdates)
      .eq("id", id)
      .select("*, sale_services(*)")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async delete(id: string) {
    const { data, error } = await supabase
      .from("sales")
      .delete()
      .eq("id", id)
      .select("*, sale_services(*)")
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }
}
