import { supabase } from "@/lib/supabase";

export interface InventoryItemDB {
  id: string;
  salon_id: string;
  name: string;
  sku?: string;
  category?: string;
  price: number;
  cost_price?: number;
  stock_count?: number;
  min_stock_alert?: number;
  unit?: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
}

export class InventoryRepository {
  private static mapToModel(item: any) {
    if (!item) return null;
    return {
      _id: item.id,
      id: item.id,
      salonId: item.salon_id,
      name: item.name,
      sku: item.sku || "",
      category: item.category || "General",
      price: item.price || 0,
      costPrice: item.cost_price || 0,
      stockCount: item.stock_count || 0,
      minStockAlert: item.min_stock_alert || 5,
      unit: item.unit || "pcs",
      description: item.description || "",
      isActive: item.is_active !== undefined ? item.is_active : true,
      createdAt: item.created_at,
      toObject: function() {
        return this;
      }
    };
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }

  static async find(query: any) {
    let builder = supabase.from("inventory_items").select("*");

    if (query.salonId) {
      builder = builder.eq("salon_id", query.salonId);
    }
    if (query.isActive !== undefined) {
      builder = builder.eq("is_active", query.isActive);
    }

    const { data, error } = await builder.order("name", { ascending: true });
    if (error) throw error;
    return data.map((item: any) => this.mapToModel(item));
  }

  static async create(itemData: {
    salonId: string;
    name: string;
    sku?: string;
    category?: string;
    price: number;
    costPrice?: number;
    stockCount?: number;
    minStockAlert?: number;
    unit?: string;
    description?: string;
  }) {
    const { data, error } = await supabase
      .from("inventory_items")
      .insert({
        salon_id: itemData.salonId,
        name: itemData.name,
        sku: itemData.sku || null,
        category: itemData.category || "General",
        price: itemData.price,
        cost_price: itemData.costPrice || null,
        stock_count: itemData.stockCount || 0,
        min_stock_alert: itemData.minStockAlert || 5,
        unit: itemData.unit || "pcs",
        description: itemData.description || "",
        is_active: true
      })
      .select("*")
      .single();

    if (error) throw error;

    // Log transaction
    if (itemData.stockCount && itemData.stockCount > 0) {
      await supabase.from("inventory_transactions").insert({
        item_id: data.id,
        transaction_type: "purchase",
        quantity: itemData.stockCount,
        notes: "Initial stock load"
      });
    }

    return this.mapToModel(data);
  }

  static async update(id: string, updates: Partial<InventoryItemDB> & {
    salonId?: string;
    costPrice?: number;
    stockCount?: number;
    minStockAlert?: number;
    isActive?: boolean;
  }) {
    const pgUpdates: any = {};
    if (updates.salonId !== undefined) pgUpdates.salon_id = updates.salonId;
    if (updates.name !== undefined) pgUpdates.name = updates.name;
    if (updates.sku !== undefined) pgUpdates.sku = updates.sku;
    if (updates.category !== undefined) pgUpdates.category = updates.category;
    if (updates.price !== undefined) pgUpdates.price = updates.price;
    if (updates.costPrice !== undefined) pgUpdates.cost_price = updates.costPrice;
    if (updates.stockCount !== undefined) pgUpdates.stock_count = updates.stockCount;
    if (updates.minStockAlert !== undefined) pgUpdates.min_stock_alert = updates.minStockAlert;
    if (updates.unit !== undefined) pgUpdates.unit = updates.unit;
    if (updates.description !== undefined) pgUpdates.description = updates.description;
    if (updates.isActive !== undefined) pgUpdates.is_active = updates.isActive;
    if (updates.is_active !== undefined) pgUpdates.is_active = updates.is_active;

    // Check if stock_count is being modified to log a transaction
    let prevItem = null;
    if (updates.stockCount !== undefined) {
      prevItem = await this.findById(id);
    }

    const { data, error } = await supabase
      .from("inventory_items")
      .update(pgUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    // Log transaction if stock level changed
    if (prevItem && updates.stockCount !== undefined && updates.stockCount !== prevItem.stockCount) {
      const diff = updates.stockCount - prevItem.stockCount;
      await supabase.from("inventory_transactions").insert({
        item_id: id,
        transaction_type: diff > 0 ? "adjustment" : "consumption",
        quantity: Math.abs(diff),
        notes: `Manual adjustment from ${prevItem.stockCount} to ${updates.stockCount}`
      });
    }

    return this.mapToModel(data);
  }

  static async findByIdAndUpdate(id: string, updateObj: any, options?: { new: boolean }) {
    return this.update(id, updateObj);
  }

  static async delete(id: string) {
    const { data, error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return this.mapToModel(data);
  }
}
