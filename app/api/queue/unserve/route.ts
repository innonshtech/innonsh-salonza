import { NextResponse } from "next/server";
import { QueueRepository } from "@/repositories/QueueRepository";
import { StaffRepository } from "@/repositories/StaffRepository";

export async function POST(req: Request) {
    try {
        const { id } = await req.json();

        // 1. Get the item first to know its salonId
        const itemToUnserve = await QueueRepository.findById(id);
        if (!itemToUnserve) {
            return NextResponse.json({ success: false, message: "Item not found" });
        }

        // 2. Find the last position in waiting list for THIS salon
        const lastItemInWaiting = await QueueRepository.findOne({
            salonId: itemToUnserve.salonId,
            status: "waiting",
            sort: { position: -1 }
        });

        const nextPosition = lastItemInWaiting ? lastItemInWaiting.position + 1 : 1;

        // 3. Update the item (unset staffId by passing null)
        const staffIdToReset = itemToUnserve.staffId;
        const updatedItem = await QueueRepository.update(id, {
            status: "waiting",
            position: nextPosition,
            staffId: undefined // Sets to null in PG
        });

        // 4. Reset Staff Status
        if (staffIdToReset) {
            await StaffRepository.update(staffIdToReset, {
                status: "available",
                currentStatus: "available"
            });
        }

        return NextResponse.json({ success: true, item: updatedItem });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
