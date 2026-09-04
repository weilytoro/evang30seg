const API_BASE = '/api';
const TOKEN_KEY = 'dcd_token';

let authToken = localStorage.getItem(TOKEN_KEY);
let currentUser = null;
let authMode = 'login'; // 'login' | 'register' | 'forgot' | 'reset'
let resetToken = null;

const MESES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

function formatDateLabel(value) {
  if (!value) return '';
  const iso = value.indexOf('T') === -1 ? value.replace(' ', 'T') + 'Z' : value;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.getDate().toString().padStart(2, '0') + ' ' + MESES[d.getMonth()];
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

async function api(path, options) {
  options = options || {};
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  if (authToken) headers.Authorization = 'Bearer ' + authToken;

  const res = await fetch(API_BASE + path, Object.assign({}, options, { headers: headers }));
  let body = null;
  try { body = await res.json(); } catch (e) { /* sem corpo de resposta */ }

  if (!res.ok) {
    const message = (body && body.error) || 'Ocorreu um erro. Tente novamente.';
    throw new Error(message);
  }
  return body;
}

// Elements
const loginTrigger = document.getElementById('login-trigger');
const loginOverlay = document.getElementById('login-overlay');
const closeModal = document.getElementById('close-modal');
const loginForm = document.getElementById('login-form');
const userBadge = document.getElementById('user-badge');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userRole = document.getElementById('user-role');
const logoutBtn = document.getElementById('logout-btn');
const verifyBanner = document.getElementById('verify-banner');
const resendVerificationLink = document.getElementById('resend-verification-link');

const modalTitle = document.getElementById('modal-title');
const modalSub = document.getElementById('modal-sub');
const nameField = document.getElementById('name-field');
const loginNameInput = document.getElementById('login-name');
const emailField = document.getElementById('email-field');
const loginEmailInput = document.getElementById('login-email');
const passwordField = document.getElementById('password-field');
const passwordLabel = document.getElementById('password-label');
const loginPasswordInput = document.getElementById('login-password');
const passwordConfirmField = document.getElementById('password-confirm-field');
const loginPasswordConfirmInput = document.getElementById('login-password-confirm');
const forgotPasswordWrap = document.getElementById('forgot-password-wrap');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const authMessage = document.getElementById('auth-message');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const toggleAuthModeBtn = document.getElementById('toggle-auth-mode');

const publishLocked = document.getElementById('publish-locked');
const publishForm = document.getElementById('publish-form');
const publishLoginLink = document.getElementById('publish-login-link');
const postsList = document.getElementById('posts-list');
const confirmMsg = document.getElementById('confirm-msg');

const addProductTrigger = document.getElementById('add-product-trigger');
const shopLockedNote = document.getElementById('shop-locked-note');
const productForm = document.getElementById('product-form');
const shopLoginLink = document.getElementById('shop-login-link');
const shopGrid = document.getElementById('shop-grid');

const addMediaTrigger = document.getElementById('add-media-trigger');
const mediaLockedNote = document.getElementById('media-locked-note');
const mediaForm = document.getElementById('media-form');
const mediaLoginLink = document.getElementById('media-login-link');
const mediaGrid = document.getElementById('media-grid');

const addEventTrigger = document.getElementById('add-event-trigger');
const eventsLockedNote = document.getElementById('events-locked-note');
const eventForm = document.getElementById('event-form');
const eventsLoginLink = document.getElementById('events-login-link');
const eventsGrid = document.getElementById('events-grid');

const aboutEditTrigger = document.getElementById('about-edit-trigger');
const aboutText = document.getElementById('about-text');
const aboutForm = document.getElementById('about-form');
const aboutTextarea = document.getElementById('about-textarea');

const contactEditTrigger = document.getElementById('contact-edit-trigger');
const contactForm = document.getElementById('contact-form');
const contactInstagram = document.getElementById('contact-instagram');
const contactEmail = document.getElementById('contact-email');
const contactPhone = document.getElementById('contact-phone');
const contactEmptyMsg = document.getElementById('contact-empty-msg');
const contactItemInstagram = document.getElementById('contact-item-instagram');
const contactItemEmail = document.getElementById('contact-item-email');
const contactItemPhone = document.getElementById('contact-item-phone');

function isAdmin() { return !!currentUser && currentUser.role === 'admin'; }
function isLoggedIn() { return !!currentUser; }

function showAuthMessage(text, type) {
  authMessage.textContent = text;
  authMessage.style.color = type === 'info' ? 'var(--gold-deep)' : '#B23A2E';
  authMessage.style.display = text ? 'block' : 'none';
}

function openLogin(e) {
  if (e) e.preventDefault();
  setAuthMode(resetToken ? 'reset' : 'login');
  loginOverlay.classList.add('show');
}

function closeLogin() {
  loginOverlay.classList.remove('show');
}

function setAuthMode(mode) {
  authMode = mode;
  showAuthMessage('', 'error');
  loginForm.reset();

  nameField.classList.add('hide');
  loginNameInput.required = false;

  emailField.classList.remove('hide');
  loginEmailInput.required = true;

  passwordField.classList.remove('hide');
  loginPasswordInput.required = true;
  passwordLabel.textContent = 'Senha';

  passwordConfirmField.classList.add('hide');
  loginPasswordConfirmInput.required = false;

  forgotPasswordWrap.classList.add('hide');

  if (mode === 'register') {
    modalTitle.textContent = 'Criar conta';
    modalSub.textContent = 'Crie sua conta para publicar conteúdo e gerenciar a loja.';
    nameField.classList.remove('hide');
    loginNameInput.required = true;
    authSubmitBtn.textContent = 'Cadastrar';
    toggleAuthModeBtn.textContent = 'Já tem conta? Entrar';
    toggleAuthModeBtn.classList.remove('hide');
  } else if (mode === 'forgot') {
    modalTitle.textContent = 'Esqueci minha senha';
    modalSub.textContent = 'Informe seu e-mail e enviaremos um link para redefinir sua senha.';
    passwordField.classList.add('hide');
    loginPasswordInput.required = false;
    authSubmitBtn.textContent = 'Enviar instruções';
    toggleAuthModeBtn.textContent = 'Voltar para login';
    toggleAuthModeBtn.classList.remove('hide');
  } else if (mode === 'reset') {
    modalTitle.textContent = 'Definir nova senha';
    modalSub.textContent = 'Escolha uma nova senha para sua conta.';
    emailField.classList.add('hide');
    loginEmailInput.required = false;
    passwordLabel.textContent = 'Nova senha';
    passwordConfirmField.classList.remove('hide');
    loginPasswordConfirmInput.required = true;
    authSubmitBtn.textContent = 'Redefinir senha';
    toggleAuthModeBtn.textContent = 'Cancelar';
    toggleAuthModeBtn.classList.remove('hide');
  } else {
    modalTitle.textContent = 'Entrar';
    modalSub.textContent = 'Acesse sua conta para publicar conteúdo e gerenciar a loja.';
    authSubmitBtn.textContent = 'Entrar';
    toggleAuthModeBtn.textContent = 'Não tem conta? Criar conta';
    toggleAuthModeBtn.classList.remove('hide');
    forgotPasswordWrap.classList.remove('hide');
  }
}

function updateUserBadge() {
  if (isLoggedIn()) {
    userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    userName.textContent = currentUser.name;
    userRole.textContent = isAdmin() ? 'Administrador' : 'Usuário';
    userBadge.classList.add('show');
    loginTrigger.classList.add('hide');
    verifyBanner.classList.toggle('hide', !!currentUser.emailVerified);
  } else {
    userBadge.classList.remove('show');
    loginTrigger.classList.remove('hide');
    verifyBanner.classList.add('hide');
  }
}

resendVerificationLink.addEventListener('click', async function (e) {
  e.preventDefault();
  try {
    await api('/auth/resend-verification', { method: 'POST' });
    alert('E-mail de verificação reenviado. Confira sua caixa de entrada.');
  } catch (err) {
    alert(err.message);
  }
});

function updateAccessUI() {
  if (isAdmin()) {
    publishLocked.classList.add('hide');
    publishForm.classList.remove('hide');

    shopLockedNote.classList.add('hide');
    addProductTrigger.classList.remove('hide');

    mediaLockedNote.classList.add('hide');
    addMediaTrigger.classList.remove('hide');

    eventsLockedNote.classList.add('hide');
    addEventTrigger.classList.remove('hide');

    aboutEditTrigger.classList.remove('hide');
    contactEditTrigger.classList.remove('hide');
  } else {
    publishLocked.classList.remove('hide');
    publishForm.classList.add('hide');

    shopLockedNote.classList.remove('hide');
    addProductTrigger.classList.add('hide');
    productForm.classList.add('hide');

    mediaLockedNote.classList.remove('hide');
    addMediaTrigger.classList.add('hide');
    mediaForm.classList.add('hide');

    eventsLockedNote.classList.remove('hide');
    addEventTrigger.classList.add('hide');
    eventForm.classList.add('hide');

    aboutEditTrigger.classList.add('hide');
    aboutForm.classList.add('hide');
    aboutText.classList.remove('hide');

    contactEditTrigger.classList.add('hide');
    contactForm.classList.add('hide');
  }
}

loginTrigger.addEventListener('click', openLogin);
closeModal.addEventListener('click', closeLogin);
publishLoginLink.addEventListener('click', openLogin);
shopLoginLink.addEventListener('click', openLogin);
mediaLoginLink.addEventListener('click', openLogin);
eventsLoginLink.addEventListener('click', openLogin);

loginOverlay.addEventListener('click', function (e) {
  if (e.target === loginOverlay) closeLogin();
});

forgotPasswordLink.addEventListener('click', function (e) {
  e.preventDefault();
  setAuthMode('forgot');
});

toggleAuthModeBtn.addEventListener('click', function () {
  if (authMode === 'login') {
    setAuthMode('register');
  } else if (authMode === 'reset') {
    resetToken = null;
    clearResetQueryParam();
    setAuthMode('login');
  } else {
    setAuthMode('login');
  }
});

loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  showAuthMessage('', 'error');

  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value;

  try {
    if (authMode === 'register') {
      const name = loginNameInput.value.trim();
      const data = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: name, email: email, password: password }),
      });
      onAuthenticated(data);
    } else if (authMode === 'login') {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email, password: password }),
      });
      onAuthenticated(data);
    } else if (authMode === 'forgot') {
      const data = await api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: email }) });
      showAuthMessage(data.message || 'Se este e-mail estiver cadastrado, enviamos instruções.', 'info');
    } else if (authMode === 'reset') {
      const confirmPassword = loginPasswordConfirmInput.value;
      if (password !== confirmPassword) {
        showAuthMessage('As senhas não coincidem.', 'error');
        return;
      }
      await api('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken, password: password }),
      });
      resetToken = null;
      clearResetQueryParam();
      setAuthMode('login');
      showAuthMessage('Senha redefinida com sucesso. Faça login com a nova senha.', 'info');
    }
  } catch (err) {
    showAuthMessage(err.message, 'error');
  }
});

