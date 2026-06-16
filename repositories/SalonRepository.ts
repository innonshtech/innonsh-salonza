import { supabase } from "@/lib/supabase";

export interface SalonDB {
  id: string;
  tenant_id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  slug: string;
  about?: string;
  years_experience?: number;
  clients_count?: number;
  staff_count?: number;
  rating?: number;
  opening_hours?: any;
  socials?: any;
  main_image?: string;
  gallery?: string[];
  created_at?: string;
}

export class SalonRepository {
  private static mapToModel(salon: any) {
    if (!salon) return null;
    return {
      _id: salon.id,
      id: salon.id,
      tenantId: salon.tenant_id,
      ownerId: salon.owner_id,
      name: salon.name,
      address: salon.address,
      phone: salon.phone,
      email: salon.email || "",
      slug: salon.slug,
      about: salon.about,
      yearsExperience: salon.years_experience || 0,
      clientsCount: salon.clients_count || 0,
      staffCount: salon.staff_count || 0,
      rating: salon.rating || 0.0,
      openingHours: salon.opening_hours || {},
      socials: salon.socials || {},
      mainImage: salon.main_image,
      gallery: salon.gallery || [],
      createdAt: salon.created_at
    };
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("salons")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async findOne(query: { slug?: string; ownerId?: string }) {
    let builder = supabase.from("salons").select("*");
    if (query.slug) {
      builder = builder.eq("slug", query.slug);
    }
    if (query.ownerId) {
      builder = builder.eq("owner_id", query.ownerId);
    }
    const { data, error } = await builder.maybeSingle();
    if (error) throw error;
    return this.mapToModel(data);
  }

  static async create(salonData: {
    ownerId: string;
    name: string;
    slug: string;
    address?: string;
    phone?: string;
    email?: string;
  }) {
    const { data, error } = await supabase
      .from("salons")
      .insert({
        owner_id: salonData.ownerId,
        name: salonData.name,
        slug: salonData.slug,
        address: salonData.address || "",
        phone: salonData.phone || "",
        email: salonData.email || "",
        opening_hours: {
          monday: { open: "09:00", close: "21:00" },
          tuesday: { open: "09:00", close: "21:00" },
          wednesday: { open: "09:00", close: "21:00" },
          thursday: { open: "09:00", close: "21:00" },
          friday: { open: "09:00", close: "21:00" },
          saturday: { open: "09:00", close: "21:00" },
          sunday: { open: "09:00", close: "21:00" }
        },
        socials: { instagram: "", facebook: "", twitter: "" },
        gallery: []
      })
      .select("*")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async update(id: string, updates: Partial<SalonDB> & { ownerId?: string }) {
    const pgUpdates: any = { ...updates };
    if (updates.ownerId) {
      pgUpdates.owner_id = updates.ownerId;
      delete pgUpdates.ownerId;
    }
    if (updates.years_experience === undefined && (updates as any).yearsExperience !== undefined) {
      pgUpdates.years_experience = (updates as any).yearsExperience;
      delete (pgUpdates as any).yearsExperience;
    }
    if (updates.clients_count === undefined && (updates as any).clientsCount !== undefined) {
      pgUpdates.clients_count = (updates as any).clientsCount;
      delete (pgUpdates as any).clientsCount;
    }
    if (updates.staff_count === undefined && (updates as any).staffCount !== undefined) {
      pgUpdates.staff_count = (updates as any).staffCount;
      delete (pgUpdates as any).staffCount;
    }
    if (updates.main_image === undefined && (updates as any).mainImage !== undefined) {
      pgUpdates.main_image = (updates as any).mainImage;
      delete (pgUpdates as any).mainImage;
    }

    const { data, error } = await supabase
      .from("salons")
      .update(pgUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async findByIdAndUpdate(id: string, updateObj: any, options?: { new: boolean }) {
    // Mimics mongoose findByIdAndUpdate, especially for $push and $pull operators on gallery
    const salon = await this.findById(id);
    if (!salon) return null;

    let newGallery = [...(salon.gallery || [])];
    let updateFields: any = {};

    if (updateObj.$push && updateObj.$push.gallery) {
      newGallery.push(updateObj.$push.gallery);
      updateFields.gallery = newGallery;
    } else if (updateObj.$pull && updateObj.$pull.gallery) {
      newGallery = newGallery.filter(img => img !== updateObj.$pull.gallery);
      updateFields.gallery = newGallery;
    } else {
      // Direct updates
      const keys = Object.keys(updateObj);
      for (const key of keys) {
        if (key === "about") updateFields.about = updateObj.about;
        if (key === "yearsExperience") updateFields.years_experience = updateObj.yearsExperience;
        if (key === "clientsCount") updateFields.clients_count = updateObj.clientsCount;
        if (key === "staffCount") updateFields.staff_count = updateObj.staffCount;
        if (key === "rating") updateFields.rating = updateObj.rating;
        if (key === "openingHours") updateFields.opening_hours = updateObj.openingHours;
        if (key === "socials") updateFields.socials = updateObj.socials;
        if (key === "mainImage") updateFields.main_image = updateObj.mainImage;
        if (key === "name") updateFields.name = updateObj.name;
        if (key === "address") updateFields.address = updateObj.address;
        if (key === "phone") updateFields.phone = updateObj.phone;
      }
    }

    return await this.update(id, updateFields);
  }

  static async listAll() {
    const { data, error } = await supabase
      .from("salons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map((s: any) => this.mapToModel(s));
  }
}
