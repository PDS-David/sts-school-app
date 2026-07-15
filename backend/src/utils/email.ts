import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const to = Array.isArray(opts.to) ? opts.to.join(',') : opts.to;
  return transporter.sendMail({
    from: process.env.MAIL_FROM ?? 'noreply@sowtheseed.edu.ng',
    to,
    subject: opts.subject,
    html: opts.html,
  });
}

export async function sendAdminLogEmail(level: string, event: string, payload: unknown) {
  const recipients = (process.env.ADMIN_LOG_RECIPIENTS ?? '')
    .split(',').map(s => s.trim()).filter(Boolean);
  if (!recipients.length) return;

  await sendEmail({
    to: recipients,
    subject: `[STS School][${process.env.NODE_ENV ?? 'DEV'}] ${level} – ${event}`,
    html: `<h3 style="color:#c0392b">${event}</h3>
           <pre style="background:#f4f4f4;padding:12px">${JSON.stringify(payload, null, 2)}</pre>`,
  });
}
