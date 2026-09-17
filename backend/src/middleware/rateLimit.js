const rateLimit = require('express-rate-limit');

function limiter(windowMs, max, message) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
  });
}

// Estes limites são por IP e somam-se ao bloqueio de conta (10 tentativas / 24h)
// já aplicado por e-mail dentro da rota de login.
const loginLimiter = limiter(15 * 60 * 1000, 20, 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.');
const registerLimiter = limiter(60 * 60 * 1000, 10, 'Muitas contas criadas a partir deste endereço. Tente novamente mais tarde.');
const forgotPasswordLimiter = limiter(15 * 60 * 1000, 5, 'Muitas solicitações de redefinição. Tente novamente em alguns minutos.');

// Cada rota de token tem seu próprio limiter — antes as três compartilhavam a
// mesma instância e, portanto, o mesmo contador por IP, então esgotar o limite
// verificando um e-mail também bloqueava reset de senha e reenvio de verificação.
const verifyEmailLimiter = limiter(15 * 60 * 1000, 20, 'Muitas tentativas. Aguarde alguns minutos e tente novamente.');
const resendVerificationLimiter = limiter(15 * 60 * 1000, 20, 'Muitas tentativas. Aguarde alguns minutos e tente novamente.');
const resetPasswordLimiter = limiter(15 * 60 * 1000, 20, 'Muitas tentativas. Aguarde alguns minutos e tente novamente.');

// Formulários públicos de captação de leads — sem isso, qualquer visitante
// pode inundar a tabela de leads/newsletter com envios automatizados.
const leadsLimiter = limiter(60 * 60 * 1000, 10, 'Muitos envios a partir deste endereço. Tente novamente mais tarde.');

module.exports = {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  verifyEmailLimiter,
  resendVerificationLimiter,
  resetPasswordLimiter,
  leadsLimiter,
};
