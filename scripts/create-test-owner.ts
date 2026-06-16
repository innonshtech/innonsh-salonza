import { Client } from "pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = "postgresql://postgres:inonshsalonza%40123@db.giuryxibturikomlrnao.supabase.co:5432/postgres";

async function createTestOwner() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database...");

    // 1. Fetch the role ID for salon_owner
    const roleRes = await client.query("SELECT id FROM roles WHERE name = $1", ["salon_owner"]);
    if (roleRes.rows.length === 0) {
      throw new Error("salon_owner role not found in database roles table.");
    }
    const roleId = roleRes.rows[0].id;
    console.log(`Found role 'salon_owner' with ID: ${roleId}`);

    // 2. Define test owner credentials
    const testEmail = "testowner@salonza.com";
    const testPassword = "password123";
    const name = "Test Salon Owner";

    // 3. Check if user already exists
    const userCheck = await client.query("SELECT id FROM users WHERE email = $1", [testEmail.toLowerCase()]);
    if (userCheck.rows.length > 0) {
      console.log(`User ${testEmail} already exists with ID: ${userCheck.rows[0].id}`);
      return;
    }

    // 4. Hash password using bcryptjs
    const passwordHash = await bcrypt.hash(testPassword, 10);

    // 5. Insert test owner user
    const insertRes = await client.query(
      `INSERT INTO users (name, email, password_hash, role_id, verification_status) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email`,
      [name, testEmail.toLowerCase(), passwordHash, roleId, "verified"]
    );

    const newUser = insertRes.rows[0];
    console.log("✅ Successfully created test salon owner!");
    console.log("-----------------------------------------");
    console.log(`Name:     ${newUser.name}`);
    console.log(`Email:    ${newUser.email}`);
    console.log(`Password: ${testPassword}`);
    console.log("-----------------------------------------");
  } catch (err) {
    console.error("❌ Error creating test owner:", err);
  } finally {
    await client.end();
  }
}

createTestOwner();
