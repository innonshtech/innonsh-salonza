import { NextResponse } from "next/server";
import { QueueRepository } from "@/repositories/QueueRepository";
import { BookingRepository } from "@/repositories/BookingRepository";
import { StaffRepository } from "@/repositories/StaffRepository";
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
            const staff = await StaffRepository.findById(staffId);
            if (!staff) {
                return NextResponse.json({ success: false, message: "Staff not found" }, { status: 404 });
            }
            if (staff.status === "break" || staff.status === "offline") {
                return NextResponse.json({ success: false, message: `Staff is currently on ${staff.status}` }, { status: 400 });
            }
            // Auto update staff status to busy
            await StaffRepository.update(staffId, {
              status: "busy",
              currentStatus: "busy"
            });
            logToFile(`STAFF UPDATE: Staff ${staffId} set to busy`);
        }

        const updateData: any = {
            status: "serving",
            position: 0
        };

        if (staffId) {
            updateData.staffId = staffId;
        }

        const item = await QueueRepository.update(id, updateData);

        if (!item) {
            logToFile(`API ERROR: Item not found for ID: ${id}`);
            return NextResponse.json({ success: false, message: "Item not found" });
        }

        logToFile(`API UPDATE: ID ${id} status set to ${item.status}`);

        // IMPORTANT: If this queue item is linked to a booking, update the booking status to "in-progress"
        if (item.bookingId) {
            try {
                const bookingUpdate = await BookingRepository.update(item.bookingId, {
                    status: "in-progress",
                    startedAt: new Date()
                });
                if (bookingUpdate) {
                    logToFile(`API BOOKING UPDATE: Linked booking ${item.bookingId} marked as in-progress`);
                } else {
                    logToFile(`API WARNING: Linked booking ${item.bookingId} not found`);
                }
            } catch (err: any) {
                logToFile(`API ERROR updating booking: ${err.message}`);
            }
        }

        // Re-index remaining waiting items
        const waitingItems = await QueueRepository.find({
            salonId: item.salonId
        });

        const sortedWaiting = waitingItems
            .filter((wi: any) => wi && wi.status !== "serving")
            .sort((a: any, b: any) => (a.position || 0) - (b.position || 0));

        logToFile(`API REINDEX: Found ${sortedWaiting.length} items to re-index for salon ${item.salonId}`);

        for (let i = 0; i < sortedWaiting.length; i++) {
            await QueueRepository.update(sortedWaiting[i].id, { position: i + 1 });
        }

        logToFile(`API DONE: Success for ID: ${id}`);
        return NextResponse.json({ success: true, item });
    } catch (err: any) {
        logToFile(`API CRITICAL ERROR: ${err.message}`);
        return NextResponse.json({ success: false, error: err.message });
    }
}
