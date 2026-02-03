import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { id } = await req.json();

        // 1. Get the item first to know its salonId
        const itemToUnserve = await Queue.findById(id);
        if (!itemToUnserve) {
            return NextResponse.json({ success: false, message: "Item not found" });
        }

        // 2. Find the last position in waiting list for THIS salon
        const lastItemInWaiting = await Queue.findOne({
            salonId: itemToUnserve.salonId,
            status: "waiting"
        }).sort({ position: -1 });

        const nextPosition = lastItemInWaiting ? lastItemInWaiting.position + 1 : 1;

        // 3. Update the item
        const updatedItem = await Queue.findByIdAndUpdate(id, {
            status: "waiting",
            position: nextPosition,
            $unset: { staffId: 1 }
        }, { new: true });

        return NextResponse.json({ success: true, item: updatedItem });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
