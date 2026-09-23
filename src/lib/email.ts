import nodemailer from "nodemailer";
import { BRAND } from "./constants";
import { ContactFormData } from "./validations";

export interface SendEmailResult {
  success: boolean;
  message?: string;
  isSimulated?: boolean;
}

export function generateEmailHtml(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New House Construction Enquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 24px; color: #23201C; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 4px; overflow: hidden; border: 1px solid #DDD5C9; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #C2593F; color: #FFFFFF; padding: 28px 32px; text-align: left; }
    .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { margin: 0; font-size: 13px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 32px; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #C2593F; margin-top: 0; margin-bottom: 16px; border-bottom: 2px solid #EFE8DC; padding-bottom: 6px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .info-table td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #F0EAE1; }
    .info-table td.label { font-weight: 600; width: 35%; color: #756D65; background-color: #FAF7F2; }
    .info-table td.val { color: #23201C; }
    .message-box { background-color: #FAF7F2; border-left: 4px solid #C2593F; padding: 16px; font-size: 14px; line-height: 1.6; color: #23201C; margin-bottom: 24px; white-space: pre-wrap; }
    .footer { background-color: #1F1D1A; color: #DDD5C9; padding: 24px 32px; font-size: 12px; line-height: 1.6; }
    .footer p { margin: 4px 0; }
    .footer a { color: #C2593F; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${BRAND.name}</h1>
      <p>New House Construction Enquiry</p>
    </div>
    <div class="content">
      <h2 class="section-title">Client Information</h2>
      <table class="info-table">
        <tr>
          <td class="label">Full Name</td>
          <td class="val"><strong>${escapeHtml(data.name)}</strong></td>
        </tr>
        <tr>
          <td class="label">Phone Number</td>
          <td class="val"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="val"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
        </tr>
        <tr>
          <td class="label">Project Location</td>
          <td class="val">${escapeHtml(data.location || "Not specified")}</td>
        </tr>
        <tr>
          <td class="label">Project Type</td>
          <td class="val">${escapeHtml(data.projectType || "General Enquiry")}</td>
        </tr>
        <tr>
          <td class="label">Budget Estimate</td>
          <td class="val">${escapeHtml(data.budget || "Not decided")}</td>
        </tr>
      </table>

      <h2 class="section-title">Project Requirements & Notes</h2>
      <div class="message-box">${escapeHtml(data.message)}</div>
    </div>
    <div class="footer">
      <p><strong>${BRAND.name}</strong> — ${BRAND.tagline}</p>
      <p>Phone: ${BRAND.phone} | Email: ${BRAND.email}</p>
      <p>Address: ${BRAND.address}</p>
      <p>Website: <a href="${BRAND.siteUrl}">${BRAND.siteUrl}</a></p>
    </div>
  </div>
</body>
</html>
`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendContactEmail(data: ContactFormData): Promise<SendEmailResult> {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || "587", 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  const toEmail = process.env.CONTACT_TO_EMAIL || "contact@sthapatidesign.in";

  // If credentials are not configured or are sample placeholders, log the enquiry cleanly
  // and return success so developer testing functions without real SMTP credentials.
  if (!host || !user || !pass || host === "smtp.example.com" || user === "your-email@example.com") {
    console.log("-----------------------------------------------------------------");
    console.log("ℹ️ [Sthapati Contact Enquiry Received - Simulated Mode]");
    console.log(`From: ${data.name} <${data.email}> | Phone: ${data.phone}`);
    console.log(`Type: ${data.projectType || "N/A"} | Budget: ${data.budget || "N/A"}`);
    console.log(`Location: ${data.location || "N/A"}`);
    console.log(`Message: ${data.message}`);
    console.log("Note: Configure real SMTP in .env.local (EMAIL_HOST, EMAIL_USER, etc.) to deliver actual emails.");
    console.log("-----------------------------------------------------------------");
    return { success: true, isSimulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"${BRAND.name} Enquiries" <${user}>`,
      to: toEmail,
      replyTo: data.email,
      subject: `New House Construction Enquiry - ${data.name}`,
      html: generateEmailHtml(data),
      text: `New Enquiry from ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nLocation: ${data.location || "N/A"}\nType: ${data.projectType || "N/A"}\nBudget: ${data.budget || "N/A"}\n\nMessage:\n${data.message}`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email via SMTP:", error);
    // Never expose internal SMTP or password details to the client
    return {
      success: false,
      message: "Unable to deliver your message at this moment. Please call or WhatsApp us directly.",
    };
  }
}
