import { supabase } from "@/lib/supabase";

export interface StaffDB {
  id: string;
  salon_id: string;
  branch_id?: string;
  user_id?: string;
  name: string;
  phone?: string;
  skills?: string[];
  profile_image?: string;
  is_active?: boolean;
  status?: string;
  daily_limit?: number;
  avg_time?: number;
  completed_today?: number;
  created_at?: string;
}

export class StaffRepository {
  private static mapToModel(staff: any) {
    if (!staff) return null;
    return {
      _id: staff.id,
      id: staff.id,
      salonId: staff.salon_id,
      branchId: staff.branch_id,
      userId: staff.user_id,
      name: staff.name,
      phone: staff.phone || "",
      skills: staff.skills || [],
      profileImage: staff.profile_image || "",
      active: staff.is_active !== undefined ? staff.is_active : true,
      status: staff.status || "available",
      currentStatus: staff.status || "available", // Compatibility
      dailyLimit: staff.daily_limit || 0,
      avgTime: staff.avg_time || 0,
      completedToday: staff.completed_today || 0,
      createdAt: staff.created_at,
      toObject: function() {
        return this;
      }
    };
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async find(query: any) {
    let builder = supabase.from("staff").select("*");

    if (query.salonId) {
      builder = builder.eq("salon_id", query.salonId);
    }
    if (query.active !== undefined) {
      builder = builder.eq("is_active", query.active);
    }

    const { data, error } = await builder.order("name", { ascending: true });
    if (error) throw error;
    return data.map(s => this.mapToModel(s));
  }

  static async create(staffData: {
    salonId: string;
    branchId?: string;
    userId?: string;
    name: string;
    phone?: string;
    skills?: string[];
    profileImage?: string;
    status?: string;
    dailyLimit?: number;
    avgTime?: number;
  }) {
    const { data, error } = await supabase
      .from("staff")
      .insert({
        salon_id: staffData.salonId,
        branch_id: staffData.branchId || null,
        user_id: staffData.userId || null,
        name: staffData.name,
        phone: staffData.phone || null,
        skills: staffData.skills || [],
        profile_image: staffData.profileImage || "",
        status: staffData.status || "available",
        is_active: true,
        daily_limit: staffData.dailyLimit || 0,
        avg_time: staffData.avgTime || 0,
        completed_today: 0
      })
      .select("*")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async update(id: string, updates: Partial<StaffDB> & {
    salonId?: string;
    dailyLimit?: number;
    avgTime?: number;
    completedToday?: number;
    profileImage?: string;
    isActive?: boolean;
    currentStatus?: string; // Legacy status sync
  }) {
    const pgUpdates: any = {};
    if (updates.salonId !== undefined) pgUpdates.salon_id = updates.salonId;
    if (updates.name !== undefined) pgUpdates.name = updates.name;
    if (updates.phone !== undefined) pgUpdates.phone = updates.phone;
    if (updates.skills !== undefined) pgUpdates.skills = updates.skills;
    if (updates.profileImage !== undefined) pgUpdates.profile_image = updates.profileImage;
    if (updates.isActive !== undefined) pgUpdates.is_active = updates.isActive;
    if (updates.is_active !== undefined) pgUpdates.is_active = updates.is_active;
    
    // Status sync support
    if (updates.status !== undefined) {
      pgUpdates.status = updates.status;
    } else if (updates.currentStatus !== undefined) {
      pgUpdates.status = updates.currentStatus;
    }

    if (updates.dailyLimit !== undefined) pgUpdates.daily_limit = updates.dailyLimit;
    if (updates.avgTime !== undefined) pgUpdates.avg_time = updates.avgTime;
    if (updates.completedToday !== undefined) pgUpdates.completed_today = updates.completedToday;

    const { data, error } = await supabase
      .from("staff")
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
      .from("staff")
      .delete()
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }
}