function onAuthenticated(data) {
  authToken = data.token;
  currentUser = data.user;
  localStorage.setItem(TOKEN_KEY, authToken);

  updateUserBadge();
  updateAccessUI();

  loginForm.reset();
  closeLogin();
}

function clearResetQueryParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete('reset');
  window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
}

logoutBtn.addEventListener('click', function () {
  authToken = null;
  currentUser = null;
  localStorage.removeItem(TOKEN_KEY);
  updateUserBadge();
  updateAccessUI();
});

async function restoreSession() {
  if (!authToken) return;
  try {
    const data = await api('/auth/me');
    currentUser = data.user;
    updateUserBadge();
    updateAccessUI();
  } catch (err) {
    authToken = null;
    localStorage.removeItem(TOKEN_KEY);
  }
}

// Publicações
function renderPosts(posts) {
  postsList.innerHTML = '';
  if (!posts.length) {
    const p = document.createElement('p');
    p.className = 'sub';
    p.id = 'empty-msg';
    p.innerHTML = 'Nenhuma publicação ainda. Use o formulário de <a href="#publicar">Publicar</a> para adicionar a primeira.';
    postsList.appendChild(p);
    return;
  }
  posts.forEach(function (post) {
    const article = document.createElement('article');
    article.className = 'post-row';
    article.innerHTML =
      '<div class="date">' + formatDateLabel(post.created_at) + '</div>' +
      '<div>' +
        '<h3><a href="#">' + escapeHtml(post.title) + '</a></h3>' +
        '<p class="excerpt">' + escapeHtml(post.excerpt) + '</p>' +
      '</div>' +
      '<div class="cat">' + escapeHtml(post.category) + '</div>';
    postsList.appendChild(article);
  });
}

