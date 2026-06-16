import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = "postgresql://postgres:inonshsalonza%40123@db.giuryxibturikomlrnao.supabase.co:5432/postgres";

async function applySchema() {
  const schemaPath = path.join(process.cwd(), "lib", "schema.sql");
  console.log(`Reading schema from ${schemaPath}...`);
  const sql = fs.readFileSync(schemaPath, "utf8");

  console.log("Connecting to Supabase PostgreSQL database...");
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL. Running schema script...");

    // Add owner_id and email to salons table if not already present
    await client.query("ALTER TABLE salons ADD COLUMN IF NOT EXISTS owner_id UUID;");
    await client.query("ALTER TABLE salons ADD COLUMN IF NOT EXISTS email TEXT;");

    // Execute the SQL schema
    await client.query(sql);
    console.log("✅ Schema applied successfully!");
  } catch (err) {
    console.error("❌ Error applying schema:", err);
  } finally {
    await client.end();
  }
}

applySchema();
