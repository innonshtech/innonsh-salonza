import { supabase } from "@/lib/supabase";

export interface UserDB {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  salon_id?: string | null;
  verification_status?: string | null;
  business_name?: string | null;
  gst_number?: string | null;
  business_address?: string | null;
  business_logo?: string | null;
  business_description?: string | null;
  reset_password_token?: string | null;
  reset_password_expires?: string | null;
  login_attempts?: number;
  lock_until?: string | null;
  created_at?: string;
  updated_at?: string;
}

export class UserRepository {
  private static mapToModel(user: any) {
    if (!user) return null;
    return {
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password_hash,
      role: user.roles?.name || user.role,
      salonId: user.salon_id,
      verificationStatus: user.verification_status,
      businessName: user.business_name,
      gstNumber: user.gst_number,
      businessAddress: user.business_address,
      businessLogo: user.business_logo,
      businessDescription: user.business_description,
      resetPasswordToken: user.reset_password_token,
      resetPasswordExpires: user.reset_password_expires,
      loginAttempts: user.login_attempts || 0,
      lockUntil: user.lock_until ? new Date(user.lock_until).getTime() : undefined,
      createdAt: user.created_at,
      save: async function() {
        return UserRepository.update(user.id, {
          login_attempts: this.loginAttempts,
          lock_until: this.lockUntil ? new Date(this.lockUntil).toISOString() : null,
          verification_status: this.verificationStatus,
          salon_id: this.salonId,
          reset_password_token: this.resetPasswordToken,
          reset_password_expires: this.resetPasswordExpires
        });
      }
    };
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*, roles(name)")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*, roles(name)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async create(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    salonId?: string;
  }) {
    // 1. Get role_id
    const roleName = userData.role || "salon_owner";
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single();

    if (roleError) throw new Error(`Role ${roleName} not found`);

    // 2. Insert user
    const { data, error } = await supabase
      .from("users")
      .insert({
        name: userData.name,
        email: userData.email.toLowerCase(),
        password_hash: userData.password,
        role_id: roleData.id,
        salon_id: userData.salonId || null,
        verification_status: roleName === "supplier" ? "unapplied" : "verified"
      })
      .select("*, roles(name)")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async update(id: string, updates: Partial<UserDB>) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select("*, roles(name)")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async listAll() {
    const { data, error } = await supabase
      .from("users")
      .select("*, roles(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(u => this.mapToModel(u));
  }
}
