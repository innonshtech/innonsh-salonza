import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request) {
    try {
        // Fetch supplier role ID
        const { data: supplierRole } = await supabase
            .from("roles")
            .select("id")
            .eq("name", "supplier")
            .single();
        const supplierRoleId = supplierRole?.id;

        const { count: totalSalons } = await supabase
            .from("salons")
            .select("*", { count: "exact", head: true });

        let totalSuppliers = 0;
        let verifiedSuppliers = 0;
        let pendingUsers: any[] = [];

        if (supplierRoleId) {
            const { count: suppliersCount } = await supabase
                .from("users")
                .select("*", { count: "exact", head: true })
                .eq("role_id", supplierRoleId);
            totalSuppliers = suppliersCount || 0;

            const { count: verifiedCount } = await supabase
                .from("users")
                .select("*", { count: "exact", head: true })
                .eq("role_id", supplierRoleId)
                .eq("verification_status", "verified");
            verifiedSuppliers = verifiedCount || 0;

            const { data } = await supabase
                .from("users")
                .select("*, roles(name)")
                .eq("role_id", supplierRoleId)
                .eq("verification_status", "pending");
            pendingUsers = data || [];
        }

        const { count: totalProducts } = await supabase
            .from("marketplace_products")
            .select("*", { count: "exact", head: true });

        const pendingVerifications = pendingUsers.map(u => ({
            _id: u.id,
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.roles?.name || "supplier",
            salonId: u.salon_id,
            verificationStatus: u.verification_status,
            businessName: u.business_name,
            gstNumber: u.gst_number,
            businessAddress: u.business_address,
            businessDescription: u.business_description,
            createdAt: u.created_at
        }));

        return NextResponse.json({
            success: true,
            stats: {
                totalSalons: totalSalons || 0,
                totalSuppliers,
                verifiedSuppliers,
                pendingCount: pendingVerifications.length,
                totalProducts: totalProducts || 0
            },
            pendingVerifications
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
}

export const GET = withAuth(handler, ["super_admin"]);

