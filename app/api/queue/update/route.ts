import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { id, serviceIds, serviceId } = await req.json();

        const item = await Queue.findById(id);
        if (!item) return NextResponse.json({ success: false, message: "Item not found" });

        const newServiceIds = serviceIds || (serviceId ? [...(item.serviceIds || []), serviceId] : item.serviceIds);

        const updated = await Queue.findByIdAndUpdate(id, {
            serviceIds: newServiceIds,
            serviceId: newServiceIds[0] // sync old field
        }, { new: true });

        return NextResponse.json({ success: true, item: updated });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
