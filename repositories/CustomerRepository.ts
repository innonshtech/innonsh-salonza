import { supabase } from "@/lib/supabase";

export interface CustomerDB {
  id: string;
  salon_id: string;
  name: string;
  phone: string;
  email?: string;
  gender?: string;
  birthday?: string;
  loyalty_points?: number;
  total_visits?: number;
  total_spent?: number;
  last_visit?: string;
  rating?: number;
  notes?: string;
  tags?: string[];
  created_at?: string;
}

export class CustomerRepository {
  private static mapToModel(customer: any) {
    if (!customer) return null;
    return {
      _id: customer.id,
      id: customer.id,
      salonId: customer.salon_id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      gender: customer.gender,
      birthday: customer.birthday,
      loyaltyPoints: customer.loyalty_points || 0,
      totalVisits: customer.total_visits || 0,
      totalSpent: customer.total_spent || 0,
      lastVisit: customer.last_visit,
      rating: customer.rating || 0,
      notes: customer.notes || "",
      tags: customer.tags || [],
      createdAt: customer.created_at,
      toObject: function() {
        return this;
      }
    };
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async findOne(query: { salonId?: string; phone?: string; email?: string }) {
    let builder = supabase.from("customers").select("*");
    if (query.salonId) {
      builder = builder.eq("salon_id", query.salonId);
    }
    if (query.phone) {
      builder = builder.eq("phone", query.phone);
    }
    if (query.email) {
      builder = builder.eq("email", query.email.toLowerCase());
    }

    const { data, error } = await builder.maybeSingle();
    if (error) throw error;
    return this.mapToModel(data);
  }

  static async find(query: any) {
    let builder = supabase.from("customers").select("*");

    if (query.salonId) {
      builder = builder.eq("salon_id", query.salonId);
    }
    if (query.phone) {
      builder = builder.eq("phone", query.phone);
    }

    const { data, error } = await builder.order("name", { ascending: true });
    if (error) throw error;
    return data.map((c: any) => this.mapToModel(c));
  }

  static async create(customerData: {
    salonId: string;
    name: string;
    phone: string;
    email?: string;
    gender?: string;
    birthday?: Date | string;
    loyaltyPoints?: number;
    notes?: string;
    tags?: string[];
  }) {
    const bday = customerData.birthday 
      ? (customerData.birthday instanceof Date ? customerData.birthday.toISOString().split('T')[0] : customerData.birthday)
      : null;

    const { data, error } = await supabase
      .from("customers")
      .insert({
        salon_id: customerData.salonId,
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email ? customerData.email.toLowerCase() : null,
        gender: customerData.gender || null,
        birthday: bday,
        loyalty_points: customerData.loyaltyPoints || 0,
        notes: customerData.notes || "",
        tags: customerData.tags || []
      })
      .select("*")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async update(id: string, updates: Partial<CustomerDB> & {
    salonId?: string;
    loyaltyPoints?: number;
    totalVisits?: number;
    totalSpent?: number;
    lastVisit?: string | Date;
  }) {
    const pgUpdates: any = {};
    if (updates.salonId !== undefined) pgUpdates.salon_id = updates.salonId;
    if (updates.name !== undefined) pgUpdates.name = updates.name;
    if (updates.phone !== undefined) pgUpdates.phone = updates.phone;
    if (updates.email !== undefined) pgUpdates.email = updates.email ? updates.email.toLowerCase() : null;
    if (updates.gender !== undefined) pgUpdates.gender = updates.gender;
    if (updates.birthday !== undefined) pgUpdates.birthday = updates.birthday;
    if (updates.loyaltyPoints !== undefined) pgUpdates.loyalty_points = updates.loyaltyPoints;
    if (updates.totalVisits !== undefined) pgUpdates.total_visits = updates.totalVisits;
    if (updates.totalSpent !== undefined) pgUpdates.total_spent = updates.totalSpent;
    if (updates.lastVisit !== undefined) pgUpdates.last_visit = updates.lastVisit instanceof Date ? updates.lastVisit.toISOString() : updates.lastVisit;
    if (updates.rating !== undefined) pgUpdates.rating = updates.rating;
    if (updates.notes !== undefined) pgUpdates.notes = updates.notes;
    if (updates.tags !== undefined) pgUpdates.tags = updates.tags;

    const { data, error } = await supabase
      .from("customers")
      .update(pgUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async findByIdAndUpdate(id: string, updateObj: any, options?: { new: boolean }) {
    return this.update(id, updateObj);
  }

  static async delete(id: string) {
    const { data, error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }
}
