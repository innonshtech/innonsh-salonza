import { NextResponse } from 'next/server';
import crypto from 'crypto';
import User from '@/models/User';
import mongoose from 'mongoose';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const user = await User.findOne({ email });

    // Always return a success message to prevent email enumeration
    if (!user) {
      return NextResponse.json({ 
        message: 'If the account exists, a password reset email has been sent.' 
      }, { status: 200 });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token for saving in DB
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiry to 15 minutes
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    
    await user.save();

    // Create reset url (needs domain from env, fallback to origin if possible, but NextRequest allows getting origin)
    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${origin}/reset-password/${resetToken}`;

    const emailResult = await sendPasswordResetEmail(user.email, resetUrl);

    if (!emailResult.success) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return NextResponse.json({ message: 'Email could not be sent' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'If the account exists, a password reset email has been sent.' 
    }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
