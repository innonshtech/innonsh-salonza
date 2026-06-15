import { NextResponse } from 'next/server';
import { InnonshSDK } from '@innonsh/product-sdk';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

// Initialize the SDK with your product's specific logic
const systemHandler = InnonshSDK({
  // Required: The API key the Control Center uses to authenticate
  apiKey: process.env.SYSTEM_API_KEY || 'development-secret-key', 
  
  // Optional: defaults to './product-manifest.json'
  manifestPath: './product-manifest.json',

  // Product-Specific Logic Adapters:
  onAdminCreate: async (adminData: any) => {
    console.log("Control center requested admin creation:", adminData?.email);
    try {
      await dbConnect();
      
      // Basic example of inserting an admin user into MongoDB
      const existingUser = await User.findOne({ email: adminData.email });
      if (existingUser) {
        return { success: true, userId: existingUser._id.toString(), message: "Admin already exists" };
      }

      // We might need to encrypt password or add proper roles based on your schema
      const newAdmin = new User({
        name: adminData.name || 'System Admin',
        email: adminData.email,
        password: adminData.password || 'temp-password', // Make sure to handle securely
        role: 'super_admin', // Corrected from 'super-admin'
      });

      await newAdmin.save();
      return { success: true, userId: newAdmin._id.toString() };
    } catch (error) {
      console.error("Failed to create admin:", error);
      return { success: false, error: "Database error during admin creation" };
    }
  },

  onDatabaseMigrate: async () => {
    console.log("Control center triggered database migration");
    // MongoDB typically doesn't need migrations like SQL, but you could run index creation here
    return { success: true, message: "MongoDB uses schema-less design. No migrations required." };
  }
});

// Export the generic handler for all HTTP methods you wish to support
export { systemHandler as GET, systemHandler as POST };
