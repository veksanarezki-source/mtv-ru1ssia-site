/* =====================================================
   MTV Россия — логика сайта + панель администратора
   Логин: MTVA   Пароль: MTVA
   ===================================================== */

const LS_KEY = 'mtv_russia_site_v1';
const AUTH_KEY = 'mtv_admin_session';
const LOGIN = 'MTVA';
const PASSWORD = 'MTVA';

/* ---------- Исходное содержимое сайта ---------- */
const DEFAULT_DATA = {
  home: {
    badge: 'Интернет-телеканал 24/7',
    title: 'MTV Россия',
    subtitle: 'Музыка. Кино. Молодёжная культура. Только хиты — и только для тебя.',
    description: 'MTV Россия — современный интернет-телеканал: музыкальные чарты, шоу, трансляции концертов и свежие клипы. Смотри эфир на любом устройстве, где бы ты ни был.',
    stats: [
      { num: '24/7', label: 'в эфире' },
      { num: '100+', label: 'программ и шоу' },
      { num: '1 млн', label: 'зрителей в месяц' }
    ]
  },
  afisha: [
    { date: '03 октября 2026', time: '20:00', title: 'Премьера: «TOP-20 клипов недели»', desc: 'Главный музыкальный чарт канала — голосуй за любимые треки и смотри премьеру.' },
    { date: '10 октября 2026', time: '19:00', title: 'Живой концерт: Открытая сцена MTV', desc: 'Прямой эфир с участием молодых артистов. Задавай вопросы в чате трансляции.' },
    { date: '17 октября 2026', time: '21:00', title: 'Ночь кино: премьеры и хиты', desc: 'Большая подборка клипов и короткометражек до самого утра.' },
    { date: '24 октября 2026', time: '18:00', title: 'Вечеринка MTV: Dance Floor', desc: 'Танцевальный марафон — два часа лучших EDM-хитов без остановки.' }
  ],
  programs: [
    { time: '08:00', name: 'Утро на MTV', desc: 'Бодрое начало дня: новости, чарты и позитив на весь день.' },
    { time: '12:00', name: 'Клипы на заказ', desc: 'Зрители выбирают треки — мы крутим. Заказывай через соцсети.' },
    { time: '16:00', name: 'TOP-20', desc: 'Главный хит-парад недели: двадцать лучших клипов страны.' },
    { time: '20:00', name: 'MTV News', desc: 'Главные новости музыки и шоу-бизнеса за день.' },
    { time: '23:00', name: 'Night Vision', desc: 'Ночная подборка клипов для своих. Тихо, глубоко, атмосферно.' }
  ],
  contacts: {
    phone: '+7 (495) 000-00-00',
    email: 'info@mtv-russia.tv',
    address: 'г. Москва, ул. Тверская, д. 1',
    vk: 'https://vk.com/mtvrussia',
    telegram: 'https://t.me/mtvrussia',
    youtube: 'https://youtube.com/@mtvrussia'
  }
};

/* ---------- Данные ---------- */
let data = loadData();

function loadData() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* повреждённые данные — берём дефолт */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData() {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  renderAll();
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- Навигация ---------- */
const navButtons = document.querySelectorAll('#main-nav button');

navButtons.forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.page)));
document.querySelectorAll('[data-goto]').forEach(b =>
  b.addEventListener('click', () => showPage(b.dataset.goto)));
document.querySelectorAll('.site-footer nav button').forEach(b =>
  b.addEventListener('click', () => showPage(b.dataset.page)));

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  navButtons.forEach(b => b.classList.toggle('current', b.dataset.page === page));
  if (page === 'admin') renderAdmin();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Рендер сайта ---------- */
function renderHome() {
  const h = data.home;
  document.getElementById('home-badge').textContent = h.badge;
  document.getElementById('home-title').textContent = h.title;
  document.getElementById('home-subtitle').textContent = h.subtitle;
  document.getElementById('home-desc').textContent = h.description;
  document.getElementById('home-stats').innerHTML = (h.stats || []).map(s =>
    `<div class="stat"><div class="stat-num">${esc(s.num)}</div><div class="stat-label">${esc(s.label)}</div></div>`
  ).join('');
}