async function loadPosts() {
  const data = await api('/posts');
  renderPosts(data.posts);
}

publishForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  if (!isAdmin()) return;

  const title = document.getElementById('title').value.trim();
  const category = document.getElementById('category').value;
  const excerpt = document.getElementById('excerpt').value.trim();
  if (!title || !excerpt) return;

  try {
    await api('/posts', { method: 'POST', body: JSON.stringify({ title: title, category: category, excerpt: excerpt }) });
    await loadPosts();
    publishForm.reset();
    confirmMsg.classList.add('show');
    setTimeout(function () { confirmMsg.classList.remove('show'); }, 3000);
  } catch (err) {
    alert(err.message);
  }
});

// Shop
function renderProducts(products) {
  shopGrid.innerHTML = '';
  if (!products.length) {
    const div = document.createElement('div');
    div.className = 'shop-empty';
    div.id = 'shop-empty-msg';
    div.textContent = 'Nenhum produto disponível no momento.';
    shopGrid.appendChild(div);
    return;
  }
  products.forEach(function (product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML =
      '<div class="thumb"></div>' +
      '<div class="info">' +
        '<h4>' + escapeHtml(product.name) + '</h4>' +
        '<div class="price">' + escapeHtml(product.price) + '</div>' +
        '<div class="desc">' + escapeHtml(product.description) + '</div>' +
      '</div>';
    shopGrid.appendChild(card);
  });
}

