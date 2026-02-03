import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";
import fs from "fs";
import path from "path";

function logToFile(msg: string) {
    try {
        const logPath = path.join(process.cwd(), "queue_logs.log");
        const timestamp = new Date().toISOString();
        fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
    } catch (e) {
        console.error("Failed to log to file", e);
    }
}

export async function POST(req: Request) {
    try {
        const { id, staffId } = await req.json();
        logToFile(`API START: Move to serve requested for ID: ${id}, Staff: ${staffId}`);

        const updateData: any = {
            status: "serving",
            position: 0
        };

        if (staffId) {
            updateData.staffId = staffId;
        }

        const item = await Queue.findByIdAndUpdate(id, updateData, { new: true });

        if (!item) {
            logToFile(`API ERROR: Item not found for ID: ${id}`);
            return NextResponse.json({ success: false, message: "Item not found" });
        }

        logToFile(`API UPDATE: ID ${id} status set to ${item.status}`);

        // Re-index remaining waiting items
        const waitingItems = await Queue.find({
            salonId: item.salonId,
            status: { $ne: "serving" }
        }).sort({ position: 1, createdAt: 1 });

        logToFile(`API REINDEX: Found ${waitingItems.length} items to re-index for salon ${item.salonId}`);

        for (let i = 0; i < waitingItems.length; i++) {
            // Defensive check: Ensure we don't accidentally re-index a serving item
            if (waitingItems[i].status === "serving") {
                logToFile(`API WARNING: Found serving item ${waitingItems[i]._id} in waiting list find! Skipping re-index.`);
                continue;
            }
            waitingItems[i].position = i + 1;
            await waitingItems[i].save();
        }

        logToFile(`API DONE: Success for ID: ${id}`);
        return NextResponse.json({ success: true, item });
    } catch (err: any) {
        logToFile(`API CRITICAL ERROR: ${err.message}`);
        return NextResponse.json({ success: false, error: err.message });
    }
}
