import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - Khakhra Co.",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">🌾 Khakhra Co.</h2>
        <p>Your verification code is:</p>
        <h1 style="background: #fff7ed; padding: 20px; text-align: center; letter-spacing: 8px; color: #f97316;">${otp}</h1>
        <p style="color: #666;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
};