async function loadProducts() {
  const data = await api('/products');
  renderProducts(data.products);
}

addProductTrigger.addEventListener('click', function () {
  productForm.classList.toggle('hide');
});

productForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  if (!isAdmin()) return;

  const name = document.getElementById('product-name').value.trim();
  const price = document.getElementById('product-price').value.trim();
  const desc = document.getElementById('product-desc').value.trim();
  if (!name || !price || !desc) return;

  try {
    await api('/products', { method: 'POST', body: JSON.stringify({ name: name, price: price, description: desc }) });
    await loadProducts();
    productForm.reset();
    productForm.classList.add('hide');
  } catch (err) {
    alert(err.message);
  }
});

// Vídeos e Podcasts
function renderMedia(items) {
  mediaGrid.innerHTML = '';
  if (!items.length) {
    const div = document.createElement('div');
    div.className = 'media-empty';
    div.id = 'media-empty-msg';
    div.textContent = 'Nenhum vídeo ou podcast disponível no momento.';
    mediaGrid.appendChild(div);
    return;
  }
  items.forEach(function (item) {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.innerHTML =
      '<span class="media-type">' + escapeHtml(item.type) + '</span>' +
      '<h4>' + escapeHtml(item.title) + '</h4>' +
      '<div class="desc">' + escapeHtml(item.description) + '</div>' +
      '<a class="media-link" href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener">Assistir / Ouvir →</a>';
    mediaGrid.appendChild(card);
  });
}

