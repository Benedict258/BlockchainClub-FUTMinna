import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Blockchain Club FUTMINNA <noreply@futminna.club>";
const SITE_URL = process.env.SITE_URL || "https://futminna.club";

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verifyUrl = `${SITE_URL}/auth/verify?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verify your email — Blockchain Club FUTMINNA",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 20px; margin-bottom: 16px;">Verify your email</h1>
        <p style="color: #555; line-height: 1.6;">
          Click the button below to verify your email address and activate your account.
        </p>
        <a href="${verifyUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #999; font-size: 12px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to Blockchain Club FUTMINNA! 🎉",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 20px; margin-bottom: 16px;">Welcome, ${name}!</h1>
        <p style="color: #555; line-height: 1.6;">
          Your account is now active. You're part of FUTMinna's premier Web3 community.
        </p>
        <a href="${SITE_URL}/dashboard" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0;">
          Go to Dashboard
        </a>
        <p style="color: #555; line-height: 1.6;">
          Explore projects, join events, and connect with fellow builders.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetUrl = `${SITE_URL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your password — Blockchain Club FUTMINNA",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 20px; margin-bottom: 16px;">Reset your password</h1>
        <p style="color: #555; line-height: 1.6;">
          Click the button below to set a new password for your account.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 12px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
