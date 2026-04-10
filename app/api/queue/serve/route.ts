import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";
import Booking from "@/models/Booking";
import Staff from "@/models/Staff";
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

        // VALIDATION: Check if staff is available
        if (staffId) {
            const staff = await Staff.findById(staffId);
            if (!staff) {
                return NextResponse.json({ success: false, message: "Staff not found" }, { status: 404 });
            }
            if (staff.status === "break" || staff.status === "offline") {
                return NextResponse.json({ success: false, message: `Staff is currently on ${staff.status}` }, { status: 400 });
            }
            // Auto update staff status to busy
            staff.status = "busy";
            (staff as any).currentStatus = "busy";
            await staff.save();
            logToFile(`STAFF UPDATE: Staff ${staffId} set to busy`);
        }

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

        // IMPORTANT: If this queue item is linked to a booking, update the booking status to "in-progress"
        if (item.bookingId) {
            try {
                const bookingUpdate = await Booking.findByIdAndUpdate(
                    item.bookingId,
                    {
                        $set: {
                            status: "in-progress",
                            startedAt: new Date()
                        }
                    },
                    { new: true }
                );
                if (bookingUpdate) {
                    logToFile(`API BOOKING UPDATE: Linked booking ${item.bookingId} marked as in-progress`);
                } else {
                    logToFile(`API WARNING: Linked booking ${item.bookingId} not found`);
                }
            } catch (err: any) {
                logToFile(`API ERROR updating booking: ${err.message}`);
                // Continue even if booking update fails - we still want to serve the customer
            }
        }

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