async function loadMedia() {
  const data = await api('/media');
  renderMedia(data.media);
}

addMediaTrigger.addEventListener('click', function () {
  mediaForm.classList.toggle('hide');
});

mediaForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  if (!isAdmin()) return;

  const title = document.getElementById('media-title').value.trim();
  const type = document.getElementById('media-type').value;
  const link = document.getElementById('media-link').value.trim();
  const desc = document.getElementById('media-desc').value.trim();
  if (!title || !link || !desc) return;

  try {
    await api('/media', { method: 'POST', body: JSON.stringify({ title: title, type: type, link: link, description: desc }) });
    await loadMedia();
    mediaForm.reset();
    mediaForm.classList.add('hide');
  } catch (err) {
    alert(err.message);
  }
});

// Eventos
function renderEvents(events) {
  eventsGrid.innerHTML = '';
  if (!events.length) {
    const div = document.createElement('div');
    div.className = 'events-empty';
    div.id = 'events-empty-msg';
    div.textContent = 'Nenhum evento agendado no momento.';
    eventsGrid.appendChild(div);
    return;
  }
  events.forEach(function (ev) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML =
      '<div class="event-date">' + escapeHtml(ev.event_date) + '</div>' +
      '<div>' +
        '<h4>' + escapeHtml(ev.title) + '</h4>' +
        '<div class="event-location">' + escapeHtml(ev.location) + '</div>' +
        '<div class="desc">' + escapeHtml(ev.description) + '</div>' +
      '</div>';
    eventsGrid.appendChild(card);
  });
}

async function loadEvents() {
  const data = await api('/events');
  renderEvents(data.events);
}

addEventTrigger.addEventListener('click', function () {
  eventForm.classList.toggle('hide');
});

eventForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  if (!isAdmin()) return;

  const title = document.getElementById('event-title').value.trim();
  const date = document.getElementById('event-date').value.trim();
  const location = document.getElementById('event-location').value.trim();
  const desc = document.getElementById('event-desc').value.trim();
  if (!title || !date || !location || !desc) return;

  try {
    await api('/events', { method: 'POST', body: JSON.stringify({ title: title, date: date, location: location, description: desc }) });
    await loadEvents();
    eventForm.reset();
    eventForm.classList.add('hide');
  } catch (err) {
    alert(err.message);
  }
});

// Sobre nós (admin)
function renderSiteAbout(about) {
  aboutText.textContent = about || 'Texto a ser definido.';
}

aboutEditTrigger.addEventListener('click', function () {
  aboutTextarea.value = aboutText.textContent;
  aboutText.classList.add('hide');
  aboutForm.classList.remove('hide');
});

aboutForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  if (!isAdmin()) return;

  const newText = aboutTextarea.value.trim();
  if (!newText) return;

  try {
    const data = await api('/site/about', { method: 'PUT', body: JSON.stringify({ text: newText }) });
    renderSiteAbout(data.about);
    aboutText.classList.remove('hide');
    aboutForm.classList.add('hide');
  } catch (err) {
    alert(err.message);
  }
});

// Contato (admin)
function renderSiteContact(contact) {
  const any = contact.instagram || contact.email || contact.phone;
  contactEmptyMsg.classList.toggle('hide', !!any);

  if (contact.instagram) {
    contactInstagram.textContent = contact.instagram;
    contactInstagram.href = 'https://instagram.com/' + contact.instagram.replace('@', '');
    contactItemInstagram.classList.remove('hide');
  } else {
    contactItemInstagram.classList.add('hide');
  }

  if (contact.email) {
    contactEmail.textContent = contact.email;
    contactEmail.href = 'mailto:' + contact.email;
    contactItemEmail.classList.remove('hide');
  } else {
    contactItemEmail.classList.add('hide');
  }

  if (contact.phone) {
    contactPhone.textContent = contact.phone;
    contactItemPhone.classList.remove('hide');
  } else {
    contactItemPhone.classList.add('hide');
  }
}

