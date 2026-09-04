const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, PUBLIC_URL } = process.env;
const smtpConfigured = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter = null;
if (smtpConfigured) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function buildResetLink(token) {
  const baseUrl = (PUBLIC_URL || 'http://localhost:3000').replace(/\/$/, '');
  return `${baseUrl}/?reset=${token}`;
}

async function sendPasswordResetEmail(toEmail, token) {
  const link = buildResetLink(token);

  if (!transporter) {
    console.warn(
      '[aviso] SMTP não configurado (defina SMTP_HOST, SMTP_USER e SMTP_PASS no .env) — ' +
      'o e-mail de redefinição não foi enviado, apenas registrado abaixo:\n' +
      `Link de redefinição para ${toEmail}: ${link}`
    );
    return;
  }

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to: toEmail,
    subject: 'Redefinição de senha — Dinheiro chama dinheiro?',
    text:
      'Recebemos um pedido para redefinir sua senha.\n\n' +
      `Acesse o link abaixo (válido por 1 hora):\n${link}\n\n` +
      'Se você não pediu isso, ignore este e-mail.',
  });
}

module.exports = { sendPasswordResetEmail };
