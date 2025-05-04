// /helpers/mailer.ts
import nodemailer from 'nodemailer';

export const sendOTP = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"Whispr" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Whispr',
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  };

  const result = await transporter.sendMail(mailOptions);
  console.log('Email sent to :->', email);
  return result;
};
