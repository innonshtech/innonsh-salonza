import { supabase } from "@/lib/supabase";

// ==========================================
// 1. SESSION REPOSITORY
// ==========================================
export class SessionRepository {
  static async create(sessionData: {
    userId: string;
    token: string;
    userAgent?: string;
    ip?: string;
    expiresAt: Date;
  }) {
    const { data, error } = await supabase
      .from("sessions")
      .insert({
        user_id: sessionData.userId,
        token: sessionData.token,
        user_agent: sessionData.userAgent || "Unknown Device",
        ip: sessionData.ip || "Unknown IP",
        expires_at: sessionData.expiresAt.toISOString()
      })
      .select("*")
      .single();

    if (error) throw error;
    return {
      _id: data.id,
      userId: data.user_id,
      token: data.token,
      userAgent: data.user_agent,
      ip: data.ip,
      expiresAt: data.expires_at,
      lastActive: data.last_active
    };
  }

  static async find(query: { userId?: string }) {
    let builder = supabase.from("sessions").select("*");
    if (query.userId) {
      builder = builder.eq("user_id", query.userId);
    }
    const { data, error } = await builder.order("last_active", { ascending: false });
    if (error) throw error;
    return data.map((s: any) => ({
      _id: s.id,
      userId: s.user_id,
      token: s.token,
      userAgent: s.user_agent,
      ip: s.ip,
      expiresAt: s.expires_at,
      lastActive: s.last_active
    }));
  }

  static async deleteMany(query: { userId: string }) {
    const { data, error } = await supabase
      .from("sessions")
      .delete()
      .eq("user_id", query.userId)
      .select("id");

    if (error) throw error;
    return { deletedCount: data.length };
  }

  static async deleteByToken(token: string) {
    const { data, error } = await supabase
      .from("sessions")
      .delete()
      .eq("token", token)
      .select("id");

    if (error) throw error;
    return { deletedCount: data?.length || 0 };
  }

  static async deleteOne(query: { token: string }) {
    return this.deleteByToken(query.token);
  }
}

// ==========================================
// 2. BLACKLISTED TOKEN REPOSITORY
// ==========================================
export class BlacklistedTokenRepository {
  static async create(tokenData: { token: string; expiresAt: Date }) {
    const { data, error } = await supabase
      .from("blacklisted_tokens")
      .insert({
        token: tokenData.token,
        expires_at: tokenData.expiresAt.toISOString()
      })
      .select("*")
      .single();

    if (error) throw error;
    return {
      _id: data.id,
      token: data.token,
      expiresAt: data.expires_at
    };
  }

  static async findOne(query: { token: string }) {
    const { data, error } = await supabase
      .from("blacklisted_tokens")
      .select("*")
      .eq("token", query.token)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return {
      _id: data.id,
      token: data.token,
      expiresAt: data.expires_at
    };
  }
}

// ==========================================
// 3. MEMBERSHIP REPOSITORY
// ==========================================
export class MembershipRepository {
  static async find(query: { salonId?: string; isActive?: boolean }) {
    let builder = supabase.from("memberships").select("*");
    if (query.salonId) builder = builder.eq("salon_id", query.salonId);
    if (query.isActive !== undefined) builder = builder.eq("is_active", query.isActive);

    const { data, error } = await builder.order("name", { ascending: true });
    if (error) throw error;
    return data.map((m: any) => ({
      _id: m.id,
      id: m.id,
      salonId: m.salon_id,
      name: m.name,
      price: m.price,
      validity: m.validity,
      discount: m.discount,
      benefits: m.benefits,
      isActive: m.is_active,
      createdAt: m.created_at
    }));
  }