function renderAfisha() {
  document.getElementById('afisha-list').innerHTML = data.afisha.map(ev => `
    <div class="card event">
      <div class="event-date"><span>${esc(ev.date)}</span><span class="event-time">${esc(ev.time)}</span></div>
      <h3>${esc(ev.title)}</h3>
      <p>${esc(ev.desc)}</p>
    </div>`).join('');
}

function renderPrograms() {
  document.getElementById('programs-list').innerHTML = data.programs.map(pr => `
    <div class="card program">
      <div class="program-time">${esc(pr.time)}</div>
      <div class="program-body"><h3>${esc(pr.name)}</h3><p>${esc(pr.desc)}</p></div>
    </div>`).join('');
}

function renderContacts() {
  const c = data.contacts;
  document.getElementById('contact-phone').textContent = c.phone;
  document.getElementById('contact-email').textContent = c.email;
  document.getElementById('contact-address').textContent = c.address;
  document.getElementById('link-vk').href = c.vk || '#';
  document.getElementById('link-tg').href = c.telegram || '#';
  document.getElementById('link-yt').href = c.youtube || '#';
}

function renderAll() {
  renderHome(); renderAfisha(); renderPrograms(); renderContacts();
}

/* ---------- Администратор ---------- */
function isAdmin() { return sessionStorage.getItem(AUTH_KEY) === '1'; }

function renderAdmin() {
  const view = document.getElementById('admin-view');

  if (!isAdmin()) {
    view.innerHTML = `
      <form id="login-form" class="login-form">
        <h2>Вход для администратора</h2>
        <label>Логин<input type="text" id="login-input" required autocomplete="username"></label>
        <label>Пароль<input type="password" id="password-input" required autocomplete="current-password"></label>
        <div id="login-error" class="login-error"></div>
        <button type="submit" class="btn btn-primary">Войти</button>
      </form>`;
    document.getElementById('login-form').addEventListener('submit', e => {
      e.preventDefault();
      const l = document.getElementById('login-input').value.trim();
      const p = document.getElementById('password-input').value.trim();
      if (l === LOGIN && p === PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, '1');
        renderAdmin();
      } else {
        document.getElementById('login-error').textContent = 'Неверный логин или пароль';
      }
    });
    return;
  }

  view.innerHTML = `
    <div class="admin-head">
      <h2>Панель администратора</h2>
      <div>
        <button class="btn" id="btn-reset">Сбросить изменения</button>
        <button class="btn btn-danger" id="btn-logout">Выйти</button>
      </div>
    </div>
    <div class="admin-tabs">
      <button data-tab="home" class="current">Главная</button>
      <button data-tab="afisha">Афиша</button>
      <button data-tab="programs">Программы</button>
      <button data-tab="contacts">Контакты</button>
    </div>
    <div id="admin-tab-content"></div>`;

  document.querySelectorAll('.admin-tabs button').forEach(b =>
    b.addEventListener('click', () => {
      document.querySelectorAll('.admin-tabs button').forEach(x => x.classList.remove('current'));
      b.classList.add('current');
      renderAdminTab(b.dataset.tab);
    }));

  document.getElementById('btn-logout').addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    renderAdmin();
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('Вернуть исходное содержимое сайта? Все ваши правки будут удалены.')) {
      localStorage.removeItem(LS_KEY);
      data = loadData();
      renderAll();
      renderAdminTab(currentTab);
    }
  });

  renderAdminTab('home');
}

/* --- Вкладки редактирования --- */
let currentTab = 'home';

function renderAdminTab(tab) {
  currentTab = tab;
  const box = document.getElementById('admin-tab-content');
  if (tab === 'home') { box.innerHTML = homeForm(); bindHomeForm(); }
  if (tab === 'contacts') { box.innerHTML = contactsForm(); bindContactsForm(); }
  if (tab === 'afisha') { box.innerHTML = listForm('afisha'); bindListForm('afisha'); }
  if (tab === 'programs') { box.innerHTML = listForm('programs'); bindListForm('programs'); }
}

