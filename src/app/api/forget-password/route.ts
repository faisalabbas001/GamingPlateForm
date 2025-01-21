import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect"; // MongoDB connection
import { User } from "@/model/User"; // User model
import crypto from "crypto"; // For generating secure tokens
import nodemailer from "nodemailer"; // For sending emails
import bcrypt from "bcryptjs"; // For hashing passwords

interface ForgetPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  tokenValue: string;
  newPassword: string;
  confirmPassword: string;
}

const forgetPassword = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as ForgetPasswordRequest;

    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json({ error: "Invalid or missing email." }, { status: 400 });
    }

    await mongooseConnect();

    const user = await User.findOne({ email: body.email });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 900000;  // 15 minutes validity

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    const resetLink = `${process.env.DOMAIN_URL}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"GamingPlateForm" <no-reply@gamingplatform.com>',
      to: body.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f7fa; border-radius: 8px; width: 100%; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #4A4A4A; font-size: 24px; text-align: center;">Password Reset Request</h2>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">Hi there,</p>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">We received a request to reset the password for your account. If you didn't make this request, please ignore this email, and your password will remain unchanged.</p>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">To reset your password, click the button below:</p>
            <div style="text-align: center;">
              <a href="${resetLink}" style="background-color: #9333EA; color: white; font-size: 16px; padding: 12px 30px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold;">Reset Your Password</a>
            </div>
            <p style="color: #555555; font-size: 16px; line-height: 1.5; text-align: center; margin-top: 20px;">This link will expire in 15 minutes. If you did not request a password reset, please disregard this email.</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #777777; font-size: 14px; text-align: center;">If you have any questions, feel free to reach out to us at support@gamingplatform.com.</p>
          </div>
        </div>
      `,
    });
    
    
    return NextResponse.json({ message: "Password reset email sent." }, { status: 200 });
  } catch (error) {
    console.error("Error in forget password:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
};

const resetPassword = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as ResetPasswordRequest;
    console.log("token",body)

    if (!body.tokenValue || !body.newPassword || !body.confirmPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (body.newPassword !== body.confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    await mongooseConnect();

    const user = await User.findOne({
      resetPasswordToken: body.tokenValue,
      resetPasswordExpire: { $gt: Date.now() },
    });
console.log(user);
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error in reset password:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
};

export { forgetPassword as POST, resetPassword as PATCH };