  static async findById(id: string) {
    const { data, error } = await supabase.from("memberships").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      _id: data.id,
      id: data.id,
      salonId: data.salon_id,
      name: data.name,
      price: data.price,
      validity: data.validity,
      discount: data.discount,
      benefits: data.benefits,
      isActive: data.is_active,
      createdAt: data.created_at
    };
  }

  static async create(membershipData: {
    salonId: string;
    name: string;
    price: number;
    validity: number;
    discount: number;
    benefits: string;
  }) {
    const { data, error } = await supabase
      .from("memberships")
      .insert({
        salon_id: membershipData.salonId,
        name: membershipData.name,
        price: membershipData.price,
        validity: membershipData.validity,
        discount: membershipData.discount,
        benefits: membershipData.benefits,
        is_active: true
      })
      .select("*")
      .single();

    if (error) throw error;
    return {
      _id: data.id,
      id: data.id,
      salonId: data.salon_id,
      name: data.name,
      price: data.price,
      validity: data.validity,
      discount: data.discount,
      benefits: data.benefits,
      isActive: data.is_active,
      createdAt: data.created_at
    };
  }

  static async findByIdAndUpdate(id: string, updates: any, options?: any) {
    const pgUpdates: any = {};
    if (updates.name !== undefined) pgUpdates.name = updates.name;
    if (updates.price !== undefined) pgUpdates.price = updates.price;
    if (updates.validity !== undefined) pgUpdates.validity = updates.validity;
    if (updates.discount !== undefined) pgUpdates.discount = updates.discount;
    if (updates.benefits !== undefined) pgUpdates.benefits = updates.benefits;
    if (updates.isActive !== undefined) pgUpdates.is_active = updates.isActive;
    if (updates.is_active !== undefined) pgUpdates.is_active = updates.is_active;

    const { data, error } = await supabase
      .from("memberships")
      .update(pgUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return {
      _id: data.id,
      id: data.id,
      salonId: data.salon_id,
      name: data.name,
      price: data.price,
      validity: data.validity,
      discount: data.discount,
      benefits: data.benefits,
      isActive: data.is_active,
      createdAt: data.created_at
    };
  }

  static async findByIdAndDelete(id: string) {
    const { error } = await supabase.from("memberships").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

// ==========================================
// 4. OFFER REPOSITORY
// ==========================================
export class OfferRepository {
  static async find(query: { salonId?: string; isActive?: boolean }) {
    let builder = supabase.from("offers").select("*");
    if (query.salonId) builder = builder.eq("salon_id", query.salonId);
    if (query.isActive !== undefined) builder = builder.eq("is_active", query.isActive);

    const { data, error } = await builder.order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((o: any) => ({
      _id: o.id,
      id: o.id,
      salonId: o.salon_id,
      title: o.title,
      subtitle: o.subtitle,
      description: o.description,
      originalPrice: o.original_price,
      discountedPrice: o.discounted_price,
      percentage: o.percentage,
      isActive: o.is_active,
      createdAt: o.created_at
    }));
  }

  static async create(offerData: {
    salonId?: string;
    title: string;
    subtitle?: string;
    description?: string;
    originalPrice?: number;
    discountedPrice?: number;
    percentage?: number;
  }) {
    const { data, error } = await supabase
      .from("offers")
      .insert({
        salon_id: offerData.salonId || null,
        title: offerData.title,
        subtitle: offerData.subtitle || "",
        description: offerData.description || "",
        original_price: offerData.originalPrice || 0,
        discounted_price: offerData.discountedPrice || 0,
        percentage: offerData.percentage || 0,
        is_active: true
      })
      .select("*")
      .single();

    if (error) throw error;
    return {
      _id: data.id,
      id: data.id,
      salonId: data.salon_id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      originalPrice: data.original_price,
      discountedPrice: data.discounted_price,
      percentage: data.percentage,
      isActive: data.is_active,
      createdAt: data.created_at
    };
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return {
      _id: data.id,
      id: data.id,
      salonId: data.salon_id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      originalPrice: data.original_price,
      discountedPrice: data.discounted_price,
      percentage: data.percentage,
      isActive: data.is_active,
      createdAt: data.created_at
    };
  }

  static async deleteOne(query: { _id: string }) {
    const { data, error } = await supabase
      .from("offers")
      .delete()
      .eq("id", query._id)
      .select("id");

    if (error) throw error;
    return { deletedCount: data.length };
  }
}

// ==========================================
// 5. TESTIMONIAL REPOSITORY
// ==========================================
export class TestimonialRepository {
  static async find(query: { salonId?: string }) {
    let builder = supabase.from("testimonials").select("*");
    if (query.salonId) builder = builder.eq("salon_id", query.salonId);

    const { data, error } = await builder.order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((t: any) => ({
      _id: t.id,
      id: t.id,
      salonId: t.salon_id,
      name: t.name,
      role: t.role,
      review: t.review,
      rating: t.rating,
      createdAt: t.created_at
    }));
  }

  static async create(testimonialData: {
    salonId?: string;
    name: string;
    role?: string;
    review: string;
    rating?: number;
  }) {
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        salon_id: testimonialData.salonId || null,
        name: testimonialData.name,
        role: testimonialData.role || "",
        review: testimonialData.review,
        rating: testimonialData.rating || 5
      })
      .select("*")
      .single();

    if (error) throw error;
    return {
      _id: data.id,
      id: data.id,
      salonId: data.salon_id,
      name: data.name,
      role: data.role,
      review: data.review,
      rating: data.rating,
      createdAt: data.created_at
    };
  }
}

// ==========================================
// 6. FEEDBACK REPOSITORY
// ==========================================
export class FeedbackRepository {
  static async find(query: { salonId?: string }) {
    let builder = supabase.from("feedbacks").select("*");
    if (query.salonId) builder = builder.eq("salon_id", query.salonId);

    const { data, error } = await builder.order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((f: any) => ({
      _id: f.id,
      id: f.id,
      salonId: f.salon_id,
      saleId: f.sale_id,
      customerName: f.customer_name,
      rating: f.rating,
      comment: f.comment,
      source: f.source,
      createdAt: f.created_at
    }));
  }

