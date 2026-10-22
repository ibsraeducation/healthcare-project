/* Healthcare Project — client app
   Hash-routed screens: onboarding, auth (sign in/up, forgot, reset), home,
   search, doctor page, booking flow, appointments, profile.
   Session state lives in localStorage under `hc.v1`. */

(() => {
'use strict';

/* ---------- icons (inline SVG, stroke style) ---------- */
const PATHS = {
  heart: 'M12 21C8 17.5 3 13.6 3 8.7 3 5.7 5.5 3.5 8 3.5c1.7 0 3.1.8 4 2 .9-1.2 2.3-2 4-2 2.5 0 5 2.2 5 5.2 0 4.9-5 8.8-9 12.3z',
  skin: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M9 8h.01 M15 10h.01 M10 13h.01 M14 16h.01',
  child: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 8h.01 M9 9h.01 M15 9h.01 M9.5 13a3 3 0 0 0 5 0',
  bone: 'M8.6 6.2 6.2 8.6a2.4 2.4 0 1 1-3.4-3.4.6.6 0 0 1 1-1z M11 12l5 5a2.4 2.4 0 1 0 3.4 3.4.6.6 0 0 0 1-1z M13.5 5.5l5 5',
  tooth: 'M7.2 3.2c2-1.4 3.4-.6 4.8-.6s2.8-.8 4.8.6c1.7 1.2 1.9 3.9 1.2 6.5-.4 1.7-.6 3-1 5.3-.5 2.9-.7 5.9-2.7 5.9-1.7 0-1.6-2.7-2.3-5.1-.3-1-.8-1.6-1.5-1.6-.7 0-1.2.6-1.5 1.6-.7 2.4-.6 5.1-2.3 5.1-2 0-2.2-3-2.7-5.9-.4-2.3-.6-3.6-1-5.3-.7-2.6-.5-5.3 1.2-6.5z',
  stethoscope: 'M5 4v5a4 4 0 0 0 8 0V4 M9 13v3a5 5 0 0 0 10 0v-2.2 M19 11.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z M5 2.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z M13 2.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
};
function ic(name, size, cls, filled) {
  const d = PATHS[name] || PATHS.heart;
  return `<svg class="${cls || ''}" viewBox="0 0 24 24" width="${size || 20}" height="${size || 20}" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}
const EXTRA = {
  search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z M21 21l-4.3-4.3',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4.5 20.5a7.5 7.5 0 0 1 15 0',
  home: 'M4 11l8-7 8 7v8a2 2 0 0 1-2 2h-4v-6h-4v6H6a2 2 0 0 1-2-2v-8z',
  calendar: 'M8 2v4 M16 2v4 M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M4 10h16',
  chevR: 'M9 6l6 6-6 6',
  chevL: 'M15 6l-6 6 6 6',
  star: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5-4.8-4.6 6.6-.9z',
  check: 'M20 6.5L9.5 17 4 11.5',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  message: 'M21 12a8 8 0 0 1-8 8H4l1.6-3.2A8 8 0 1 1 21 12z',
  shield: 'M12 2l8 3v6c0 5.2-3.4 9.1-8 11-4.6-1.9-8-5.8-8-11V5l8-3z M9 12l2 2 4-4',
  walkers: 'M4 15c2 2 5 3 8 3s6-1 8-3 M8 15v3 M16 15v3 M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  file: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z M13 2v7h7 M9 13h6 M9 17h6',
  x: 'M19 6L5 20 M5 6l14 14',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
};
function icx(name, size, cls) {
  const d = EXTRA[name];
  if (!d) return '';
  return `<svg class="${cls || ''}" viewBox="0 0 24 24" width="${size || 20}" height="${size || 20}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d.split(' M').map((p, i) => `<path d="${i ? 'M' + p : p}"/>`).join('')}</svg>`;
}
function starSVG(filled, size) {
  return `<svg viewBox="0 0 24 24" width="${size || 14}" height="${size || 14}" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="${EXTRA.star}"/></svg>`;
}

/* ---------- helpers ---------- */
const $app = document.getElementById('app');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- state ---------- */
function loadState() {
  try { return JSON.parse(localStorage.getItem('hc.v1')) || {}; } catch { return {}; }
}
const store = {
  data: Object.assign({
    user: null,
    favs: {},
    appts: [],
    onboarding: false,
    resetEmail: null,
    search: { q: '', spec: null, sort: 'rating' },
  }, loadState()),
  save() { localStorage.setItem('hc.v1', JSON.stringify(this.data)); },
};
function persist() { store.save(); }

function lema(name) {
  return String(name).trim().split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function monogram(name) {
  return name.replace(/^Dr\.?\s*/i, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function starsHTML(n) {
  let out = '<span class="stars">';
  for (let i = 1; i <= 5; i++) out += starSVG(i <= Math.round(n));
  return out + '</span>';
}
function photo(d) {
  return `<div class="doc-photo" style="background:${d.color}" aria-hidden="true">${monogram(d.name)}</div>`;
}
function toast(msg, kind) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const el = document.createElement('div');
  el.className = 'toast' + (kind === 'red' ? ' red' : '');
  el.innerHTML = `<span class="dot"></span>${esc(msg)}`;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; }, 2200);
  setTimeout(() => el.remove(), 2600);
}

/* ---------- router ---------- */
const routes = {};
let currentView = '';
let activeDoc = null;
function go(path) {
  const target = '#/' + String(path).replace(/^#?\/?/, '');
  if (location.hash === target) renderRoute();
  else location.hash = target;
}
function renderRoute() {
  const hash = location.hash || '#/onboarding';
  const parts = hash.replace(/^#\//, '').split('/').filter(Boolean);
  const name = parts[0] || 'onboarding';
  activeDoc = name === 'doctor' || name === 'book' ? parts[1] : null;
  const fn = routes[name] || routes.home;
  currentView = name;
  $app.innerHTML = fn(...parts.slice(1)) || '';
  window.scrollTo(0, 0);
  updateNavCurrent();
}
window.addEventListener('hashchange', renderRoute);
function updateNavCurrent() {
  const navPages = ['home', 'search', 'appointments', 'profile'];
  document.querySelectorAll('.nav a, .mob-bar a').forEach((a) => {
    const page = (a.getAttribute('href') || '').replace(/^#\//, '');
    const on = navPages.includes(page) && page === currentView;
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    a.classList.toggle('on', on);
  });
}

/* ---------- shells ---------- */
function markTag() {
  return `<span class="mark">${ic('stethoscope', 18)}</span>`;
}
function header(user) {
  return `
  <header class="topbar">
    <div class="topbar-in">
      <a class="brand" href="#/home" aria-label="CarePoint home">${markTag()}<span>CarePoint</span></a>
      <nav class="nav" aria-label="Primary">
        <a href="#/home">Home</a>
        <a href="#/search">Find a doctor</a>
        <a href="#/appointments">Appointments</a>
      </nav>
      <div class="top-actions">
        ${user
          ? `<button class="avatar-chip" onclick="HC.go('profile')" aria-label="Open profile">
               <span class="avatar" style="background:var(--brand)">${esc(lema(user.name))}</span>
               <b>${esc(user.name.split(' ')[0])}</b>
             </button>`
          : `<button class="btn ghost sm" onclick="HC.go('signin')">Sign in</button>
             <button class="btn sm" onclick="HC.go('signup')">Sign up</button>`}
      </div>
    </div>
  </header>`;
}
function footer() {
  return `
  <footer class="site">
    <div class="foot-in">
      <span class="brand">${markTag()}<span>CarePoint</span></span>
      <span>Doctor appointments, simplified. Demo data only — no real bookings are made.</span>
      <nav aria-label="Footer">
        <a href="#/search">Find a doctor</a>
        <a href="#/appointments">Appointments</a>
        <a href="#/profile">Profile</a>
      </nav>
    </div>
  </footer>
  <nav class="mob-bar" aria-label="Mobile">
    <a href="#/home">${icx('home', 20)}<span>Home</span></a>
    <a href="#/search">${icx('search', 20)}<span>Find</span></a>
    <a href="#/appointments">${icx('calendar', 20)}<span>Appts</span></a>
    <a href="#/profile">${icx('user', 20)}<span>Profile</span></a>
  </nav>`;
}
function shell(user, body, opts) {
  opts = opts || {};
  const inner = opts.device
    ? `<main class="stage"><div class="view device">${body}</div></main>`
    : `<main class="stage filled"><div class="view">${body}</div></main>`;
  return `${header(user)}${inner}${footer()}`;
}
/* ============================ SCREENS ============================ */

/* ---------- onboarding ---------- */
routes.onboarding = function () {
  const slides = [
    {
      art: 'heart', a: 'a1',
      h: 'One tap, your doctor is booked',
      p: 'Pick a specialty, choose a slot, and the seat is yours. No phone queues, no waiting rooms full of names.',
    },
    {
      art: 'stethoscope', a: 'a2',
      h: 'Times that respect your day',
      p: 'Morning, after work, or Saturday — browse real openings and reshuffle until one actually fits.',
    },
    {
      art: 'skin', a: 'a3',
      h: 'Your visits, kept together',
      p: 'Every appointment lands on one page with the doctor, the room number and a reminder before it.',
    },
  ];
  const i = Math.min(+(store.data.obStep || 0), slides.length - 1);
  const s = slides[i];
  const body = `
    <div class="screen">
      <div class="ob-card-head">
        <span class="brand" style="cursor:default">${markTag()}<span>CarePoint</span></span>
        <button class="skip" onclick="HC.finishOnboard()">Skip</button>
      </div>
      <div class="ob-carousel">
        <div class="ob-slide">
          <div class="ob-art ${s.a}">${ic(s.art, 84)}</div>
          <h1>${s.h}</h1>
          <p>${s.p}</p>
        </div>
      </div>
      <div>
        <div class="dots">${slides.map((_, k) => `<span class="${k === i ? 'on' : ''}"></span>`).join('')}</div>
        <button class="btn full" onclick="HC.obNext()">${i === slides.length - 1 ? 'Get started' : 'Next'}</button>
        <p class="hint" style="text-align:center;margin-top:12px">Already with us? <a href="#/signin"><b>Sign in</b></a></p>
      </div>
    </div>`;
  return shell(null, body, { device: true });
};

/* ---------- auth ---------- */
function authHead(h, p) {
  return `<div class="auth-head"><span class="mark-big">${ic('stethoscope', 26)}</span><h1>${h}</h1><p>${p}</p></div>`;
}
function eyeBtn(id) {
  return `<span class="trail"><button type="button" class="eye-btn" data-eye="${id}" aria-label="Show password">${icx('eye', 17)}</button></span>`;
}
function passField(id, label, auto) {
  return `<div class="field">
    <label for="${id}">${label}</label>
    <div class="input-wrap has-trail">
      <input id="${id}" class="input" name="pass" type="password" placeholder="8+ characters" autocomplete="${auto}" required minlength="8" oninput="HC.strength(this.value)">
      ${eyeBtn(id)}
    </div>
    <div class="strength" aria-hidden="true"><i id="st1"></i><i id="st2"></i><i id="st3"></i></div>
    <span class="hint" id="st-hint">Use 8 characters or more with a number in them.</span>
  </div>`;
}

routes.signin = function () {
  if (store.data.user) { go('home'); return ''; }
  const body = `
    <div class="screen">
      ${authHead('Welcome back', 'Sign in to book and track your visits')}
      <form onsubmit="HC.dosignin(event)" novalidate>
        <div class="field">
          <label for="si-name">Full name</label>
          <div class="input-wrap has-lead"><span class="lead">${icx('user')}</span>
            <input id="si-name" class="input" name="name" placeholder="Sara Mohamed" autocomplete="name" required>
          </div>
        </div>
        <div class="field">
          <label for="si-pass">Password</label>
          <div class="input-wrap has-trail">
            <input id="si-pass" class="input" name="pass" type="password" placeholder="••••••••" autocomplete="current-password" required minlength="6">
            ${eyeBtn('si-pass')}
          </div>
          <div style="display:flex;justify-content:flex-end">
            <a href="#/forgot" style="font-size:12.5px;font-weight:700">Forgot password?</a>
          </div>
        </div>
        <p class="err" id="si-err" role="alert" style="margin-top:8px"></p>
        <button class="btn full" style="margin-top:14px">Sign in</button>
      </form>
      <div class="divider">or</div>
      <button class="btn ghost-dark full" onclick="HC.guest()">Browse as guest</button>
      <p class="auth-foot">New here? <a href="#/signup"><b>Create an account</b></a></p>
    </div>`;
  return shell(null, body, { device: true });
};

routes.signup = function () {
  const body = `
    <div class="screen">
      ${authHead('Create your account', 'One profile for the whole family’s care')}
      <form onsubmit="HC.dosignup(event)" novalidate>
        <div class="field">
          <label for="su-name">Full name</label>
          <input id="su-name" class="input" name="name" placeholder="Sara Mohamed" autocomplete="name" required>
        </div>
        <div class="field">
          <label for="su-mail">Email</label>
          <div class="input-wrap has-lead"><span class="lead">${icx('user')}</span>
            <input id="su-mail" class="input" name="email" type="email" placeholder="sara@example.com" autocomplete="email" required>
          </div>
        </div>
        <div class="field">
          <label for="su-phone">Mobile number</label>
          <div class="input-wrap has-lead"><span class="lead">${icx('user')}</span>
            <input id="su-phone" class="input" name="phone" inputmode="tel" placeholder="+20 1## ### ####" required>
          </div>
        </div>
        ${passField('su-pass', 'Password', 'new-password')}
        <label class="hint" style="display:flex;gap:9px;margin-top:18px;cursor:pointer">
          <input type="checkbox" required style="accent-color:var(--brand)">
          I agree to the Terms of Service and confirm this demo stores nothing sensitive.
        </label>
        <p class="err" id="su-err" role="alert" style="margin-top:8px"></p>
        <button class="btn full" style="margin-top:14px">Create account</button>
      </form>
      <p class="auth-foot">Already with us? <a href="#/signin"><b>Sign in</b></a></p>
    </div>`;
  return shell(null, body, { device: true });
};

routes.forgot = function () {
  const body = `
    <div class="screen">
      ${authHead('Forgot password', 'We will send a 4-digit code to your email')}
      <form onsubmit="HC.doforgot(event)" novalidate>
        <div class="field">
          <label for="fg-mail">Email</label>
          <div class="input-wrap has-lead"><span class="lead">${icx('user')}</span>
            <input id="fg-mail" class="input" name="email" type="email" placeholder="sara@example.com" required>
          </div>
        </div>
        <p class="err" id="fg-err" role="alert" style="margin-top:8px"></p>
        <button class="btn full" style="margin-top:14px">Send code</button>
      </form>
      <p class="auth-foot"><a href="#/signin"><b>← Back to sign in</b></a></p>
    </div>`;
  return shell(null, body, { device: true });
};

routes.reset = function () {
  const body = `
    <div class="screen">
      ${authHead('Enter the code', 'Check your inbox — the code is <b>2468</b> in this demo')}
      <form onsubmit="HC.doreset(event)" novalidate>
        <div class="otp-row" aria-label="Verification code">
          ${[0, 1, 2, 3].map(k => `<input inputmode="numeric" maxlength="1" required ${k === 0 ? 'autofocus' : ''} oninput="HC.otp(this,${k})" onkeydown="HC.otpBack(event,this,${k})">`).join('')}
        </div>
        ${passField('rs-pass', 'New password', 'new-password')}
        <p class="err" id="rs-err" role="alert" style="margin-top:8px"></p>
        <button class="btn full" style="margin-top:14px">Update password</button>
      </form>
      <p class="auth-foot">Didn’t get it? <a href="#/forgot" style="font-weight:700"><b>Resend code</b></a></p>
    </div>`;
  return shell(null, body, { device: true });
};

/* ---------- shared pieces ---------- */
function docCard(d) {
  const fav = !!store.data.favs[d.id];
  const label = fav ? 'Remove from followed doctors' : 'Add to followed doctors';
  return `
  <div class="doc-card" role="button" tabindex="0" onclick="HC.doc('${d.id}')" onkeydown="if(event.key==='Enter')HC.doc('${d.id}')">
    <button class="fav-btn ${fav ? 'on' : ''}" onclick="event.stopPropagation();HC.fav('${d.id}')" aria-label="${label}">
      ${ic('heart', 18, '', fav)}
    </button>
    ${photo(d)}
    <div class="doc-meta">
      <h3>${esc(d.name)}
        <svg class="badge-verify" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Verified"><path d="M12 2l8 3v6c0 5.2-3.4 9.1-8 11-4.6-1.9-8-5.8-8-11V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg>
      </h3>
      <div class="role">${esc(d.role)} · ${esc(d.hospital)}</div>
      <div class="doc-stats">${starsHTML(d.rating)}<b>${d.rating}</b><span>(${d.reviews})</span><span>·</span><b>EGP ${d.fee}</b></div>
      <span class="travel">${icx('pin', 13)} ${esc(d.location)}</span>
    </div>
  </div>`;
}
function emptyBox(h, p) {
  return `<div class="empty">
    <span class="ico">${icx('search', 26)}</span>
    <h3 style="font-size:17px">${esc(h)}</h3>
    <p style="margin-top:6px">${esc(p)}</p>
  </div>`;
}
function specBubble(s) {
  return `
  <div class="spec" role="button" tabindex="0" onclick="HC.specTap('${s.id}')" onkeydown="if(event.key==='Enter')HC.specTap('${s.id}')">
    <span class="bub">${ic(s.icon, 22)}</span><b>${s.name}</b>
  </div>`;
}
function nextAppointment() {
  const now = localKey(new Date());
  const appt = store.data.appts.filter(a => a.dayKey >= now).sort((a, b) => (a.dayKey + a.slot < b.dayKey + b.slot ? -1 : 1))[0];
  if (!appt) return null;
  return Object.assign(appt, { doc: DOCTORS.find(d => d.id === appt.docId) });
}

/* ---------- home ---------- */
routes.home = function () {
  const user = store.data.user;
  const top = DOCTORS.slice().sort((a, b) => b.rating - a.rating).slice(0, 3);
  const next = nextAppointment();
  const hero = `
    <section class="hero">
      <div>
        ${user ? `<span class="pill" style="background:rgba(255,255,255,.16);color:#EAF8FA;margin-bottom:10px">Hello, ${esc(user.name.split(' ')[0])} 👋</span><br>` : ''}
        <h1>${user ? 'Your health, one quiet place' : 'Doctors who have room for you'}</h1>
        <p>${user
          ? 'Book trusted doctors near you, keep every visit on one page, and get gentle reminders before each one.'
          : 'Browse specialists by name, district or price — then pick a slot that fits. Sign in to keep your own appointment page.'}</p>
        <button class="btn" onclick="HC.go('search')">Find a doctor</button>
      </div>
      <img class="hero-blob" src="assets/hero.svg" alt="" width="200" height="158" style="border-radius:18px">
    </section>`;
  const body = `
  <div class="home-grid">
    <div>
      ${hero}
      <div class="search-wrap">
        <form class="search-bar" onsubmit="HC.searchSubmit(event)">
          <span class="lead">${icx('search', 18)}</span>
          <input name="q" placeholder="Doctor, specialty or district…" aria-label="Search doctors">
          <button class="btn sm">Search</button>
        </form>
      </div>
      <div class="section-title" style="margin-top:22px"><h2>Specialties</h2></div>
      <div class="specialties">${SPECIALTIES.map(specBubble).join('')}</div>
      <div class="section-title"><h2>Top doctors</h2><a href="#/search">See all →</a></div>
      <div class="doc-list">${top.map(docCard).join('')}</div>
      <div class="section-title"><h2>Health reads</h2></div>
      <div class="doc-list">
        ${ARTICLES.map(a => `
          <div class="card" style="display:flex;gap:14px;align-items:center">
            <span class="doc-photo" style="width:46px;height:46px;border-radius:14px;background:var(--brand-soft);color:var(--brand-strong)">${icx('file', 20)}</span>
            <div>
              <span class="pill soft">${esc(a.tag)}</span>
              <b style="display:block;font-size:14px;margin-top:6px;line-height:1.4">${esc(a.title)}</b>
              <span class="hint">${a.read} read</span>
            </div>
          </div>`).join('')}
      </div>
    </div>
    <aside class="home-side">
      <div class="appt-cta">
        <h3>${next ? 'Next visit' : (user ? 'No visits booked yet' : 'Care in three steps')}</h3>
        <p>${next
          ? `${esc(next.doc.name)}<br>${esc(next.dayNice)} at ${esc(next.slot)} · ${esc(next.doc.working.note)}`
          : user
            ? 'Your first booking takes under a minute. Pick a specialty and a slot — we hold the room.'
            : '1 · Choose a specialty &nbsp; 2 · Pick an open slot &nbsp; 3 · Confirm — done.'}</p>
        <button class="btn sm full" style="background:#fff;color:var(--brand-strong)" onclick="HC.go('${next ? 'appointments' : (user ? 'search' : 'signup')}')">
          ${next ? 'View appointment' : (user ? 'Book now' : 'Create your account')}
        </button>
      </div>
      <div class="card side-card">
        <div class="section-title" style="margin:0 0 10px"><h2 style="font-size:15.5px">Popular this week</h2></div>
        <div class="mini-list">
          ${top.map(d => `
            <div class="mini-doctor" role="button" tabindex="0" onclick="HC.doc('${d.id}')" onkeydown="if(event.key==='Enter')HC.doc('${d.id}')">
              ${photo(d)}
              <span><b>${esc(d.name)}</b><span>${esc(d.role)} · ★ ${d.rating}</span></span>
              <span class="go">${icx('chevR', 18)}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="card side-card">
        <span class="pill soft">${icx('shield', 13)} Privacy first</span>
        <p class="hint" style="margin-top:10px">This site runs fully offline. Everything you type stays in your browser — nothing is uploaded anywhere.</p>
      </div>
    </aside>
  </div>`;
  return shell(user, body);
};

/* ---------- search / results ---------- */
function searchState() { return store.data.search || { q: '', spec: null, sort: 'rating' }; }
function specName(id) { const s = SPECIALTIES.find(x => x.id === id); return s ? s.name.toLowerCase() : ''; }
function filteredDoctors() {
  const st = searchState();
  const q = st.q.trim().toLowerCase();
  let list = DOCTORS.filter((d) => {
    if (st.spec === 'fav' && !store.data.favs[d.id]) return false;
    if (st.spec && st.spec !== 'fav' && d.role.toLowerCase() !== specName(st.spec)) return false;
    if (q && !((d.name + ' ' + d.role + ' ' + d.hospital + ' ' + d.location).toLowerCase().includes(q))) return false;
    return true;
  });
  list = list.slice();
  if (st.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  if (st.sort === 'fee') list.sort((a, b) => a.fee - b.fee);
  if (st.sort === 'experience') list.sort((a, b) => b.years - a.years);
  return list;
}
routes.search = function () {
  const st = searchState();
  const list = filteredDoctors();
  const body = `
  <p class="crumbs"><a href="#/home">Home</a> <span>/</span> Find a doctor</p>
  <h1 style="font-size:24px">Find your doctor</h1>
  <p class="page-note">${list.length} ${list.length === 1 ? 'doctor matches' : 'doctors match'} your filters.</p>
  <div class="search-layout" style="margin-top:20px">
    <div class="filters">
      <form class="search-bar" onsubmit="HC.searchSubmit(event)">
        <span class="lead">${icx('search', 18)}</span>
        <input name="q" value="${esc(st.q)}" placeholder="Doctor, specialty or district…" aria-label="Search doctors">
        <button class="btn sm">Search</button>
      </form>
      <button class="chip ${!st.spec ? 'on' : ''}" onclick="HC.spec(null)">All</button>
      ${SPECIALTIES.map(s => `<button class="chip ${st.spec === s.id ? 'on' : ''}" onclick="HC.spec('${s.id}')">${s.name}</button>`).join('')}
      <button class="chip ${st.spec === 'fav' ? 'on' : ''}" onclick="HC.spec('fav')">${ic('heart', 13)} Followed</button>
      <div class="card" style="padding:14px 16px">
        <label style="font-weight:700;font-size:13px">Sort by</label>
        <select class="input" style="margin-top:8px" onchange="HC.sort(this.value)">
          <option value="rating" ${st.sort === 'rating' ? 'selected' : ''}>Highest rating</option>
          <option value="fee" ${st.sort === 'fee' ? 'selected' : ''}>Lowest fee</option>
          <option value="experience" ${st.sort === 'experience' ? 'selected' : ''}>Most experienced</option>
        </select>
      </div>
      <button class="chip" onclick="HC.clearFilters()" style="justify-content:center">Clear all</button>
    </div>
    <div>
      ${list.length ? `<div class="doc-list">${list.map(docCard).join('')}</div>` : emptyBox('No doctor fits that yet', 'Try another specialty or clear a filter — there is plenty to meet.')}
    </div>
  </div>`;
  return shell(store.data.user, body);
};
/* ---------- doctor page ---------- */
routes.doctor = function (id) {
  const d = DOCTORS.find(x => x.id === id);
  if (!d) return shell(store.data.user, emptyBox('Doctor not found', 'It may have been archived. Head back and pick another.'));
  const revs = REVIEWS[id] || [];
  const fav = !!store.data.favs[d.id];
  const body = `
  <p class="crumbs"><a href="#/home">Home</a> <span>/</span> <a href="#/search">Find a doctor</a> <span>/</span> ${esc(d.role)}</p>
  <div class="doc-hero">
    <div class="doc-photo" aria-hidden="true">${monogram(d.name)}</div>
    <div style="flex:1;min-width:0">
      <h1>${esc(d.name)}</h1>
      <div class="sub">${esc(d.role)} · ${esc(d.hospital)}</div>
      <div class="doc-stats" style="color:#CBEAEF">${starsHTML(d.rating)} <b style="color:#fff">${d.rating}</b> <span>(${d.reviews} reviews)</span></div>
      <div class="facts">
        <span class="pill">${icx('walkers', 13)} ${d.years} years experience</span>
        <span class="pill">${icx('user', 13)} ${d.patients.toLocaleString()}+ patients</span>
        <span class="pill">${icx('pin', 13)} ${esc(d.location)}</span>
      </div>
    </div>
    <button class="fav-btn ${fav ? 'on' : ''}" onclick="HC.fav('${d.id}')" aria-label="${fav ? 'Remove from followed' : 'Follow this doctor'}">
      ${ic('heart', 20, '', fav)}
    </button>
    <div class="price-tag"><div class="price">EGP ${d.fee}</div><small>per visit</small></div>
  </div>

  <div class="doc-cols">
    <div class="sticky-book" style="display:flex;flex-direction:column;gap:16px">
      <div class="card" style="padding:16px;display:grid;gap:12px">
        <div class="stat"><b>${d.patients.toLocaleString()}+</b><span>patients</span></div>
        <div class="stat"><b>${d.years} yrs</b><span>experience</span></div>
        <div class="stat"><b>${d.rating}</b><span>rating</span></div>
      </div>
      <div class="card working-card">
        <h3 style="font-size:15.5px">Working hours</h3>
        <div class="row"><span class="k">Days</span><b>${esc(d.working.days)}</b></div>
        <div class="row"><span class="k">Hours</span><b>${esc(d.working.hours)}</b></div>
        <div class="row"><span class="k">Room</span><b>${esc(d.working.note)}</b></div>
        <button class="btn full" style="margin-top:14px" onclick="HC.book('${d.id}')">Book appointment</button>
      </div>
    </div>

    <div>
      <div class="card">
        <h3 style="font-size:16px">About ${esc(d.name.split(' ').slice(-1)[0])}</h3>
        <p class="about-copy">${esc(d.about)}</p>
        <div class="section-title" style="margin:18px 0 6px"><h2 style="font-size:15.5px">Education</h2></div>
        ${d.education.map(e => `<div class="edu-row"><span class="yr">${e.year}</span><span style="font-size:14px">${esc(e.line)}</span></div>`).join('')}
      </div>

      <div class="card" style="margin-top:16px">
        <h3 style="font-size:16px">Patient reviews <span class="hint" style="font-weight:600">· ${d.reviews} total</span></h3>
        <div class="review-card">
          ${revs.length ? revs.map(r => `
            <div class="review">
              <div class="ava" style="background:linear-gradient(135deg,#0B7285,#16AEC4);display:grid;place-items:center;color:#fff;font-weight:800">${esc(lema(r.name))}</div>
              <div style="flex:1">
                <div class="who" style="display:flex;justify-content:space-between;align-items:baseline">
                  <b>${esc(r.name)}</b><span class="stars">${[1,2,3,4,5].map(k => starSVG(k <= r.stars)).join('')}</span>
                </div>
                <span class="when">${esc(r.when)}</span>
                <p>${esc(r.text)}</p>
              </div>
            </div>`).join('') : '<p class="hint">No written reviews yet — the first one could be yours after the visit.</p>'}
        </div>
      </div>
    </div>
  </div>`;
  return shell(store.data.user, body);
};

/* ---------- booking ---------- */
const pad2 = (n) => String(n).padStart(2, '0');
function localKey(d) {
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}
function availDays() {
  const out = [];
  const ds = new Date();
  ds.setHours(0, 0, 0, 0);
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < 14; i++) {
    const d = new Date(ds);
    d.setDate(ds.getDate() + i);
    out.push({ key: localKey(d), label: names[d.getDay()], day: d.getDate().toString() });
  }
  return out;
}
function dayNice(key) {
  return new Date(key + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
}
function summaryRows(d) {
  const p = store.data.pendingAppt || {};
  return `
    <span class="row"><span class="k">Doctor</span><b>${esc(d.name)}</b></span>
    <span class="row"><span class="k">Specialty</span><b>${esc(d.role)}</b></span>
    <span class="row"><span class="k">Clinic</span><b>${esc(d.hospital)}</b></span>
    <span class="row"><span class="k">When</span><b>${p.dayKey ? esc(dayNice(p.dayKey)) : '—'}${p.slot ? ' · ' + esc(p.slot) : ''}</b></span>
    <span class="row"><span class="k">Patient</span><b>${esc(p.name || store.data.bkName || '—')}</b></span>
    <span class="row"><span class="k">Fee</span><b>EGP ${d.fee}</b></span>`;
}
routes.book = function (id) {
  const d = DOCTORS.find(x => x.id === id);
  if (!d) { go('search'); return ''; }
  const step = Math.min(+(store.data.bookStep || 0), 2);
  const body = `
  <p class="crumbs"><a href="#/search">Find a doctor</a> <span>/</span> Booking</p>
  <h1 style="font-size:23px">Book with ${esc(d.name)}</h1>
  <div class="steps" style="margin-top:16px;margin-bottom:20px" aria-hidden="true">
    ${[0, 1, 2].map(k => `<span class="${k < step ? 'done' : ''}"></span>`).join('')}
  </div>
  <div class="book-layout">
    <div>
      ${step === 0 ? dateStep(d) : step === 1 ? detailsStep() : reviewStep(d)}
    </div>
    <aside style="display:flex;flex-direction:column;gap:16px">
      <div class="card" style="display:flex;gap:14px;align-items:center">
        ${photo(d)}
        <div><b style="font-size:14.5px">${esc(d.name)}</b><br><span class="hint">${esc(d.role)} · ${esc(d.hospital)}</span></div>
      </div>
      <div class="card summary-tv">
        <h3 style="font-size:15.5px;margin-bottom:6px">Summary</h3>
        <div class="summary-rows">${summaryRows(d)}</div>
      </div>
      <div class="card">
        <span class="pill soft">${icx('shield', 13)} Demo notice</span>
        <p class="hint" style="margin-top:10px">This is a converted-design demo. No seat is reserved with any clinic and no payment is taken.</p>
      </div>
    </aside>
  </div>`;
  return shell(store.data.user, body);
};

function dateStep(d) {
  const days = availDays();
  const sel = store.data.bookDay || days[0].key;
  const busy = busySlots(d.id, sel);
  return `
  <div class="card">
    <div class="section-title" style="margin:0 0 8px"><h2 style="font-size:17px">Pick a day</h2></div>
    <div class="days" role="listbox" aria-label="Available days">
      ${days.map(day => `
        <div class="day-cell ${day.key === sel ? 'on' : ''}" role="option" aria-selected="${day.key === sel}" tabindex="0"
             onclick="HC.pickDay('${day.key}')" onkeydown="if(event.key==='Enter')HC.pickDay('${day.key}')">
          <small>${day.label}</small><b>${day.day}</b>
        </div>`).join('')}
    </div>
    <div class="slot-title">${dayNice(sel)} · open slots</div>
    ${SLOT_GROUPS.map(g => `
      <div>
        <div class="slot-title" style="margin:10px 0 6px">${g.label}</div>
        <div class="slots">
          ${g.slots.map(s => {
            const b = busy.has(s);
            return `<button type="button" class="slot ${b ? 'busy' : ''}" ${b ? 'disabled' : ''} onclick="HC.pickSlot('${s}')" aria-label="${s} ${b ? 'booked' : 'available'}">${s}</button>`;
          }).join('')}
        </div>
      </div>`).join('')}
    <div class="book-nav">
      <button class="btn ghost-dark" onclick="HC.go('doctor/${d.id}')">← Back to doctor</button>
      <button class="btn" onclick="HC.nextStep()" ${store.data.pendingAppt && store.data.pendingAppt.slot ? '' : 'disabled'}>Patient details →</button>
    </div>
  </div>`;
}

function detailsStep() {
  const u = store.data.user || {};
  const why = ['General checkup', 'First consultation', 'Follow-up visit', 'Test results', 'Second opinion'];
  return `
  <div class="card">
    <div class="section-title" style="margin:0 0 4px"><h2 style="font-size:17px">Patient details</h2></div>
    <p class="hint">The first name on the visit. You can add family members later from your profile.</p>
    <form onsubmit="HC.saveDetails(event)">
      <div class="field">
        <label for="bk-name">Patient full name</label>
        <input id="bk-name" class="input" value="${esc(store.data.bkName || u.name || '')}" required>
      </div>
      <div class="field">
        <label for="bk-phone">Mobile number</label>
        <div class="input-wrap has-lead"><span class="lead">${icx('user')}</span>
          <input id="bk-phone" class="input" inputmode="tel" value="${esc(store.data.bkPhone || '')}" placeholder="+20 1## ### ####" required>
        </div>
      </div>
      <div class="field">
        <label for="bk-why">Reason for visit</label>
        <select id="bk-why" class="input">
          ${why.map(o => `<option ${store.data.bkWhy === o ? 'selected' : ''}>${o}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label for="bk-notes">Notes for the doctor <span class="hint" style="font-weight:600">(optional)</span></label>
        <textarea id="bk-notes" class="input" rows="3" style="resize:vertical" placeholder="Anything the doctor should know before the visit…">${esc(store.data.bkNotes || '')}</textarea>
      </div>
      <div class="book-nav">
        <button type="button" class="btn ghost-dark" onclick="HC.prevStep()">← Choose another time</button>
        <button class="btn">Review &amp; confirm →</button>
      </div>
    </form>
  </div>`;
}

function reviewStep(d) {
  const p = store.data.pendingAppt;
  if (!p) { go('doctor/' + d.id); return ''; }
  return `
  <div class="card">
    <div class="section-title" style="margin:0 0 10px"><h2 style="font-size:17px">Review &amp; confirm</h2></div>
    <div class="card summary-tv" style="margin-top:8px;background:var(--bg)">
      <div class="summary-rows">${summaryRows(d)}</div>
    </div>
    <label class="hint" style="display:flex;gap:9px;margin-top:16px;cursor:pointer">
      <input type="checkbox" id="bk-agree" required style="accent-color:var(--brand)">
      I read the visit policy: free cancellation until 24&nbsp;hours before the slot.
    </label>
    <div class="book-nav">
      <button class="btn ghost-dark" onclick="HC.prevStep()">← Edit details</button>
      <button class="btn" onclick="HC.confirm()">Confirm booking</button>
    </div>
  </div>`;
}

/* ---------- confirmation ---------- */
routes.success = function () {
  const a = store.data.appts.slice(-1)[0];
  if (!a) { go('home'); return ''; }
  const d = DOCTORS.find(x => x.id === a.docId);
  const body = `
  <div class="screen" style="text-align:center;justify-content:center">
    <div class="success-art">${icx('check', 40)}</div>
    <h1 style="font-size:24px">You’re booked, ${esc((a.name || '').split(' ')[0])}.</h1>
    <p style="color:var(--muted);margin-top:10px">A confirmation was saved to your appointments.</p>
    <div class="card" style="margin-top:22px;text-align:start">
      ${d ? `<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">${photo(d)}<div><b>${esc(d.name)}</b><br><span class="hint">${esc(d.role)} · ${esc(d.hospital)}</span></div></div>` : ''}
      <div class="summary-rows">
        <span class="row"><span class="k">When</span><b>${esc(a.dayNice)} · ${esc(a.slot)}</b></span>
        <span class="row"><span class="k">Room</span><b>${esc(d ? d.working.note : '—')}</b></span>
        <span class="row"><span class="k">Fee</span><b>EGP ${a.fee}</b></span>
      </div>
    </div>
    <button class="btn full" style="margin-top:20px" onclick="HC.go('appointments')">My appointments</button>
    <p class="auth-foot" style="padding-top:14px"><a href="#/home" style="font-weight:700"><b>← Back home</b></a></p>
  </div>`;
  return shell(store.data.user, body);
};

/* ---------- appointments ---------- */
routes.appointments = function () {
  const user = store.data.user;
  if (!user) return shell(null, `
    <div class="empty" style="margin-top:30px">
      <span class="ico">${icx('calendar', 26)}</span>
      <h3 style="font-size:18px">Sign in to see your visits</h3>
      <p style="margin-top:8px">Your appointment page keeps the doctor, time and room together.</p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap">
        <button class="btn" onclick="HC.go('signin')">Sign in</button>
        <button class="btn ghost-dark" onclick="HC.go('search')">Browse doctors</button>
      </div>
    </div>`);
  const now = localKey(new Date());
  const mine = store.data.appts.slice().sort((a, b) => (a.dayKey < b.dayKey ? 1 : -1));
  const upcoming = mine.filter(a => a.dayKey >= now);
  const past = mine.filter(a => a.dayKey < now);
  const row = (a, isPast) => {
    const d = DOCTORS.find(x => x.id === a.docId);
    const dd = new Date(a.dayKey + 'T12:00:00');
    return `
    <div class="card appt-item">
      <div class="date-box"><b>${dd.getDate()}</b><small>${dd.toLocaleDateString(undefined, { month: 'short' })}</small></div>
      <div class="who">
        <b>${esc(d ? d.name : a.docName)}</b>
        <span>${esc(d ? d.role + ' · ' + d.hospital : '')}</span>
        <span class="hint">${esc(a.dayNice)}, ${esc(a.slot)}${d ? ' · ' + esc(d.working.note) : ''}</span>
      </div>
      <span class="pill ${isPast ? 'soft' : 'ok'}">${isPast ? 'Completed' : 'Upcoming'}</span>
      <div style="display:flex;gap:8px">
        <button class="icon-btn" title="Message clinic" onclick="HC.msg('${a.id}')" aria-label="Message clinic">${icx('message', 18)}</button>
        ${isPast ? '' : `<button class="icon-btn" title="Cancel visit" onclick="HC.cancelAppt('${a.id}')" aria-label="Cancel visit">${icx('x', 18)}</button>`}
      </div>
    </div>`;
  };
  const body = `
  <p class="crumbs"><a href="#/home">Home</a> <span>/</span> Appointments</p>
  <h1 style="font-size:24px">My appointments</h1>
  ${mine.length === 0 ? `
    <div class="empty" style="margin-top:26px">
      <span class="ico">${icx('calendar', 26)}</span>
      <h3 style="font-size:17px">Nothing booked yet</h3>
      <p style="margin-top:8px">Your first visit takes under a minute — pick a doctor and a slot.</p>
      <button class="btn" style="margin-top:16px" onclick="HC.go('search')">Find a doctor</button>
    </div>` : `
    <div class="section-title"><h2>Upcoming <span class="hint">(${upcoming.length})</span></h2></div>
    <div class="appt-list">${upcoming.length ? upcoming.map(a => row(a, false)).join('') : '<p class="hint">No upcoming visit. A past one can be rebooked from the doctor page.</p>'}</div>
    <div class="section-title"><h2>History <span class="hint">(${past.length})</span></h2></div>
    <div class="appt-list">${past.length ? past.map(a => row(a, true)).join('') : '<p class="hint">After a visit, it shows up here under Completed.</p>'}</div>`}`;
  return shell(user, body);
};

/* ---------- profile ---------- */
routes.profile = function () {
  const user = store.data.user;
  if (!user) return shell(null, `
    <div class="empty" style="margin-top:30px">
      <span class="ico">${icx('user', 26)}</span>
      <h3 style="font-size:18px">Sign in to open your profile</h3>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap">
        <button class="btn" onclick="HC.go('signin')">Sign in</button>
        <button class="btn ghost-dark" onclick="HC.go('signup')">Create account</button>
      </div>
    </div>`);
  const favCount = Object.keys(store.data.favs).length;
  const notify = store.data.notify !== false;
  const body = `
  <p class="crumbs"><a href="#/home">Home</a> <span>/</span> Profile</p>
  <div class="profile-grid">
    <div class="card" style="text-align:center;padding:26px 18px">
      <span class="avatar" style="width:74px;height:74px;font-size:24px;border-radius:24px;margin:0 auto 12px;background:linear-gradient(135deg,var(--brand),#16AEC4)">${esc(lema(user.name))}</span>
      <h2 style="font-size:18px">${esc(user.name)}</h2>
      <p class="hint">${esc(user.email)}</p>
      <p class="hint">${esc(user.phone || '')}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px">
        <div class="stat"><b>${store.data.appts.length}</b><span>visits</span></div>
        <div class="stat"><b>${favCount}</b><span>followed</span></div>
      </div>
      <button class="btn danger full" style="margin-top:16px" onclick="HC.logout()">Sign out</button>
    </div>
    <div>
      <div class="card">
        <h3 style="font-size:16px;margin-bottom:6px">Personal info</h3>
        <form onsubmit="HC.saveProfile(event)">
          <div class="field"><label for="pf-name">Full name</label><input id="pf-name" class="input" value="${esc(user.name)}" required></div>
          <div class="field"><label for="pf-phone">Mobile number</label><input id="pf-phone" class="input" inputmode="tel" value="${esc(user.phone || '')}" required></div>
          <div class="field"><label for="pf-mail">Email</label><input id="pf-mail" class="input" type="email" value="${esc(user.email)}" required></div>
          <button class="btn" style="margin-top:16px">Save changes</button>
        </form>
      </div>
      <div class="card" style="margin-top:16px">
        <h3 style="font-size:16px;margin-bottom:8px">Preferences</h3>
        <div class="settings-row"><span class="k">Appointment reminders<br><span class="hint">A nudge one day before each visit</span></span>
          <label class="toggle"><input type="checkbox" ${notify ? 'checked' : ''} onchange="HC.toggle('notify',this.checked)" aria-label="Appointment reminders"><i></i></label>
        </div>
        <div class="settings-row"><span class="k">Clear everything</span>
          <button class="btn sm danger" onclick="HC.wipe()">Erase local data</button>
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <span class="pill soft">${icx('shield', 13)} Privacy first</span>
        <p class="hint" style="margin-top:10px">Profile, bookings and followed doctors live in this browser’s localStorage. Clearing it erases everything — nothing was ever sent to a server.</p>
      </div>
    </div>
  </div>`;
  return shell(user, body);
};

/* ---------- about ---------- */
routes.about = function () {
  const body = `
  <p class="crumbs"><a href="#/home">Home</a> <span>/</span> About</p>
  <section class="hero" style="margin-top:8px">
    <div>
      <h1>Care, arranged calmly</h1>
      <p>CarePoint is the web build of the <b>Healthcare Project</b> Figma file: onboarding, sign-in, doctor discovery, a booking flow and a single appointment page. This build is a static conversion — every click runs offline against demo data.</p>
    </div>
    <img class="hero-blob" src="assets/hero.svg" alt="" width="200" height="158" style="border-radius:18px">
  </section>
  <div class="doc-list" style="margin-top:26px">
    ${[
      ['walkers', 'Doctors first, then slots', 'Each doctor page carries ratings, education and the room number before you book.'],
      ['file', 'Honest availability', 'Busy slots read struck-through, never hidden — what you see is what the clinic has.'],
      ['shield', 'Local by default', 'The site runs with zero accounts and zero network calls; clearing storage clears everything.'],
    ].map(x => `<div class="card"><span class="doc-photo" style="width:44px;height:44px;border-radius:14px;background:var(--brand-soft);color:var(--brand-strong)">${icx(x[0], 20)}</span>
      <h2 style="font-size:15.5px;margin-top:12px">${x[1]}</h2><p class="about-copy">${x[2]}</p></div>`).join('')}
  </div>
  <div class="card" style="margin-top:16px">
    <h3 style="font-size:16px">Screens this build covers</h3>
    <p class="about-copy">Onboarding carousel · Sign in / Sign up · Forgot &amp; reset code · Home · Search with filters · Doctor detail · Booking flow (day, details, review) · Confirmation · Appointments · Profile &amp; preferences.</p>
  </div>`;
  return shell(store.data.user, body);
};
/* ============================ INTERACTIONS ============================ */
const HC = (window.HC = {
  go,
  obNext: () => {
    const step = +(store.data.obStep || 0);
    if (step >= 2) { store.data.onboarding = true; delete store.data.obStep; persist(); go(store.data.user ? 'home' : 'signin'); return; }
    store.data.obStep = step + 1; persist(); renderRoute();
  },
  finishOnboard: () => { store.data.onboarding = true; delete store.data.obStep; persist(); go(store.data.user ? 'home' : 'signin'); },
  strength: (v) => {
    const s1 = document.getElementById('st1'), s2 = document.getElementById('st2'), s3 = document.getElementById('st3');
    const hint = document.getElementById('st-hint');
    if (!s1) return;
    let level = 0;
    if (v.length >= 8) level++;
    if (v.length >= 8 && /\d/.test(v)) level++;
    if (v.length >= 10 && /\d/.test(v) && /[A-Z]/.test(v)) level++;
    s1.className = level >= 1 ? 's1' : ''; s2.className = level >= 2 ? 's2' : ''; s3.className = level >= 3 ? 's3' : '';
    if (hint) hint.textContent = level === 0 ? 'Use 8 characters or more with a number in them.'
      : level === 1 ? 'Good length — add a number.'
      : level === 2 ? 'Strong. Add a capital letter to finish.' : 'Excellent password.';
  },
  otp: (input, k) => {
    input.value = input.value.replace(/\D/g, '').slice(0, 1);
    const row = document.querySelectorAll('.otp-row input');
    if (input.value && row[k + 1]) row[k + 1].focus();
  },
  otpBack: (e, input, k) => {
    const row = document.querySelectorAll('.otp-row input');
    if (e.key === 'Backspace' && !input.value && row[k - 1]) row[k - 1].focus();
  },
  dosignin: (e) => {
    e.preventDefault();
    const f = e.target;
    const err = document.getElementById('si-err');
    const name = f.name.value.trim();
    if (name.split(' ').filter(Boolean).length < 2) { err.textContent = 'Please type your full name (first and last).'; return; }
    if (f.pass.value.length < 6) { err.textContent = 'Password needs at least 6 characters.'; return; }
    err.textContent = '';
    const prev = store.data.user;
    store.data.user = (prev && prev.email) ? prev : {
      name,
      email: name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12) + '@example.com',
      phone: '',
    };
    persist();
    toast('Welcome back, ' + name.split(' ')[0] + '!');
    go('home');
  },
  dosignup: (e) => {
    e.preventDefault();
    const f = e.target;
    const err = document.getElementById('su-err');
    const name = f.name.value.trim();
    const email = f.email.value.trim();
    const parts = name.split(' ').filter(Boolean);
    if (parts.length < 2) { err.textContent = 'Please enter both first and last name.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = 'That email doesn’t look complete.'; return; }
    if (f.pass.value.length < 8) { err.textContent = 'Password needs 8 characters or more.'; return; }
    store.data.user = { name, email, phone: f.phone.value.trim() };
    persist();
    toast('Account created — welcome, ' + parts[0] + '!');
    go('home');
  },
  doforgot: (e) => {
    e.preventDefault();
    const f = e.target;
    const err = document.getElementById('fg-err');
    if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim())) { err.textContent = 'Enter the email you signed up with.'; return; }
    store.data.resetEmail = f.email.value.trim();
    persist();
    toast('Code sent to ' + store.data.resetEmail);
    go('reset');
  },
  doreset: (e) => {
    e.preventDefault();
    const f = e.target;
    const err = document.getElementById('rs-err');
    const code = [...document.querySelectorAll('.otp-row input')].map(i => i.value).join('');
    if (code !== '2468') { err.textContent = 'The code doesn’t match — in this demo it is 2468.'; return; }
    if (f.pass.value.length < 8) { err.textContent = 'Password needs 8 characters or more.'; return; }
    store.data.resetEmail = null;
    persist();
    toast('Password updated — sign in with the new one.');
    go('signin');
  },
  specTap: (id) => {
    store.data.search = Object.assign(searchState(), { spec: id }); persist();
    go('search'); renderRoute();
  },
  spec: (id) => {
    const st = searchState();
    st.spec = st.spec === id ? null : id;
    store.data.search = st; persist(); renderRoute();
  },
  sort: (v) => { const st = searchState(); st.sort = v; store.data.search = st; persist(); renderRoute(); },
  searchSubmit: (e) => {
    e.preventDefault();
    const st = searchState();
    st.q = e.target.querySelector('input').value;
    store.data.search = st; persist();
    if (currentView !== 'search') go('search'); else renderRoute();
  },
  clearFilters: () => { store.data.search = { q: '', spec: null, sort: 'rating' }; persist(); renderRoute(); },
  doc: (id) => go('doctor/' + id),
  book: (id) => {
    store.data.bookStep = 0;
    store.data.bookDay = null;
    delete store.data.pendingAppt;
    persist();
    go('book/' + id);
  },
  fav: (id) => {
    if (store.data.favs[id]) delete store.data.favs[id]; else store.data.favs[id] = true;
    persist();
    toast(store.data.favs[id] ? 'Added to your followed doctors' : 'Removed from followed');
    renderRoute();
  },
  pickDay: (key) => {
    store.data.bookDay = key;
    if (store.data.pendingAppt) store.data.pendingAppt.slot = null;
    persist(); renderRoute();
  },
  pickSlot: (s) => {
    const d = DOCTORS.find(x => x.id === activeDoc);
    if (!d) return;
    store.data.pendingAppt = Object.assign(store.data.pendingAppt || {}, {
      docId: d.id, docName: d.name, fee: d.fee,
      dayKey: store.data.bookDay || availDays()[0].key,
      slot: s,
    });
    persist(); renderRoute();
  },
  nextStep: () => { store.data.bookStep = Math.min((+store.data.bookStep || 0) + 1, 2); persist(); renderRoute(); },
  prevStep: () => { store.data.bookStep = Math.max((+store.data.bookStep || 0) - 1, 0); persist(); renderRoute(); },
  saveDetails: (e) => {
    e.preventDefault();
    store.data.bkName = document.getElementById('bk-name').value.trim();
    store.data.bkPhone = document.getElementById('bk-phone').value.trim();
    store.data.bkWhy = document.getElementById('bk-why').value;
    store.data.bkNotes = document.getElementById('bk-notes').value.trim();
    store.data.pendingAppt = Object.assign(store.data.pendingAppt || {}, {
      name: store.data.bkName, phone: store.data.bkPhone, why: store.data.bkWhy,
    });
    persist(); HC.nextStep();
  },
  confirm: () => {
    const p = store.data.pendingAppt;
    const d = DOCTORS.find(x => x.id === (p || {}).docId);
    if (!d) { go('search'); return; }
    if (!document.getElementById('bk-agree').checked) { toast('Please tick the visit policy box', 'red'); return; }
    const dayKey = p.dayKey || store.data.bookDay || availDays()[0].key;
    store.data.appts.push({
      id: 'ap' + Date.now(),
      docId: d.id, docName: d.name,
      dayKey, dayNice: dayNice(dayKey), slot: p.slot,
      name: p.name || store.data.bkName,
      phone: store.data.bkPhone, why: store.data.bkWhy, fee: d.fee,
    });
    store.data.bookStep = 0;
    store.data.bookDay = null;
    delete store.data.pendingAppt;
    persist();
    toast('Booked — see you then!');
    go('success');
  },
  cancelAppt: (id) => {
    const a = store.data.appts.find(x => x.id === id);
    if (!a) return;
    const back = modalBack(`<h3>Cancel this visit?</h3>
      <p class="hint">Free cancellation until 24 hours before the slot. The visit is with <b>${esc(a.docName)}</b> on <b>${esc(a.dayNice)} at ${esc(a.slot)}</b>.</p>
      <div style="display:flex;gap:10px;margin-top:18px">
        <button class="btn ghost-dark sm" data-no style="flex:1">Keep it</button>
        <button class="btn danger sm" data-yes style="flex:1">Cancel visit</button>
      </div>`);
    back.querySelector('[data-no]').onclick = () => back.remove();
    back.querySelector('[data-yes]').onclick = () => {
      store.data.appts = store.data.appts.filter(x => x.id !== id);
      persist(); back.remove(); toast('Visit cancelled — the slot is free again', 'red');
      renderRoute();
    };
  },
  msg: (id) => {
    const a = store.data.appts.find(x => x.id === id);
    if (!a) return;
    const back = modalBack(`<h3>Message clinic</h3>
      <p class="hint">A demo thread with your clinic contact.</p>
      <div class="bubble-list">
        <div class="msg-bubble them">Hi ${esc((a.name || '').split(' ')[0])} — this slot is confirmed. Please arrive 10 minutes early with your ID and any previous reports.</div>
        <div class="msg-bubble me">Thank you! Should I fast before the blood test?</div>
        <div class="msg-bubble them">Not needed for this visit. See you soon.</div>
      </div>
      <button class="btn ghost-dark full" style="margin-top:18px" onclick="this.closest('.modal-back').remove()">Close</button>`);
  },
  saveProfile: (e) => {
    e.preventDefault();
    store.data.user.name = document.getElementById('pf-name').value.trim();
    store.data.user.phone = document.getElementById('pf-phone').value.trim();
    store.data.user.email = document.getElementById('pf-mail').value.trim();
    persist(); toast('Profile saved'); renderRoute();
  },
  toggle: (k, v) => { store.data[k] = v; persist(); toast(v ? 'Reminders are on' : 'Reminders are off'); },
  logout: () => { store.data.user = null; persist(); toast('Signed out'); go('signin'); },
  wipe: () => {
    const n = store.data.appts.length;
    const f = Object.keys(store.data.favs).length;
    const back = modalBack(`<h3>Clear everything?</h3>
      <p class="hint">Your profile, ${n} visit${n === 1 ? '' : 's'} and ${f} followed doctor${f === 1 ? '' : 's'} will be erased from this browser. Nothing was ever uploaded, so nothing is left on any server.</p>
      <div style="display:flex;gap:10px;margin-top:18px">
        <button class="btn ghost-dark sm" data-no style="flex:1">Keep my data</button>
        <button class="btn danger sm" data-yes style="flex:1">Erase all</button>
      </div>`);
    back.querySelector('[data-no]').onclick = () => back.remove();
    back.querySelector('[data-yes]').onclick = () => { localStorage.removeItem('hc.v1'); location.reload(); };
  },
  guest: () => go('home'),
});

function modalBack(innerHTML) {
  const back = document.createElement('div');
  back.className = 'modal-back';
  back.innerHTML = `<div class="modal">${innerHTML}</div>`;
  document.body.appendChild(back);
  back.addEventListener('click', (e) => { if (e.target === back) back.remove(); });
  return back;
}

/* eye toggles */
document.addEventListener('click', (e) => {
  const eye = e.target.closest('.eye-btn');
  if (eye) {
    const inp = document.getElementById(eye.getAttribute('data-eye'));
    if (inp) {
      inp.type = inp.type === 'password' ? 'text' : 'password';
      eye.setAttribute('aria-pressed', String(inp.type === 'text'));
      eye.style.color = inp.type === 'text' ? 'var(--brand-strong)' : '';
    }
  }
});

/* boot */
(function boot() {
  if (!location.hash) { location.hash = store.data.onboarding ? '#/home' : '#/onboarding'; renderRoute(); return; }
  renderRoute();
})();
})();
/* APP-END */
