import { NextResponse } from "next/server";
import { withAuth } from "@/lib/apiAuth";
import dbConnect from "@/lib/dbConnect";
import Sale from "@/models/Sale";
import Staff from "@/models/Staff";
import mongoose from "mongoose";

async function handler(req: Request, decoded: any) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "daily"; // daily, monthly, quarterly, yearly
        const dateStr = searchParams.get("date") || new Date().toISOString();
        const salonId = decoded.salonId;
        console.log(`[Revenue Analytics] Fetching for salon: ${salonId}, Type: ${type}, Date: ${dateStr}`);

        if (!salonId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const d = new Date(dateStr);
        let start: Date, end: Date;

        if (type === "daily") {
            start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
            end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
        } else if (type === "monthly") {
            start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
            end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
        } else if (type === "quarterly") {
            const quarter = Math.floor(d.getMonth() / 3);
            const startMonth = quarter * 3;
            start = new Date(d.getFullYear(), startMonth, 1, 0, 0, 0, 0);
            end = new Date(d.getFullYear(), startMonth + 3, 0, 23, 59, 59, 999);
        } else if (type === "yearly") {
            start = new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
            end = new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
        } else {
            return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
        }

        console.log(`[Revenue Analytics] Range: ${start.toISOString()} - ${end.toISOString()}`);

        // Ensure we are connected
        await dbConnect();

        const salonObjectId = new mongoose.Types.ObjectId(salonId);

        // Fetch all sales in range
        console.log("[Revenue Analytics] Querying Sales...");
        const sales = await Sale.find({
            salonId: salonObjectId,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 }).lean();
        console.log(`[Revenue Analytics] Found ${sales.length} sales.`);

        // Fetch Staff for names and grouping
        console.log("[Revenue Analytics] Querying Staff...");
        const staffList = await Staff.find({ salonId: salonObjectId }).lean();
        console.log(`[Revenue Analytics] Found ${staffList.length} staff.`);

        // Calculate Overview Stats
        const summary = sales.reduce((acc: any, sale: any) => {
            acc.totalRevenue += (sale.finalAmount || 0);
            acc.totalCash += (sale.paymentSplit?.cash || 0);
            acc.totalOnline += (sale.paymentSplit?.online || 0);
            acc.totalCustomers += 1;
            return acc;
        }, { totalRevenue: 0, totalCash: 0, totalOnline: 0, totalCustomers: 0 });

        // Map Staff for grouping names and lookup
        const staffMap = staffList.reduce((acc: any, s: any) => {
            acc[s._id.toString()] = { 
                staffName: s.name, 
                active: s.active
            };
            return acc;
        }, {});

        // Group by staff
        const staffWiseMap: any = {};
        
        // Initialize with all staff
        staffList.forEach((s: any) => {
            staffWiseMap[s._id.toString()] = {
                staffId: s._id.toString(),
                staffName: s.name,
                active: s.active,
                totalAmount: 0,
                customerCount: 0,
                sales: []
            };
        });

        // Add Unassigned bucket
        staffWiseMap["unassigned"] = {
            staffId: "unassigned",
            staffName: "Unassigned",
            active: true,
            totalAmount: 0,
            customerCount: 0,
            sales: []
        };

        sales.forEach((sale: any) => {
            const sId = sale.staffId ? sale.staffId.toString() : "unassigned";
            if (!staffWiseMap[sId]) {
                staffWiseMap[sId] = {
                    staffId: sId,
                    staffName: sId === "unassigned" ? "Unassigned" : (staffMap[sId]?.staffName || "Unknown"),
                    active: staffMap[sId]?.active !== undefined ? staffMap[sId].active : true,
                    totalAmount: 0,
                    customerCount: 0,
                    sales: []
                };
            }
            
            const normalizedSale = {
                ...sale,
                _id: sale._id.toString(),
                serviceNames: sale.services?.map((s: any) => s.name) || [sale.serviceId?.name || "Service"]
            };

            staffWiseMap[sId].totalAmount += (sale.finalAmount || 0);
            staffWiseMap[sId].customerCount += 1;
            staffWiseMap[sId].sales.push(normalizedSale);
        });

        // Convert map to array and filter out staff with 0 activity if they are unassigned
        const staffWise = Object.values(staffWiseMap).filter((s: any) => {
            if (s.staffId === "unassigned" && s.customerCount === 0) return false;
            return true;
        });

        return NextResponse.json({
            success: true,
            ...summary,
            staffWise,
            range: { start, end }
        });

    } catch (error: any) {
        console.error("Revenue Analytics Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export const GET = withAuth(handler);
