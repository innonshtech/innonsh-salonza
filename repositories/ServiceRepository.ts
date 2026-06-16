import { supabase } from "@/lib/supabase";

export interface ServiceDB {
  id: string;
  salon_id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
  category?: string;
  image?: string;
  is_active?: boolean;
  created_at?: string;
}

export class ServiceRepository {
  private static mapToModel(service: any) {
    if (!service) return null;
    return {
      _id: service.id,
      id: service.id,
      salonId: service.salon_id,
      name: service.name,
      duration: service.duration,
      price: service.price,
      description: service.description || "",
      category: service.category || "General",
      image: service.image || "",
      isActive: service.is_active !== undefined ? service.is_active : true,
      createdAt: service.created_at
    };
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async find(query: any) {
    let builder = supabase.from("services").select("*");
    
    if (query._id) {
      if (query._id.$in && Array.isArray(query._id.$in)) {
        builder = builder.in("id", query._id.$in);
      } else {
        builder = builder.eq("id", query._id);
      }
    }
    if (query.salonId) {
      builder = builder.eq("salon_id", query.salonId);
    }
    if (query.isActive !== undefined) {
      builder = builder.eq("is_active", query.isActive);
    }

    const { data, error } = await builder;
    if (error) throw error;
    return data.map((s: any) => this.mapToModel(s));
  }

  static async create(serviceData: {
    salonId: string;
    name: string;
    duration: number;
    price: number;
    description?: string;
    category?: string;
    image?: string;
  }) {
    const { data, error } = await supabase
      .from("services")
      .insert({
        salon_id: serviceData.salonId,
        name: serviceData.name,
        duration: serviceData.duration,
        price: serviceData.price,
        description: serviceData.description || "",
        category: serviceData.category || "General",
        image: serviceData.image || "",
        is_active: true
      })
      .select("*")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async update(id: string, updates: Partial<ServiceDB>) {
    const pgUpdates: any = { ...updates };
    if (updates.salon_id === undefined && (updates as any).salonId !== undefined) {
      pgUpdates.salon_id = (updates as any).salonId;
      delete pgUpdates.salonId;
    }
    if (updates.is_active === undefined && (updates as any).isActive !== undefined) {
      pgUpdates.is_active = (updates as any).isActive;
      delete pgUpdates.isActive;
    }

    const { data, error } = await supabase
      .from("services")
      .update(pgUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async delete(id: string) {
    const { data, error } = await supabase
      .from("services")
      .delete()
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }
}
