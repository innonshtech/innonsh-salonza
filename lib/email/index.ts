import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (to: string, resetUrl: string) => {
  const mailOptions = {
    from: `"Innonsh Salonza" <${process.env.SMTP_USER || 'noreply@innonsh-salonza.com'}>`,
    to,
    subject: 'Reset Your Password - Innonsh Salonza',
    html: `
      <div style="font-family: 'Google Sans', Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4F46E5; text-align: center;">Innonsh Salonza</h2>
        <h3 style="color: #333; text-align: center;">Password Reset Request</h3>
        <p style="color: #555; line-height: 1.5;">
          Hello,
          <br><br>
          We received a request to reset your password for your Innonsh Salonza account. 
          If you didn't make this request, you can safely ignore this email.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #555; line-height: 1.5;">
          This link will expire in 15 minutes.
          <br><br>
          For security reasons, this request was created from a trusted source.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Innonsh Salonza. All rights reserved.<br>
          Need help? Reply to this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending reset email:", error);
    return { success: false, error };
  }
};
