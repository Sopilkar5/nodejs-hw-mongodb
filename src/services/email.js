import nodemailer from 'nodemailer';
import createError from 'http-errors';


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendResetPasswordEmail(email, token) {
  const resetLink = `${process.env.APP_DOMAIN}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };


  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw createError(500, `Failed to send the email: ${error.message}`);
  }
}

export async function testSmtpConnection() {
  try {
    await transporter.verify();
    return { success: true, message: 'SMTP connection successful' };
  } catch (error) {
    return { success: false, message: `SMTP connection failed: ${error.message}` };
  }
}
