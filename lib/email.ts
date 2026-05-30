import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  const from = process.env.EMAIL_FROM || '"CampusCopilot" <noreply@campuscopilot.ai>';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #4f46e5; text-align: center;">CampusCopilot Verification</h2>
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">Your CampusCopilot verification code is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111827; background-color: #f3f4f6; padding: 10px 20px; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #666;">This code expires in 10 minutes.</p>
      <p style="font-size: 14px; color: #666;">If you did not request this code, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">CampusCopilot Team</p>
    </div>
  `;

  const mailOptions = {
    from,
    to: email,
    subject: "CampusCopilot Verification Code",
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}
