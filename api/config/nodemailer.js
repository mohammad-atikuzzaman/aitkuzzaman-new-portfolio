import nodemailer from 'nodemailer';

// =========================================================================
// VERCEL SERVERLESS OPTIMIZED — Nodemailer Configuration
// =========================================================================
// Key optimizations:
//   1. Aggressive connection & socket timeouts (8s) to stay under Vercel's 10s limit
//   2. Connection pooling for multiple emails per invocation
//   3. Explicit TLS settings for Gmail compatibility on serverless
//   4. Retry logic with exponential backoff
//   5. Graceful failure — never crash the request if email fails
// =========================================================================

let _cachedTransporter = null;

export function createTransporter() {
  // Re-use transporter within the same serverless invocation (connection pooling)
  if (_cachedTransporter) return _cachedTransporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('⚠️ EMAIL_USER or EMAIL_PASS not configured. Email notifications will be skipped.');
    return null;
  }

  const service = process.env.EMAIL_SERVICE || 'gmail';

  // For Gmail: use direct SMTP config for more control over timeouts
  const transportConfig = service.toLowerCase() === 'gmail'
    ? {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,                  // SSL on port 465
      auth: { user, pass },
      pool: true,                    // Connection pooling for multiple sends
      maxConnections: 2,             // Limit for serverless (low memory)
      maxMessages: 5,                // Max messages per connection
      connectionTimeout: 8000,       // 8s — must finish before Vercel's 10s timeout
      greetingTimeout: 8000,
      socketTimeout: 8000,
      tls: {
        rejectUnauthorized: true,    // Verify server certificate
        minVersion: 'TLSv1.2',
      },
    }
    : {
      service,
      auth: { user, pass },
      pool: true,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    };

  _cachedTransporter = nodemailer.createTransport(transportConfig);
  return _cachedTransporter;
}

// Retry wrapper with exponential backoff — handles transient SMTP failures on serverless
async function sendWithRetry(mailOptions, maxRetries = 2) {
  const transporter = createTransporter();
  if (!transporter) return { success: false, reason: 'unconfigured' };

  let lastError;
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ [EMAIL] Attempt ${attempt}/${maxRetries + 1} failed: ${err.message}`);

      // Don't retry on auth errors or invalid recipient — those won't fix themselves
      if (err.responseCode === 535 || err.responseCode === 550) {
        break;
      }

      if (attempt <= maxRetries) {
        // Exponential backoff: 500ms, 1000ms
        const delay = 500 * attempt;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Reset cached transporter on connection errors (force fresh connection)
        if (err.code === 'ESOCKET' || err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT') {
          _cachedTransporter = null;
        }
      }
    }
  }

  console.error(`❌ [EMAIL] All ${maxRetries + 1} attempts failed:`, lastError.message);
  return { success: false, reason: lastError.message };
}

export async function sendNotificationEmail({ name, email, project, message }) {
  const recipient = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
    to: recipient,
    replyTo: email,
    subject: `🚀 New Project Inquiry from ${name}`,
    html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>New Inquiry</title>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  <!-- Wrapper -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <!-- Main Card -->
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; border:1px solid #000000; background-color:#ffffff;">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#000000" style="background-color:#000000; padding:44px 24px 36px;">
              <h1 style="margin:0; color:#ffffff; font-family:Georgia, 'Times New Roman', serif; font-size:26px; font-weight:normal; letter-spacing:4px; text-transform:uppercase; line-height:1.2;">
                New Inquiry
              </h1>

              <!-- Divider -->
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin:18px auto;">
                <tr>
                  <td width="40" style="border-top:1px solid #ffffff; font-size:0; line-height:0; height:1px;">&nbsp;</td>
                </tr>
              </table>

              <p style="margin:0; color:#b3b3b3; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase;">
                From Portfolio Contact Form
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff; padding:40px 32px;">

              <p style="margin:0 0 26px; color:#333333; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px;">
                You've received a new message through your portfolio contact form. Here are the details:
              </p>

              <!-- Details Table -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">

                <!-- Client Name -->
                <tr>
                  <td width="130" valign="top" style="padding:14px 12px 14px 0; border-top:1px solid #e5e5e5; color:#666666; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase;">
                    Client Name
                  </td>
                  <td valign="top" style="padding:14px 0; border-top:1px solid #e5e5e5; color:#000000; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:22px;">
                    <strong>${name}</strong>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td width="130" valign="top" style="padding:14px 12px 14px 0; border-top:1px solid #e5e5e5; color:#666666; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase;">
                    Email
                  </td>
                  <td valign="top" style="padding:14px 0; border-top:1px solid #e5e5e5; color:#000000; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:22px;">
                    <a href="mailto:${email}" style="color:#000000; text-decoration:underline;">${email}</a>
                  </td>
                </tr>

                ${project ? `
                <!-- Project -->
                <tr>
                  <td width="130" valign="top" style="padding:14px 12px 14px 0; border-top:1px solid #e5e5e5; color:#666666; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase;">
                    Project
                  </td>
                  <td valign="top" style="padding:14px 0; border-top:1px solid #e5e5e5; color:#000000; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:22px;">
                    ${project}
                  </td>
                </tr>` : ''}

                ${message ? `
                <!-- Message -->
                <tr>
                  <td width="130" valign="top" style="padding:14px 12px 14px 0; border-top:1px solid #e5e5e5; color:#666666; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase;">
                    Message
                  </td>
                  <td valign="top" style="padding:14px 0; border-top:1px solid #e5e5e5; color:#000000; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px; white-space:pre-wrap;">
                    ${message}
                  </td>
                </tr>` : ''}

                <!-- Bottom border for table -->
                <tr>
                  <td colspan="2" style="border-top:1px solid #e5e5e5; font-size:0; line-height:0; height:1px;">&nbsp;</td>
                </tr>

              </table>

              <!-- Reply CTA -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin-top:30px;">
                <tr>
                  <td align="center" bgcolor="#000000" style="background-color:#000000; border-radius:0;">
                    <a href="mailto:${email}" style="display:inline-block; padding:14px 32px; color:#ffffff; font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:bold; letter-spacing:2px; text-transform:uppercase; text-decoration:none;">
                      Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#000000" style="background-color:#000000; padding:20px 24px;">
              <p style="margin:0; color:#999999; font-family:Arial, Helvetica, sans-serif; font-size:11px; line-height:16px; letter-spacing:0.5px;">
                Sent from your portfolio contact form &mdash; do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Main Card -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>
    `,
  };

  return sendWithRetry(mailOptions);
}

