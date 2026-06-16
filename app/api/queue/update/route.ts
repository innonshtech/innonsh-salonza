import { NextResponse } from "next/server";
import { QueueRepository } from "@/repositories/QueueRepository";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { id, serviceIds, serviceId } = await req.json();

        const item = await QueueRepository.findById(id);
        if (!item) return NextResponse.json({ success: false, message: "Item not found" });

        const newServiceIds = serviceIds || (serviceId ? [...(item.serviceIds || []), serviceId] : item.serviceIds);

        // Delete old services mappings
        await supabase
            .from("queue_services")
            .delete()
            .eq("queue_item_id", id);

        // Insert new services mappings
        if (newServiceIds.length > 0) {
            const joinRows = newServiceIds.map((sid: any) => ({
                queue_item_id: id,
                service_id: sid
            }));
            const { error } = await supabase.from("queue_services").insert(joinRows);
            if (error) throw error;
        }

        // Trigger a simple update on the item to update estimatedMinutes or other fields if needed, and fetch fresh model
        const updated = await QueueRepository.findById(id);

        return NextResponse.json({ success: true, item: updated });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