contactEditTrigger.addEventListener('click', function () {
  document.getElementById('contact-instagram-input').value = contactInstagram.textContent.trim();
  document.getElementById('contact-email-input').value = contactEmail.textContent.trim();
  document.getElementById('contact-phone-input').value = contactPhone.textContent.trim();
  contactForm.classList.remove('hide');
});

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  if (!isAdmin()) return;

  const instagram = document.getElementById('contact-instagram-input').value.trim();
  const email = document.getElementById('contact-email-input').value.trim();
  const phone = document.getElementById('contact-phone-input').value.trim();

  try {
    const data = await api('/site/contact', { method: 'PUT', body: JSON.stringify({ instagram: instagram, email: email, phone: phone }) });
    renderSiteContact(data.contact);
    contactForm.classList.add('hide');
  } catch (err) {
    alert(err.message);
  }
});

async function loadSite() {
  const data = await api('/site');
  renderSiteAbout(data.about);
  renderSiteContact(data.contact);
}

// Mentoria — qualquer visitante pode enviar seu contato
const mentorshipForm = document.getElementById('mentorship-form');
const mentorshipConfirm = document.getElementById('mentorship-confirm');

mentorshipForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('mentorship-name').value.trim();
  const contact = document.getElementById('mentorship-contact').value.trim();
  const message = document.getElementById('mentorship-message').value.trim();
  if (!name || !contact) return;

  try {
    await api('/leads/mentorship', { method: 'POST', body: JSON.stringify({ name: name, contact: contact, message: message }) });
    mentorshipForm.reset();
    mentorshipConfirm.classList.add('show');
    setTimeout(function () { mentorshipConfirm.classList.remove('show'); }, 4000);
  } catch (err) {
    alert(err.message);
  }
});

// Cadastro de novidades por e-mail
const newsletterForm = document.getElementById('newsletter-form');
const newsletterConfirm = document.getElementById('newsletter-confirm');

newsletterForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('newsletter-email').value.trim();
  if (!email) return;

  try {
    await api('/leads/newsletter', { method: 'POST', body: JSON.stringify({ email: email }) });
    newsletterForm.reset();
    newsletterConfirm.classList.add('show');
    setTimeout(function () { newsletterConfirm.classList.remove('show'); }, 4000);
  } catch (err) {
    alert(err.message);
  }
});

// Busca — filtra as publicações por título ou resumo
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function () {
  const query = searchInput.value.trim().toLowerCase();
  const rows = postsList.querySelectorAll('.post-row');

  rows.forEach(function (row) {
    const title = row.querySelector('h3').textContent.toLowerCase();
    const excerptEl = row.querySelector('.excerpt');
    const excerpt = excerptEl ? excerptEl.textContent.toLowerCase() : '';
    const matches = title.includes(query) || excerpt.includes(query);
    row.style.display = matches ? '' : 'none';
  });
});

// Inicialização
function clearVerifyQueryParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete('verify');
  window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
}

async function handleVerifyLink(token) {
  try {
    await api('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token: token }) });
    alert('E-mail verificado com sucesso!');
    await restoreSession();
    updateUserBadge();
    updateAccessUI();
  } catch (err) {
    alert(err.message);
  } finally {
    clearVerifyQueryParam();
  }
}

const searchParams = new URLSearchParams(window.location.search);
const urlResetToken = searchParams.get('reset');
const urlVerifyToken = searchParams.get('verify');

if (urlResetToken) {
  resetToken = urlResetToken;
  setAuthMode('reset');
  loginOverlay.classList.add('show');
} else {
  setAuthMode('login');
}

if (urlVerifyToken) {
  handleVerifyLink(urlVerifyToken);
}

updateAccessUI();
restoreSession();
Promise.all([loadPosts(), loadProducts(), loadMedia(), loadEvents(), loadSite()]).catch(function (err) {
  console.error('Falha ao carregar dados iniciais:', err);
});
