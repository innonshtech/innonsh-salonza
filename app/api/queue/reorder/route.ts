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
        await dbConnect();
        const { items } = await req.json(); // Array of { id, position }

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ success: false, message: "Invalid items" });
        }

        logToFile(`REORDER API: Received ${items.length} items to reorder`);

        const updates = items.map(p =>
            Queue.findByIdAndUpdate(p.id, { position: p.position })
        );

        await Promise.all(updates);
        logToFile(`REORDER API: Success`);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        logToFile(`REORDER API ERROR: ${err.message}`);
        return NextResponse.json({ success: false, error: err.message });
    }
}
