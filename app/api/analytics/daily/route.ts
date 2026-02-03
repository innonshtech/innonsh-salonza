import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Sale from "@/models/Sale";
import Staff from "@/models/Staff";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const salonId = searchParams.get("salonId");

        if (!salonId) {
            return NextResponse.json({ success: false, message: "Salon ID required" });
        }

        const mongoose = require('mongoose');
        const sObjectId = new mongoose.Types.ObjectId(salonId);

        // Get today's date range (start and end of day)
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Fetch sales for today
        const rawSales = await Sale.find({
            salonId: sObjectId,
            date: { $gte: today, $lt: tomorrow }
        }).populate("serviceId", "name price").lean();

        console.log(`[Analytics Debug] Salon: ${salonId}, Range: ${today.toISOString()} - ${tomorrow.toISOString()}`);
        console.log(`[Analytics Debug] Found ${rawSales.length} records.`);

        // Normalize sales to handle both old (single service) and new ( consolidated) structures
        const normalizedSales = rawSales.map((sale: any) => {
            if (sale.services && sale.services.length > 0) {
                // New consolidated structure
                return {
                    ...sale,
                    serviceNames: sale.services.map((s: any) => s.name),
                    totalPrice: sale.finalAmount // User final price after discount
                };
            } else {
                // Old single service structure
                return {
                    ...sale,
                    serviceNames: [sale.serviceId?.name || "Unknown"],
                    totalPrice: sale.price,
                    count: 1
                };
            }
        });

        // 1. Group normalized sales by [customerName + staffId] IF they are old records
        // For new records, they are already consolidated.
        const finalSalesMap: any = {};
        normalizedSales.forEach((sale: any) => {
            // Use _id if available (new records), or a composite key for old records
            const key = sale.services ? sale._id.toString() : `${sale.customerName}-${sale.staffId || "unassigned"}`;

            if (!finalSalesMap[key]) {
                finalSalesMap[key] = { ...sale };
                if (!sale.services) {
                    finalSalesMap[key].count = 1;
                    finalSalesMap[key].serviceNames = [...sale.serviceNames];
                }
            } else if (!sale.services) {
                // Only group if it's an old record type
                finalSalesMap[key].serviceNames.push(...sale.serviceNames);
                finalSalesMap[key].totalPrice += sale.totalPrice;
                finalSalesMap[key].count += (sale.count || 1);
            }
        });
        const groupedSales = Object.values(finalSalesMap);

        // Fetch staff for names
        const staff = await Staff.find({ salonId }).lean();
        const staffMap = staff.reduce((acc: any, s: any) => {
            acc[s._id.toString()] = s.name;
            return acc;
        }, {});

        // Aggregate by staff
        const aggregation: any = {};

        // Initialize aggregation with all staff
        staff.forEach((s: any) => {
            aggregation[s._id.toString()] = {
                staffName: s.name,
                totalAmount: 0,
                customerCount: 0,
                sales: []
            };
        });

        aggregation["unassigned"] = {
            staffName: "Unassigned",
            totalAmount: 0,
            customerCount: 0,
            sales: []
        };

        groupedSales.forEach((sale: any) => {
            const sId = sale.staffId ? sale.staffId.toString() : "unassigned";
            if (!aggregation[sId]) {
                aggregation[sId] = {
                    staffName: sId === "unassigned" ? "Unassigned" : (staffMap[sId] || "Unknown"),
                    totalAmount: 0,
                    customerCount: 0,
                    sales: []
                };
            }
            aggregation[sId].totalAmount += sale.totalPrice;
            aggregation[sId].customerCount += 1;
            aggregation[sId].sales.push(sale);
        });

        const result = Object.values(aggregation);
        const totalCollection = groupedSales.reduce((sum: number, sale: any) => sum + (sale.totalPrice || 0), 0);
        const totalCash = groupedSales.reduce((sum: number, sale: any) => sum + (sale.paymentSplit?.cash || 0), 0);
        const totalOnline = groupedSales.reduce((sum: number, sale: any) => sum + (sale.paymentSplit?.online || 0), 0);
        const totalCustomers = groupedSales.length;

        return NextResponse.json({
            success: true,
            data: result,
            totalCollection,
            totalCash,
            totalOnline,
            totalCustomers
        });
    } catch (error: any) {
        console.error("Analytics error:", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