export async function sendThankYouEmail({ name, email, project }) {
  const senderName = process.env.PORTFOLIO_NAME || 'Atikuzzaman Akash';

  const mailOptions = {
    from: `"${senderName}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thank you for reaching out, ${name}! 🙏`,
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Thank You</title>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  <!-- Wrapper -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <!-- Main Card -->
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; border:1px solid #000000; background-color:#ffffff;">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#000000" style="background-color:#000000; padding:44px 24px 36px;">
              <h1 style="margin:0; color:#ffffff; font-family:Georgia, 'Times New Roman', serif; font-size:26px; font-weight:normal; letter-spacing:4px; text-transform:uppercase; line-height:1.2;">
                Thank You
              </h1>

              <!-- Divider -->
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin:18px auto;">
                <tr>
                  <td width="40" style="border-top:1px solid #ffffff; font-size:0; line-height:0; height:1px;">&nbsp;</td>
                </tr>
              </table>

              <p style="margin:0; color:#b3b3b3; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase;">
                Message Received
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff; padding:40px 32px;">

              <p style="margin:0 0 22px; color:#000000; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:25px;">
                Hi <strong>${name}</strong>,
              </p>

              <p style="margin:0 0 20px; color:#333333; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:25px;">
                Thank you for getting in touch. I've received your inquiry${project ? ` regarding <strong style="color:#000000;">&ldquo;${project}&rdquo;</strong>` : ''} and I'm looking forward to learning more about your needs.
              </p>

              <p style="margin:0 0 30px; color:#333333; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:25px;">
                I typically respond within <strong style="color:#000000;">24&ndash;48 hours</strong>. In the meantime, feel free to explore my portfolio to see more of my work.
              </p>

              <!-- Divider -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #000000; font-size:0; line-height:0; height:1px;">&nbsp;</td>
                </tr>
              </table>

              <p style="margin:26px 0 10px; color:#333333; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:25px;">
                Looking forward to connecting with you.
              </p>

              <p style="margin:0; color:#000000; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px; font-weight:bold;">
                Best regards,<br />
                <span style="font-weight:normal; color:#000000;">${senderName}</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#000000" style="background-color:#000000; padding:20px 24px;">
              <p style="margin:0; color:#999999; font-family:Arial, Helvetica, sans-serif; font-size:11px; line-height:16px; letter-spacing:0.5px;">
                This is an automated confirmation. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Main Card -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>`,
  };

  return sendWithRetry(mailOptions);
}