  static async create(feedbackData: {
    salonId: string;
    saleId?: string;
    customerName?: string;
    rating: number;
    comment?: string;
    source?: string;
  }) {
    const { data, error } = await supabase
      .from("feedbacks")
      .insert({
        salon_id: feedbackData.salonId,
        sale_id: feedbackData.saleId || null,
        customer_name: feedbackData.customerName || "Anonymous",
        rating: feedbackData.rating,
        comment: feedbackData.comment || "",
        source: feedbackData.source || "pos"
      })
      .select("*")
      .single();

    if (error) throw error;
    return {
      _id: data.id,
      id: data.id,
      salonId: data.salon_id,
      saleId: data.sale_id,
      customerName: data.customer_name,
      rating: data.rating,
      comment: data.comment,
      source: data.source,
      createdAt: data.created_at
    };
  }
}

// ==========================================
// 7. SUBSCRIPTION REPOSITORY (Razorpay)
// ==========================================
export class SubscriptionRepository {
  static async findOne(query: { salonId?: string }) {
    let builder = supabase.from("subscriptions").select("*");
    if (query.salonId) builder = builder.eq("salon_id", query.salonId);

    const { data, error } = await builder.maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      _id: data.id,
      id: data.id,
      salonId: data.salon_id,
      plan: data.plan,
      razorpaySubscriptionId: data.razorpay_subscription_id,
      status: data.status,
      startedAt: data.started_at,
      expiresAt: data.expires_at
    };
  }

  static async create(subData: {
    salonId?: string;
    plan: string;
    razorpaySubscriptionId?: string;
    status?: string;
    startedAt?: Date;
    expiresAt?: Date;
  }) {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        salon_id: subData.salonId || null,
        plan: subData.plan,
        razorpay_subscription_id: subData.razorpaySubscriptionId || "",
        status: subData.status || "active",
        started_at: subData.startedAt?.toISOString() || new Date().toISOString(),
        expires_at: subData.expiresAt?.toISOString() || null
      })
      .select("*")
      .single();

    if (error) throw error;
    return {
      _id: data.id,
      id: data.id,
      salonId: data.salon_id,
      plan: data.plan,
      razorpaySubscriptionId: data.razorpay_subscription_id,
      status: data.status,
      startedAt: data.started_at,
      expiresAt: data.expires_at
    };
  }

  static async findOneAndUpdate(query: { razorpaySubscriptionId: string }, updates: any, options?: any) {
    const pgUpdates: any = {};
    if (updates.status !== undefined) pgUpdates.status = updates.status;
    if (updates.expiresAt !== undefined) pgUpdates.expires_at = updates.expiresAt instanceof Date ? updates.expiresAt.toISOString() : updates.expiresAt;

    const { data, error } = await supabase
      .from("subscriptions")
      .update(pgUpdates)
      .eq("razorpay_subscription_id", query.razorpaySubscriptionId)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return {
      _id: data.id,
      id: data.id,
      salonId: data.salon_id,
      plan: data.plan,
      razorpaySubscriptionId: data.razorpay_subscription_id,
      status: data.status,
      startedAt: data.started_at,
      expiresAt: data.expires_at
    };
  }
}

// ==========================================
// 8. B2B SUPPLIER SUBSCRIPTION REPOSITORY
// ==========================================
export class SupplierSubscriptionRepository {
  static async findOne(query: { supplierId?: string }) {
    let builder = supabase.from("supplier_subscriptions").select("*");
    if (query.supplierId) builder = builder.eq("supplier_id", query.supplierId);

    const { data, error } = await builder.maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      _id: data.id,
      id: data.id,
      supplierId: data.supplier_id,
      plan: data.plan,
      status: data.status,
      maxProducts: data.max_products,
      commissionRate: data.commission_rate,
      startedAt: data.started_at,
      expiresAt: data.expires_at
    };
  }

  static async create(subData: {
    supplierId: string;
    plan?: string;
    status?: string;
    maxProducts?: number;
    commissionRate?: number;
    expiresAt?: Date;
  }) {
    const { data, error } = await supabase
      .from("supplier_subscriptions")
      .insert({
        supplier_id: subData.supplierId,
        plan: subData.plan || "free",
        status: subData.status || "active",
        max_products: subData.maxProducts || 5,
        commission_rate: subData.commissionRate || 10.00,
        expires_at: subData.expiresAt?.toISOString() || null
      })
      .select("*")
      .single();

    if (error) throw error;
    return {
      _id: data.id,
      id: data.id,
      supplierId: data.supplier_id,
      plan: data.plan,
      status: data.status,
      maxProducts: data.max_products,
      commissionRate: data.commission_rate,
      startedAt: data.started_at,
      expiresAt: data.expires_at
    };
  }
}