function homeForm() {
  const h = data.home;
  const stats = (h.stats || []).map((s, i) => `
    <div class="admin-item inline">
      <label>Значение ${i + 1}<input type="text" data-stat="${i}" data-k="num" value="${esc(s.num)}"></label>
      <label>Подпись ${i + 1}<input type="text" data-stat="${i}" data-k="label" value="${esc(s.label)}"></label>
    </div>`).join('');
  return `
    <p class="hint">Все изменения сохраняются автоматически и сразу появляются на сайте.</p>
    <label>Бейдж (маленький текст вверху главной)<input type="text" id="f-badge" value="${esc(h.badge)}"></label>
    <label>Заголовок<input type="text" id="f-title" value="${esc(h.title)}"></label>
    <label>Подзаголовок<input type="text" id="f-subtitle" value="${esc(h.subtitle)}"></label>
    <label>Описание<textarea id="f-desc" rows="3">${esc(h.description)}</textarea></label>
    <h3 class="admin-sub">Блок статистики (3 пункта на главной)</h3>
    ${stats}`;
}

function bindHomeForm() {
  const map = { badge: 'f-badge', title: 'f-title', subtitle: 'f-subtitle', description: 'f-desc' };
  Object.entries(map).forEach(([k, id]) => {
    document.getElementById(id).addEventListener('input', e => {
      data.home[k] = e.target.value;
      saveData();
    });
  });
  document.querySelectorAll('[data-stat]').forEach(inp => {
    inp.addEventListener('input', () => {
      data.home.stats[+inp.dataset.stat][inp.dataset.k] = inp.value;
      saveData();
    });
  });
}

const FIELD_LABELS = { date: 'Дата', time: 'Время', title: 'Название', name: 'Название', desc: 'Описание' };
const SECTION_FIELDS = { afisha: ['date', 'time', 'title', 'desc'], programs: ['time', 'name', 'desc'] };

function listForm(section) {
  const fields = SECTION_FIELDS[section];
  const items = data[section].map((item, i) => `
    <div class="admin-item" data-index="${i}">
      ${fields.map(f => `
        <label>${FIELD_LABELS[f]}<input type="text" data-field="${f}" value="${esc(item[f])}"></label>`).join('')}
      <button type="button" class="btn btn-danger btn-del">Удалить запись</button>
    </div>`).join('');
  return `
    <p class="hint">Все изменения сохраняются автоматически и сразу появляются на сайте.</p>
    ${items}
    <button type="button" class="btn" id="btn-add">+ Добавить запись</button>`;
}

function bindListForm(section) {
  const fields = SECTION_FIELDS[section];
  const box = document.getElementById('admin-tab-content');

  box.querySelectorAll('.admin-item').forEach(itemEl => {
    const i = +itemEl.dataset.index;
    itemEl.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', () => {
        data[section][i][inp.dataset.field] = inp.value;
        saveData();
      });
    });
    itemEl.querySelector('.btn-del').addEventListener('click', () => {
      if (confirm('Удалить эту запись?')) {
        data[section].splice(i, 1);
        saveData();
        renderAdminTab(section);
      }
    });
  });

  document.getElementById('btn-add').addEventListener('click', () => {
    const obj = {};
    fields.forEach(f => obj[f] = '');
    data[section].push(obj);
    saveData();
    renderAdminTab(section);
  });
}

function contactsForm() {
  const c = data.contacts;
  const f = (id, label, val) =>
    `<label>${label}<input type="text" id="${id}" value="${esc(val)}"></label>`;
  return `
    <p class="hint">Все изменения сохраняются автоматически и сразу появляются на сайте.</p>
    ${f('c-phone', 'Телефон', c.phone)}
    ${f('c-email', 'E-mail', c.email)}
    ${f('c-address', 'Адрес', c.address)}
    <h3 class="admin-sub">Ссылки на соцсети</h3>
    ${f('c-vk', 'VK', c.vk)}
    ${f('c-tg', 'Telegram', c.telegram)}
    ${f('c-yt', 'YouTube', c.youtube)}`;
}

function bindContactsForm() {
  const map = { phone: 'c-phone', email: 'c-email', address: 'c-address', vk: 'c-vk', telegram: 'c-tg', youtube: 'c-yt' };
  Object.entries(map).forEach(([k, id]) => {
    document.getElementById(id).addEventListener('input', e => {
      data.contacts[k] = e.target.value;
      saveData();
    });
  });
}

/* ---------- Запуск ---------- */
document.getElementById('footer-year').textContent = new Date().getFullYear();
renderAll();
