require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3003;

app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

const send = (file) => (req, res) =>
  res.sendFile(path.join(__dirname, 'public', file));

app.get('/', send('home.html'));

// Inner-circle style pages (REI Network variants)
app.get('/reinetwork',           send('circle/Nolan TikTok.html'));
app.get('/rn',                   send('circle/Nolan Instagram.html'));
app.get('/realestatenetwork',    send('circle/Nolan Youtube.html'));
app.get('/thereinetwork',        send('circle/Zach TikTok.html'));
app.get('/reinet',               send('circle/Zach Instagram.html'));
app.get('/therealestatenetwork', send('circle/Zach Youtube.html'));

// Tools / training landing pages (REI prefix)
app.get('/reitools',      send('tools/Nolan TikTok.html'));
app.get('/reiplaybook',   send('tools/Nolan Instagram.html'));
app.get('/reiblueprint',  send('tools/Nolan Youtube.html'));
app.get('/reitraining',   send('tools/Zach TikTok.html'));
app.get('/reiresources',  send('tools/Zach Instagram.html'));
app.get('/reilaunch',     send('tools/Zach Youtube.html'));

// Application form
app.get('/apply', send('apply.html'));

// Other static pages kept from prior setup
app.get('/tools/confirm', send('confirm.html'));
app.get('/thank-you',     send('thank-you.html'));
app.get('/thank-you1',    send('thank-you1.html'));
app.get('/webinar',       send('webinar.html'));
app.get('/event',         send('webinar.html'));
app.get('/confirmation',  send('confirmation.html'));

// ── Resend email helpers ──────────────────────────────────────────────
async function sendResendEmail({ subject, html, to, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY missing');
  const recipients = to
    ? (Array.isArray(to) ? to : [to])
    : ['zachkachai07@gmail.com', 'nolan23mc@gmail.com'];
  const body = {
    from: process.env.RESEND_FROM || 'Wholesaling Elite Network <hello@wholesalingelitenetwork.com>',
    to: recipients,
    subject,
    html,
  };
  if (replyTo) body.reply_to = replyTo;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`Resend ${r.status}: ${text}`);
  return JSON.parse(text);
}

const RESOURCES_DRIVE_URL = 'https://drive.google.com/drive/folders/1IiP1v_UMGu7iBsGhH7Jwe7N7VnNdeGXd?usp=drive_link';
const LOGO_URL = 'https://wholesalingelitenetwork.com/images/logo-512.png';

function resourcesEmailHtml(firstName) {
  const name = (firstName || '').trim() || 'there';
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#09090F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#F5F5F7;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#09090F;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:560px;background:#0E0E16;border:1px solid rgba(255,255,255,0.08);border-radius:18px;overflow:hidden;">
        <tr><td align="center" style="padding:32px 24px 8px;">
          <img src="${LOGO_URL}" alt="Wholesaling Elite Network" width="160" style="display:block;border:0;outline:none;text-decoration:none;height:auto;">
        </td></tr>
        <tr><td style="padding:8px 32px 0;">
          <h1 style="margin:0;font-size:24px;font-weight:800;letter-spacing:-0.02em;color:#FFFFFF;text-align:center;">Your FREE Wholesale Real Estate Resources</h1>
        </td></tr>
        <tr><td style="padding:18px 32px 0;">
          <p style="margin:0 0 14px;font-size:15.5px;line-height:1.6;color:rgba(245,245,247,0.88);">Hey ${esc(name)},</p>
          <p style="margin:0 0 14px;font-size:15.5px;line-height:1.6;color:rgba(245,245,247,0.88);">Thanks for signing up! Here's the link to claim your free wholesale real estate resources:</p>
        </td></tr>
        <tr><td align="center" style="padding:16px 32px 8px;">
          <a href="${RESOURCES_DRIVE_URL}" style="display:inline-block;padding:14px 30px;border-radius:100px;background:linear-gradient(135deg,#F0C75E,#D4AF37);color:#1a1408;font-weight:700;font-size:15px;text-decoration:none;letter-spacing:-0.005em;">Claim My Free Resources →</a>
        </td></tr>
        <tr><td style="padding:8px 32px 24px;">
          <p style="margin:14px 0 0;font-size:13px;line-height:1.55;color:rgba(245,245,247,0.55);text-align:center;">Or paste this link into your browser:<br>
            <a href="${RESOURCES_DRIVE_URL}" style="color:#F5D77E;word-break:break-all;">${RESOURCES_DRIVE_URL}</a>
          </p>
        </td></tr>
        <tr><td style="padding:18px 32px 28px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:12px;line-height:1.55;color:rgba(245,245,247,0.45);text-align:center;">
            Wholesaling Elite LLC &nbsp;·&nbsp; wholesalingelitenetwork.com
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

function rowsHtml(fields) {
  return fields.map(([label, value]) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;font-size:13px;color:#666;font-weight:600;width:180px;">${esc(label)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;font-size:14px;color:#111;">${esc(value)}</td>
    </tr>`).join('');
}

function emailWrap(title, tableRows) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <div style="padding:18px 24px;background:linear-gradient(135deg,#D4AF37,#F0C75E);color:#1a1408;font-weight:700;font-size:16px;">
        ${esc(title)}
      </div>
      <table style="width:100%;border-collapse:collapse;">${tableRows}</table>
    </div>
  </body></html>`;
}

// ── Form submit endpoints ─────────────────────────────────────────────
app.post('/api/lead', async (req, res) => {
  try {
    const { firstName='', lastName='', phone='', email='', consent='', influencer='', source='' } = req.body || {};
    const subject = `New Lead: ${firstName} ${lastName} (${influencer || '—'} / ${source || '—'})`;
    const rows = rowsHtml([
      ['Influencer', influencer],
      ['Source',     source],
      ['First Name', firstName],
      ['Last Name',  lastName],
      ['Phone',      phone],
      ['Email',      email],
      ['Consent',    consent ? 'Yes (SMS + Email)' : 'No'],
      ['Submitted',  new Date().toISOString()],
    ]);
    await sendResendEmail({
      subject,
      html: emailWrap('New Lead — Tools Form', rows),
      replyTo: email || undefined,
    });
    // Customer-facing email with the Drive resources link
    if (email) {
      try {
        await sendResendEmail({
          subject: 'Your FREE Wholesale Real Estate Resources',
          html: resourcesEmailHtml(firstName),
          to: email,
        });
      } catch (custErr) {
        console.error('customer email failed:', custErr.message);
      }
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('lead email failed:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/application', async (req, res) => {
  try {
    const b = req.body || {};
    const subject = `New Application: ${b.firstName||''} ${b.lastName||''} (${b.influencer || '—'} / ${b.source || '—'})`;
    const rows = rowsHtml([
      ['Influencer',  b.influencer],
      ['Source',      b.source],
      ['First Name',  b.firstName],
      ['Last Name',   b.lastName],
      ['Phone',       b.phone],
      ['Email',       b.email],
      ['Age',         b.age],
      ['Experience',  b.experience],
      ['Income',      b.income],
      ['Occupation',  b.occupation],
      ['Investment',  b.investment],
      ['Submitted',   new Date().toISOString()],
    ]);
    await sendResendEmail({
      subject,
      html: emailWrap('New Application — /apply', rows),
      replyTo: b.email || undefined,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('application email failed:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/reinetwork`);
});