// ==========================================
// 9. B2B MARKETPLACE PRODUCT REPOSITORY
// ==========================================
export class MarketplaceProductRepository {
  private static mapToModel(prod: any) {
    if (!prod) return null;
    return {
      _id: prod.id,
      id: prod.id,
      supplierId: prod.supplier ? {
        _id: prod.supplier.id,
        id: prod.supplier.id,
        name: prod.supplier.name
      } : prod.supplier_id,
      name: prod.name,
      description: prod.description || "",
      price: prod.price,
      businessPrice: prod.business_price,
      category: prod.category,
      brand: prod.brand || "",
      image: prod.image || "",
      stock: prod.stock || 0,
      minOrderQuantity: prod.min_order_quantity || 1,
      isActive: prod.is_active,
      createdAt: prod.created_at
    };
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("marketplace_products")
      .select("*, supplier:users(id, name)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async find(query: any) {
    let builder = supabase.from("marketplace_products").select("*, supplier:users(id, name)");
    if (query.supplierId) builder = builder.eq("supplier_id", query.supplierId);
    if (query.isActive !== undefined) builder = builder.eq("is_active", query.isActive);

    const { data, error } = await builder.order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((p: any) => this.mapToModel(p));
  }

  static async countDocuments(query: { supplierId: string }) {
    const { count, error } = await supabase
      .from("marketplace_products")
      .select("*", { count: 'exact', head: true })
      .eq("supplier_id", query.supplierId);

    if (error) throw error;
    return count || 0;
  }

  static async create(prodData: {
    supplierId: string;
    name: string;
    description?: string;
    price: number;
    businessPrice?: number;
    category: string;
    brand?: string;
    image?: string;
    stock?: number;
    minOrderQuantity?: number;
  }) {
    const { data, error } = await supabase
      .from("marketplace_products")
      .insert({
        supplier_id: prodData.supplierId,
        name: prodData.name,
        description: prodData.description || "",
        price: prodData.price,
        business_price: prodData.businessPrice || null,
        category: prodData.category,
        brand: prodData.brand || "",
        image: prodData.image || "",
        stock: prodData.stock || 0,
        min_order_quantity: prodData.minOrderQuantity || 1,
        is_active: true
      })
      .select("*")
      .single();

    if (error) throw error;
    return this.mapToModel(data);
  }
}

// ==========================================
// 10. B2B SUPPLIER ORDER REPOSITORY
// ==========================================
export class SupplierOrderRepository {
  private static mapToModel(order: any) {
    if (!order) return null;
    
    // Map items from supplier_order_items
    const items: any[] = [];
    if (order.supplier_order_items && Array.isArray(order.supplier_order_items)) {
      order.supplier_order_items.forEach((item: any) => {
        items.push({
          productId: item.product_id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        });
      });
    }

    return {
      _id: order.id,
      id: order.id,
      salonId: order.salon_id,
      salonOwnerId: order.salon_owner_id,
      supplierId: order.supplier_id,
      items,
      totalAmount: order.total_amount,
      status: order.status,
      paymentStatus: order.payment_status,
      shippingAddress: order.shipping_address,
      createdAt: order.created_at
    };
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("supplier_orders")
      .select("*, supplier_order_items(*)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async find(query: { supplierId?: string; salonId?: string }) {
    let builder = supabase.from("supplier_orders").select("*, supplier_order_items(*)");
    if (query.supplierId) builder = builder.eq("supplier_id", query.supplierId);
    if (query.salonId) builder = builder.eq("salon_id", query.salonId);

    const { data, error } = await builder.order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((o: any) => this.mapToModel(o));
  }

  static async create(orderData: {
    salonId: string;
    salonOwnerId: string;
    supplierId: string;
    items: { productId?: string; name: string; quantity: number; price: number }[];
    totalAmount: number;
    shippingAddress?: string;
  }) {
    // 1. Insert order
    const { data: order, error: oError } = await supabase
      .from("supplier_orders")
      .insert({
        salon_id: orderData.salonId,
        salon_owner_id: orderData.salonOwnerId,
        supplier_id: orderData.supplierId,
        total_amount: orderData.totalAmount,
        shipping_address: orderData.shippingAddress || "",
        status: "pending",
        payment_status: "pending"
      })
      .select("*")
      .single();

    if (oError) throw oError;

    // 2. Insert items
    if (orderData.items && orderData.items.length > 0) {
      const lineItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.productId || null,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: iError } = await supabase
        .from("supplier_order_items")
        .insert(lineItems);

      if (iError) throw iError;
    }

    return this.findById(order.id);
  }
}
