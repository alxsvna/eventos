/* ================================================================
   ЛОГОТИП
   ================================================================ */
function logoHTML() {
  return `<img src="img/logo.png" alt="ИвентОС" style="height: 100%; width: auto; display: block; object-fit: contain;" onerror="this.style.display='none'">`;
}

function brandHTML(clickable = true, size = 'md') {
  if (size === 'lg') {
    return `<div class="brand brand-lg" ${clickable ? `onclick="go('/')"` : ''}>
      <div style="height: 100px; display: flex; justify-content: center;">${logoHTML()}</div>
      <span class="brand-text">Ивент<span>ОС</span></span>
    </div>`;
  }
  return `<div class="brand" ${clickable ? `onclick="go('/')"` : ''}>
    <div class="brand-logo-wrapper">${logoHTML()}</div>
    <span class="brand-text">Ивент<span>ОС</span></span>
  </div>`;
}

/* ================================================================
   ДАННЫЕ
   ================================================================ */
const STORAGE_KEY = 'eventos_v5';

const SEED = {
  users: [],
  events: [
    { id: 'ev-arctic', title: 'Хакатон «IT-Арктика 2026»', type: 'Хакатон', date: '2026-10-26', location: 'Якутск, АГАТУ', description: 'Праздник в честь закрытия хакатона.', goals: 'Подвести итоги, наградить победителей, 100 гостей', plannedGuests: 100, budgetTotal: 300000, organizer: 'Евдокимова Карина', createdAt: Date.now() },
    { id: 'ev-ny', title: 'Новогодний корпоратив', type: 'Корпоратив', date: '2026-12-28', location: 'Ресторан «Махтал»', description: 'Корпоратив для сотрудников.', goals: 'Поздравить команду', plannedGuests: 80, budgetTotal: 500000, organizer: 'Майорова Валерия', createdAt: Date.now() }
  ],
  tasks: [
    { id: 't1', eventId: 'ev-arctic', title: 'Забронировать зал АГАТУ', assignee: 'Анна', due: '2026-10-01', priority: 'high', status: 'done', comments: [] },
    { id: 't2', eventId: 'ev-arctic', title: 'Заказать награды и кубки', assignee: 'Пётр', due: '2026-10-15', priority: 'high', status: 'in_progress', comments: [{id:'c1', author:'Пётр', text:'Уточняю у поставщика сроки', createdAt: Date.now()}] },
    { id: 't3', eventId: 'ev-arctic', title: 'Согласовать кейтеринг на 100 чел.', assignee: 'Мария', due: '2026-10-20', priority: 'medium', status: 'todo', comments: [] },
    { id: 't4', eventId: 'ev-arctic', title: 'Собрать программу закрытия', assignee: 'Анна', due: '2026-10-10', priority: 'high', status: 'todo', comments: [] },
    { id: 't5', eventId: 'ev-arctic', title: 'Разослать приглашения участникам', assignee: 'Мария', due: '2026-10-18', priority: 'medium', status: 'todo', comments: [] },
    { id: 't6', eventId: 'ev-ny', title: 'Заказать торт', assignee: 'Оля', due: '2026-12-20', priority: 'medium', status: 'todo', comments: [] }
  ],
  budget: [
    { id: 'b1', eventId: 'ev-arctic', category: 'Аренда зала АГАТУ', planned: 50000, actual: 50000 },
    { id: 'b2', eventId: 'ev-arctic', category: 'Кейтеринг (100 чел.)', planned: 150000, actual: 0 },
    { id: 'b3', eventId: 'ev-arctic', category: 'Награды и призы', planned: 60000, actual: 70000 },
    { id: 'b4', eventId: 'ev-arctic', category: 'Оформление сцены', planned: 40000, actual: 0 },
    { id: 'b5', eventId: 'ev-ny', category: 'Ресторан', planned: 300000, actual: 0 }
  ],
  registrations: [
    { id: 'r1', eventId: 'ev-arctic', name: 'Христофорова Ивалина', email: 'ivalina@mail.ru', phone: '+7 914 111-22-33', status: 'confirmed', createdAt: Date.now() },
    { id: 'r2', eventId: 'ev-arctic', name: 'Евдокимова Карина', email: 'karina@mail.ru', phone: '+7 914 222-33-44', status: 'registered', createdAt: Date.now() },
    { id: 'r3', eventId: 'ev-arctic', name: 'Майорова Валерия', email: 'mayorovavv@mail.ru', phone: '+7 914 333-44-55', status: 'attended', createdAt: Date.now() }
  ],
  team: [
    { id: 'm1', eventId: 'ev-arctic', name: 'Анна Иванова', role: 'Координатор', phone: '+7 914 000-11-22', email: 'anna@mail.ru' },
    { id: 'm2', eventId: 'ev-arctic', name: 'Пётр Сидоров', role: 'Логистика', phone: '+7 914 000-33-44', email: 'petr@mail.ru' },
    { id: 'm3', eventId: 'ev-arctic', name: 'Мария Дьячковская', role: 'Коммуникации', phone: '+7 914 000-55-66', email: 'maria@mail.ru' }
  ],
  contractors: [
    { id: 'ct1', eventId: 'ev-arctic', name: 'ООО «Киви Кейтеринг»', service: 'Кейтеринг', cost: 150000, phone: '+7 914 555-66-77', status: 'negotiation' },
    { id: 'ct2', eventId: 'ev-arctic', name: 'ИП Майорова', service: 'Оформление сцены', cost: 40000, phone: '+7 914 888-99-00', status: 'confirmed' }
  ],
  requests: []
};

let DB;
function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) DB = JSON.parse(raw);
  } catch (e) { console.warn('load failed', e); }
  if (!DB) DB = JSON.parse(JSON.stringify(SEED));
  ['users','events','tasks','budget','registrations','team','contractors','requests'].forEach(k => { if (!Array.isArray(DB[k])) DB[k] = []; });
  saveDB();
}
function saveDB() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DB)); } catch (e) {} }
loadDB();

/* ================================================================
   SESSION
   ================================================================ */
const SESSION_KEY = 'eventos_session_v5';
let session = null;
try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch(e) {}
function setSession(u) {
  session = u;
  if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  else localStorage.removeItem(SESSION_KEY);
}
function currentUser() { return session ? DB.users.find(u => u.id === session.id) || null : null; }
function logout() { 
  setSession(null); 
  chatState = null; 
  if (window.socket) { try { window.socket.disconnect(); } catch(e){} }
  location.hash = '/';
  location.reload(); 
}

/* ================================================================
   УТИЛИТЫ
   ================================================================ */
function uid() { return Math.random().toString(36).slice(2, 10); }
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 2600);
}
function fmtMoney(n) { return new Intl.NumberFormat('ru-RU').format(Math.round(n || 0)) + ' ₽'; }
function parseDate(s) { return s ? new Date(s + 'T00:00:00') : null; }
function fmtDate(s) { if (!s) return '—'; const d = parseDate(s); return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }); }
function fmtDateTime(ts) { return new Date(ts).toLocaleString('ru-RU', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }); }
function isOverdue(t) { if (!t.due || t.status === 'done') return false; const d = parseDate(t.due); const today = new Date(); today.setHours(0,0,0,0); return d < today; }
function daysLeft(dateStr) { if (!dateStr) return '—'; return Math.ceil((parseDate(dateStr) - new Date()) / 86400000); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

const PRIORITY_LABEL = { high: 'Высокий', medium: 'Средний', low: 'Низкий' };
const STATUS_LABEL = { registered: 'Ожидает', confirmed: 'Подтверждён', attended: 'Пришёл', cancelled: 'Отменён' };
const CONTRACTOR_STATUS = { negotiation: 'Переговоры', confirmed: 'Подтверждён', done: 'Завершён', cancelled: 'Отменён' };
const REQUEST_STATUS = { new: 'Новая', accepted: 'Принята', rejected: 'Отклонена' };

function eventStats(evId) {
  const ev = DB.events.find(e => e.id === evId);
  if (!ev) return null;
  const tasks = DB.tasks.filter(t => t.eventId === evId);
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(isOverdue).length;
  const budget = DB.budget.filter(b => b.eventId === evId);
  const plan = budget.reduce((s, b) => s + Number(b.planned || 0), 0);
  const fact = budget.reduce((s, b) => s + Number(b.actual || 0), 0);
  const regs = DB.registrations.filter(r => r.eventId === evId);
  const attended = regs.filter(r => r.status === 'attended').length;
  const readiness = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  const costPerGuest = regs.length ? fact / regs.length : 0;
  const attendanceRate = regs.length ? Math.round(attended / regs.length * 100) : 0;
  return { tasks: tasks.length, done, overdue, plan, fact, over: fact > plan ? fact - plan : 0,
    regs: regs.length, attended, attendanceRate, plannedGuests: ev.plannedGuests,
    readiness, daysLeft: daysLeft(ev.date), costPerGuest };
}

/* ================================================================
   ROUTING
   ================================================================ */
let route = { name: 'landing' };
let searchQuery = "";
let calCursor = new Date();

function parseHash() {
  const h = location.hash.replace(/^#/, '') || '/';
  const parts = h.split('/').filter(Boolean);
  const u = currentUser();

  if (parts[0] === 'login') { route = { name: 'login', role: parts[1] || 'client' }; render(); return; }
  if (parts[0] === 'register' && parts[1]) { route = { name: 'register', id: parts[1] }; render(); return; }

  if (!u) { route = { name: 'landing' }; render(); return; }

  if (u.role === 'client') {
    if (parts[0] === 'my-requests') { route = { name: 'myRequests' }; render(); return; }
    route = { name: 'chat' }; render(); return;
  }

  if (parts[0] === 'event' && parts[1]) route = { name: 'event', id: parts[1], tab: parts[2] || 'dashboard' };
  else if (parts[0] === 'create') route = { name: 'create' };
  else if (parts[0] === 'edit' && parts[1]) route = { name: 'edit', id: parts[1] };
  else if (parts[0] === 'calendar') route = { name: 'calendar' };
  else if (parts[0] === 'requests') route = { name: 'requests' };
  else if (parts[0] === 'global-chat') route = { name: 'globalChat' };
  else route = { name: 'list' };
  render();
}
window.addEventListener('hashchange', parseHash);
function go(hash) { location.hash = hash; }

const app = document.getElementById('app');

function render() {
  const u = currentUser();
  switch (route.name) {
    case 'landing': app.innerHTML = viewLanding(); break;
    case 'login': app.innerHTML = viewLogin(route.role); break;
    case 'register': app.innerHTML = viewRegister(route.id); break;
    case 'chat': app.innerHTML = viewChat(); mountChat(); break;
    case 'myRequests': app.innerHTML = viewMyRequests(u); break;
    case 'list': app.innerHTML = viewList(); break;
    case 'create': app.innerHTML = viewEventForm(null); break;
    case 'edit': app.innerHTML = viewEventForm(route.id); break;
    case 'calendar': app.innerHTML = viewCalendar(); break;
    case 'requests': app.innerHTML = viewRequests(); break;
    case 'event': app.innerHTML = viewEvent(route.id, route.tab); break;
    case 'globalChat': app.innerHTML = viewGlobalChat(); mountGlobalChat(); break;
  }
  if (route.name === 'list' && searchQuery !== "") {
    const input = document.getElementById('searchInput');
    if (input) { input.value = searchQuery; input.focus(); input.setSelectionRange(searchQuery.length, searchQuery.length); }
  }
}

function header() {
  const u = currentUser();
  const initials = u ? u.name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() : '';
  const userBadge = u ? `<div class="user-badge">
      <span>${esc(u.name)} · <b>${u.role === 'organizer' ? 'организатор' : 'клиент'}</b></span>
      <div class="avatar-mini">${initials}</div>
      <button class="btn ghost sm" onclick="logout()" style="margin-left:4px">Выйти</button>
    </div>` : '';
  const nav = u ? (u.role === 'organizer' ? `
      <button class="btn ghost sm" onclick="go('/global-chat')" style="color:var(--accent); border-color:var(--accent)">Общий чат</button>
      <button class="btn ghost sm" onclick="go('/calendar')">Календарь</button>
      <button class="btn ghost sm" onclick="exportAll()">Экспорт</button>
    ` : `
      <button class="btn ghost sm" onclick="go('/chat')">Чат-бот</button>
      <button class="btn ghost sm" onclick="go('/my-requests')">Мои заявки</button>
    `) : '';
  return `<header class="top">
    ${brandHTML()}
    <div class="row" style="flex:0 0 auto; gap:8px; align-items:center;">${nav}${userBadge}</div>
  </header>`;
}

function viewLanding() {
  return `
    <div class="landing-hero">
      <div style="display:flex;justify-content:center">${brandHTML(false, 'lg')}</div>
      <p class="lead">Единая платформа для организации мероприятий: от брифа клиента до контроля бюджета и задач команды.</p>
      <div class="role-cards">
        <div class="role-card" onclick="go('/login/client')">
          <div style="height: 120px; display: flex; justify-content: center; margin-bottom: 14px;">
            <img src="img/client.png" alt="Клиент" style="height: 100%; width: auto; object-fit: contain;" onerror="this.style.display='none'">
          </div>
          <h3>Я клиент</h3>
          <p>Хочу организовать мероприятие. Расскажите боту о пожеланиях - организаторы свяжутся с вами.</p>
          <button class="btn full" style="background:linear-gradient(135deg,#6b9bd1,#4a7ab5)" onclick="event.stopPropagation();go('/login/client')">Начать как клиент</button>
        </div>
        <div class="role-card" onclick="go('/login/organizer')">
          <div style="height: 120px; display: flex; justify-content: center; margin-bottom: 14px;">
            <img src="img/organizer.png" alt="Организатор" style="height: 100%; width: auto; object-fit: contain;" onerror="this.style.display='none'">
          </div>
          <h3>Я организатор</h3>
          <p>Управляю мероприятиями, задачами, бюджетом, командой и заявками клиентов.</p>
          <button class="btn full" onclick="event.stopPropagation();go('/login/organizer')">Начать как организатор</button>
        </div>
      </div>
    </div>`;
}

function viewLogin(role) {
  const isOrg = role === 'organizer';
  return `${authHeader()}
    <div class="card reg-form">
      <h1>Вход - ${isOrg ? 'организатор' : 'клиент'}</h1>
      <p class="muted" style="margin-bottom:22px">
        ${isOrg ? 'Введите имя и email - этого достаточно для демо.' : 'Введите имя, email и телефон - бот сразу начнёт сбор брифа.'}
      </p>
      <form onsubmit="doQuickLogin(event,'${role}')">
        <div class="field"><label>Имя *</label><input name="name" required placeholder="Иван Иванов" autocomplete="name"></div>
        <div class="field"><label>Email *</label><input type="email" name="email" required placeholder="you@example.com" autocomplete="email"></div>
        ${isOrg ? '' : `<div class="field"><label>Телефон *</label><input name="phone" required placeholder="+7 999 123-45-67" autocomplete="tel"></div>`}
        <button class="btn full" type="submit" style="margin-top:6px">Войти</button>
      </form>
      <div class="hint" style="text-align:center;margin-top:18px">
        <a href="#/" style="color:var(--muted)">← На главную</a>
      </div>
    </div>`;
}

function doQuickLogin(e, role) {
  e.preventDefault();
  const f = e.target;
  const email = f.email.value.trim().toLowerCase();
  const name = f.name.value.trim();
  const phone = f.phone ? f.phone.value.trim() : '';

  if (!email || !name) { toast('Заполните имя и email'); return; }
  if (role === 'client' && !phone) { toast('Укажите телефон - организатору нужно с вами связаться'); return; }

  let user = DB.users.find(u => u.email === email && u.role === role);

  if (!user) {
    user = { id: uid(), role, name, email, phone, createdAt: Date.now() };
    DB.users.push(user);
    saveDB();
    toast(role === 'client' ? 'Аккаунт создан, переходим к боту' : 'Аккаунт создан');
  } else {
    user.name = name;
    if (phone) user.phone = phone;
    saveDB();
    toast('С возвращением!');
  }

  setSession({ id: user.id, role: user.role });
  if (role === 'client') { chatState = null; go('/chat'); }
  else go('/');
}

function authHeader() {
  return `<header class="top">${brandHTML()}<div></div></header>`;
}

function viewMyRequests(u) {
  const list = DB.requests.filter(r => r.clientId === u.id).sort((a,b) => b.createdAt - a.createdAt);
  const cards = list.length ? list.map(r => {
    const b = r.brief || {};
    return `<div class="request-card">
      <div class="rc-head">
        <b>${esc(b.title || 'Заявка')}</b>
        <span class="badge ${r.status === 'accepted' ? 'ok' : r.status === 'rejected' ? 'danger' : 'info'}">${REQUEST_STATUS[r.status] || r.status}</span>
      </div>
      <div class="rc-body">
        <div>${esc(b.date || '—')} · ${esc(b.guests || '—')} гостей · ${esc(b.budget || '—')}</div>
        <div>${esc(b.wishes || '—')}</div>
        <div class="muted" style="margin-top:6px;font-size:12px">Отправлено: ${fmtDateTime(r.createdAt)}</div>
      </div>
    </div>`;
  }).join('') : `<div class="empty">Пока нет заявок. <a href="#/chat" style="color:var(--primary);font-weight:600">Создать через чат-бот</a></div>`;
  return `${header()}
    <div class="card"><h1>Мои заявки</h1><p class="muted">Статус обработки организаторами</p></div>
    <div class="card">${cards}</div>`;
}

/* ================================================================
   ЧАТ-БОТ
   ================================================================ */
let chatState = null;

const CHAT_QUESTIONS = [
  { key: 'title',   q: 'Как назовём мероприятие?', hint: 'Например: «Корпоратив для команды»' },
  { key: 'type',    q: 'Какой это тип мероприятия?', options: ['Корпоратив','Конференция','Хакатон','Форум','Выставка','Фестиваль','День рождения','Другое'] },
  { key: 'date',    q: 'На какую дату планируете? (можно «примерно», или формат ГГГГ-ММ-ДД)', hint: '2026-12-15' },
  { key: 'guests',  q: 'Сколько ожидается гостей?', hint: 'Например: 80' },
  { key: 'budget',  q: 'Какой примерный бюджет? (₽)', hint: 'Например: 300000' },
  { key: 'location',q: 'Есть ли пожелания по месту проведения?', hint: 'Якутск, ресторан...' },
  { key: 'wishes',  q: 'Расскажите о пожеланиях: атмосфера, программа, особые требования?', hint: 'Свободный текст' }
];

function newChatState() {
  return { step: 0, brief: {}, messages: [
    { from: 'bot', text: 'Здравствуйте! Я ИИ-ассистент ИвентОС.\nПомогу собрать информацию о вашем мероприятии и отправлю организаторам они с вами свяжутся - это займёт 2 минуты. Как к вам обращаться?' }
  ]};
}

function viewChat() {
  if (!chatState) chatState = newChatState();
  const u = currentUser();
  return `${header()}
    <div class="chat-shell">
      <div class="chat-window">
        <div class="chat-head">
          <div class="avatar">ИИ</div>
          <div class="info"><b>ИИ-ассистент</b><span>Сбор брифа · ${esc(u.name)}</span></div>
        </div>
        <div class="chat-log" id="chatLog"></div>
        <div class="chat-quick" id="chatQuick"></div>
        <form class="chat-input" onsubmit="chatSend(event)">
          <label class="btn ghost" style="padding: 12px; cursor:pointer; margin:0" title="Прикрепить список гостей">
            📎
            <input type="file" id="clientFileUpload" style="display:none" accept=".xlsx, .xls, .docx, .txt, .csv" onchange="uploadClientFile(this)">
          </label>
          <input id="chatInput" autocomplete="off" placeholder="Ваш ответ...">
          <button class="btn" type="submit">→</button>
        </form>
      </div>
      <div class="hint" style="text-align:center;margin-top:14px">
        <a href="#/my-requests">Мои заявки</a> ·
        <a href="#/chat" onclick="chatState=null" style="color:var(--muted)">Начать заново</a>
      </div>
    </div>`;
}

function mountChat() {
  renderChatLog();
  setTimeout(() => document.getElementById('chatInput')?.focus(), 50);
}

function renderChatLog() {
  const log = document.getElementById('chatLog');
  if (!log || !chatState) return;
  log.innerHTML = chatState.messages.map(m =>
    `<div class="msg ${m.from}">${esc(m.text).replace(/\n/g,'<br>')}</div>`
  ).join('');
  log.scrollTop = log.scrollHeight;

  const quick = document.getElementById('chatQuick');
  if (quick) {
    const q = CHAT_QUESTIONS[chatState.step];
    if (q && q.options && chatState.step < CHAT_QUESTIONS.length) {
      quick.innerHTML = q.options.map(o => `<button type="button" onclick="chatQuick('${esc(o)}')">${esc(o)}</button>`).join('');
    } else if (chatState.step >= CHAT_QUESTIONS.length) {
      quick.innerHTML = `<button type="button" onclick="chatSubmitBrief()">Отправить заявку организаторам</button>`;
    } else {
      quick.innerHTML = '';
    }
  }
}

function chatQuick(text) {
  const input = document.getElementById('chatInput');
  if (input) input.value = text;
  chatSend(new Event('submit'));
}

function chatSend(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  chatState.messages.push({ from: 'user', text });
  input.value = '';

  const q = CHAT_QUESTIONS[chatState.step];
  if (q) {
    chatState.brief[q.key] = text;
    chatState.step++;
    const next = CHAT_QUESTIONS[chatState.step];
    setTimeout(() => {
      if (next) {
        chatState.messages.push({ from: 'bot', text: next.q });
      } else {
        const b = chatState.brief;
        chatState.messages.push({ from: 'bot', text:
          `Отлично! Вот что получилось:\n\n` +
          `Название: ${b.title}\nТип: ${b.type}\nДата: ${b.date}\nГостей: ${b.guests}\nБюджет: ${b.budget} ₽\nМесто: ${b.location || '—'}\nПожелания: ${b.wishes}\n\n` +
          `Нажмите «Отправить заявку», и она уйдёт организаторам вместе с вашими контактами.`
        });
      }
      renderChatLog();
    }, 350);
  }
  renderChatLog();
}

function chatSubmitBrief() {
  const u = currentUser();
  const req = {
    id: uid(), clientId: u.id, clientName: u.name,
    clientEmail: u.email, clientPhone: u.phone || '',
    brief: chatState.brief, status: 'new', createdAt: Date.now()
  };
  DB.requests.push(req); saveDB();
  chatState.messages.push({ from: 'bot', text: 'Заявка отправлена организаторам! Они свяжутся с вами в ближайшее время. Спасибо!' });
  chatState.step = CHAT_QUESTIONS.length + 1;
  renderChatLog();
  toast('Заявка отправлена');
}

async function uploadClientFile(input) {
  if (!input.files || !input.files.length) return;
  const file = input.files[0];
  const u = currentUser();
  const userReq = DB.requests.find(r => r.clientId === u.id && r.eventId);
  
  if (!userReq || !userReq.eventId) {
    toast('Файл можно прикрепить только после того, как организатор примет вашу заявку');
    return;
  }

  chatState.messages.push({ from: 'user', text: `📎 Прикрепил файл: ${file.name}` });
  renderChatLog();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('eventId', userReq.eventId);
  formData.append('clientId', u.id);

  try {
    const response = await fetch('/api/upload-client-list', { method: 'POST', body: formData });
    const data = await response.json();
    if (data.success) {
      chatState.messages.push({ from: 'bot', text: `Отлично! Я получил файл, нашел в нем ${data.count} почт и передал организатору.` });
    } else {
      chatState.messages.push({ from: 'bot', text: `Ошибка: ${data.error}` });
    }
  } catch (err) {
    chatState.messages.push({ from: 'bot', text: 'Ошибка сети. Попробуйте позже.' });
  }
  renderChatLog();
  input.value = '';
}

function viewRequests() {
  const list = DB.requests.slice().sort((a,b) => b.createdAt - a.createdAt);
  const cards = list.length ? list.map(r => {
    const b = r.brief || {};
    return `<div class="request-card">
      <div class="rc-head">
        <b>${esc(b.title || 'Заявка')}</b>
        <span class="badge ${r.status === 'accepted' ? 'ok' : r.status === 'rejected' ? 'danger' : 'info'}">${REQUEST_STATUS[r.status] || r.status}</span>
      </div>
      <div class="rc-body">
        <div>Тип: ${esc(b.type || '—')} · Дата: ${esc(b.date || '—')} · Гостей: ${esc(b.guests || '—')} · Бюджет: ${esc(b.budget || '—')} ₽</div>
        <div>Место: ${esc(b.location || '—')}</div>
        <div>Пожелания: ${esc(b.wishes || '—')}</div>
        <div style="margin-top:10px">Клиент: <b>${esc(r.clientName)}</b> · ${esc(r.clientEmail)} ${r.clientPhone ? '· ' + esc(r.clientPhone) : ''}</div>
        <div class="muted" style="font-size:12px;margin-top:4px">${fmtDateTime(r.createdAt)}</div>
      </div>
      <div class="rc-actions">
        ${r.status === 'new' ? `
          <button class="btn sm" onclick="acceptRequest('${r.id}')">Принять и создать мероприятие</button>
          <button class="btn danger sm" onclick="rejectRequest('${r.id}')">Отклонить</button>
        ` : ''}
        <a href="mailto:${esc(r.clientEmail)}" class="btn ghost sm" style="text-decoration:none;display:inline-block">Написать</a>
      </div>
    </div>`;
  }).join('') : `<div class="empty">Пока нет заявок от клиентов</div>`;

  return `${header()}
    <div class="card" style="padding:32px;">
      <h1>Заявки от клиентов</h1>
      <p class="muted">Брифы, собранные ИИ-ботом. Примите заявку - создастся мероприятие с предзаполненными данными.</p>
    </div>
    <div class="card">${cards}</div>`;
}

function acceptRequest(id) {
  const r = DB.requests.find(r => r.id === id);
  if (!r) return;
  const b = r.brief || {};
  const guests = parseInt(String(b.guests).replace(/\D/g,'')) || 50;
  const budget = parseInt(String(b.budget).replace(/\D/g,'')) || 100000;
  let date = '';
  const m = String(b.date || '').match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) date = m[0];
  const ev = {
    id: uid(),
    title: b.title || 'Мероприятие от клиента',
    type: ['Корпоратив','Конференция','Хакатон','Форум','Выставка','Фестиваль','День рождения','Другое'].includes(b.type) ? b.type : 'Другое',
    date: date || new Date().toISOString().slice(0,10),
    location: b.location || '',
    description: b.wishes || '',
    goals: '',
    plannedGuests: guests,
    budgetTotal: budget,
    organizer: currentUser().name,
    createdAt: Date.now()
  };
  DB.events.push(ev);
  r.status = 'accepted';
  r.eventId = ev.id;
  saveDB();
  toast('Мероприятие создано из заявки');
  go('/event/' + ev.id + '/dashboard');
}
function rejectRequest(id) {
  const r = DB.requests.find(r => r.id === id);
  if (r) { r.status = 'rejected'; saveDB(); render(); toast('Заявка отклонена'); }
}

function handleSearch(e) {
  searchQuery = e.target.value;
  const grid = document.getElementById('eventGrid');
  if (!grid) return;
  const filtered = DB.events.filter(ev =>
    ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (filtered.length === 0) grid.innerHTML = `<div class="empty">Ничего не найдено по запросу "${esc(searchQuery)}"</div>`;
  else grid.innerHTML = filtered.map(ev => renderEventCard(ev)).join('');
}

function getEventIcon(type) {
  switch(type) {
    case 'Конференция': return 'img/konferens.png';
    case 'Корпоратив': return 'img/korporativ.png';
    case 'Форум': return 'img/forum.png';
    case 'Выставка': return 'img/vystavka.png';
    case 'Фестиваль': return 'img/festival.png';
    case 'Хакатон': return 'img/hakaton.png';
    case 'День рождения': return 'img/den-pogdenie.png';
    default: return 'img/drugoe.png';
  }
}

function renderEventCard(ev) {
  const s = eventStats(ev.id);
  const cls = s.overdue > 0 || s.over > 0 ? 'danger' : s.readiness >= 100 ? 'ok' : 'warn';
  const imgSrc = getEventIcon(ev.type);
  return `<div class="event-card" onclick="go('/event/${ev.id}/dashboard')">
    <div class="event-header">
      <div class="event-icon"><img src="${imgSrc}" alt="${esc(ev.type)}" onerror="this.style.display='none'"></div>
      <div class="event-title-box">
        <h3>${esc(ev.title)}</h3>
        <div class="meta">${esc(ev.type)} · ${fmtDate(ev.date)}</div>
      </div>
      <span class="badge ${cls}" style="margin-left:auto">${s.readiness}%</span>
    </div>
    <div class="progress ${cls}"><div style="width:${s.readiness}%"></div></div>
    <div class="meta" style="display:flex; justify-content:space-between; font-size:13px; color:var(--muted)">
      <span>${ev.plannedGuests} гостей</span>
      <span>${s.done}/${s.tasks} задач</span>
    </div>
  </div>`;
}

function viewList() {
  const totalTasks = DB.tasks.length;
  const totalDone = DB.tasks.filter(t => t.status === 'done').length;
  const totalGuests = DB.registrations.length;
  const totalBudget = DB.budget.reduce((s, b) => s + Number(b.actual || 0), 0);
  const newRequests = DB.requests.filter(r => r.status === 'new').length;
  const cards = DB.events.length ? DB.events.map(ev => renderEventCard(ev)).join('') : `<div class="empty">Пока нет мероприятий</div>`;

  return `${header()}
    <div class="card" style="padding:32px;">
      <div class="dashboard-header">
        <div><h1>Мероприятия</h1><div class="muted">Управляйте всеми проектами в одном месте</div></div>
        <div class="row" style="flex:0 0 auto; align-items:center;">
          <div class="search-bar">
            <span>Поиск</span>
            <input type="text" id="searchInput" placeholder="Поиск мероприятия..." oninput="handleSearch(event)">
          </div>
          <button class="btn" onclick="go('/create')" style="flex:0 0 auto">+ Добавить</button>
        </div>
      </div>

      <div class="grid cols-4" style="margin-top: 24px;">
        <div class="stat">
          <div class="stat-icon"><img src="img/vypolneno.png" alt="" onerror="this.parentElement.innerHTML='';"></div>
          <div class="stat-info"><div class="num">${DB.events.length}</div><div class="lbl">Всего событий</div></div>
        </div>
        <div class="stat">
          <div class="stat-icon"><img src="img/zadachi.png" alt="" onerror="this.parentElement.innerHTML='';"></div>
          <div class="stat-info"><div class="num">${totalDone}/${totalTasks}</div><div class="lbl">Задач выполнено</div></div>
        </div>
        <div class="stat">
          <div class="stat-icon"><img src="img/gosti.png" alt="" onerror="this.parentElement.innerHTML='';"></div>
          <div class="stat-info"><div class="num">${totalGuests}</div><div class="lbl">Гостей всего</div></div>
        </div>
        <div class="stat">
          <div class="stat-icon"><img src="img/mani.png" alt="" onerror="this.parentElement.innerHTML='';"></div>
          <div class="stat-info"><div class="num">${fmtMoney(totalBudget)}</div><div class="lbl">Факт. бюджет</div></div>
        </div>
      </div>
    </div>

    <div class="notice" onclick="go('/requests')">
      <div>
        <b>Заявки от клиентов</b>
        <div class="muted" style="margin-top:2px">Брифы, собранные ИИ-ботом</div>
      </div>
      <span class="badge ${newRequests ? 'danger' : 'info'}">${newRequests ? newRequests + ' новых' : 'нет новых'}</span>
    </div>

    <div style="height:20px"></div>

    <div class="grid cols-2" id="eventGrid">${cards}</div>`;
}

function viewEventForm(id) {
  const isEdit = !!id;
  const ev = isEdit ? DB.events.find(e => e.id === id) : null;
  if (isEdit && !ev) return `${header()}<div class="card empty">Мероприятие не найдено. <a href="#/" style="color:var(--primary)">На главную</a></div>`;
  const v = ev || { title:'', type:'Конференция', date:'', location:'', plannedGuests:100, budgetTotal:100000, description:'', goals:'', organizer: currentUser()?.name || '' };
  return `${header()}
    <div class="card">
      <h1>${isEdit ? 'Редактировать мероприятие' : 'Новое мероприятие'}</h1>
      <p class="muted" style="margin-bottom:22px">${isEdit ? 'Измените нужные параметры.' : 'Заполните параметры — их можно изменить позже.'}</p>
      <form onsubmit="saveEvent(event, ${isEdit ? `'${id}'` : 'null'})">
        <div class="grid cols-2">
          <div class="field"><label>Название *</label><input name="title" required value="${esc(v.title)}"></div>
          <div class="field"><label>Тип</label><select name="type">
            ${['Конференция','Корпоратив','Форум','Выставка','Фестиваль','Хакатон','Другое','День рождения'].map(t => `<option ${v.type===t?'selected':''}>${t}</option>`).join('')}
          </select></div>
          <div class="field"><label>Дата проведения *</label><input type="date" name="date" required value="${esc(v.date)}"></div>
          <div class="field"><label>Место / ссылка</label><input name="location" value="${esc(v.location)}"></div>
          <div class="field"><label>Планируемое число гостей</label><input type="number" name="plannedGuests" min="0" value="${v.plannedGuests}"></div>
          <div class="field"><label>Бюджет, ₽</label><input type="number" name="budgetTotal" min="0" value="${v.budgetTotal}"></div>
          <div class="field"><label>Ответственный организатор</label><input name="organizer" value="${esc(v.organizer||'')}"></div>
        </div>
        <div class="field"><label>Описание</label><textarea name="description" rows="2">${esc(v.description)}</textarea></div>
        <div class="field"><label>Цели</label><input name="goals" value="${esc(v.goals)}"></div>
        <div class="row" style="margin-top:6px">
          <button class="btn" type="submit" style="flex:0 0 auto">${isEdit ? 'Сохранить' : 'Создать'}</button>
          <button class="btn ghost" type="button" style="flex:0 0 auto" onclick="${isEdit ? `go('/event/${id}/dashboard')` : `go('/')`}">Отмена</button>
        </div>
      </form>
    </div>`;
}

function viewEvent(id, tab) {
  const ev = DB.events.find(e => e.id === id);
  if (!ev) return `${header()}<div class="card empty">Мероприятие не найдено</div>`;
  const tabs = [['dashboard', 'Дашборд'], ['tasks', 'Задачи'], ['budget', 'Бюджет'], ['regs', 'Регистрация'], ['team', 'Команда']]
    .map(([k, label]) => `<div class="tab ${tab === k ? 'active' : ''}" onclick="go('/event/${id}/${k}')">${label}</div>`).join('');
  let body = '';
  if (tab === 'dashboard') body = tabDashboard(ev);
  else if (tab === 'tasks') body = tabTasks(ev);
  else if (tab === 'budget') body = tabBudget(ev);
  else if (tab === 'regs') body = tabRegs(ev);
  else if (tab === 'team') body = tabTeam(ev);

  return `${header()}
    <div class="card" style="padding: 32px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div>
          <h1>${esc(ev.title)}</h1>
          <div class="muted">${esc(ev.type)} · ${fmtDate(ev.date)} · ${esc(ev.location || 'место не указано')} · ${ev.plannedGuests} гостей${ev.organizer ? ' · Организатор: ' + esc(ev.organizer) : ''}</div>
        </div>
        <div class="row" style="flex:0 0 auto; width:auto">
          <button class="btn ghost sm" onclick="go('/')" style="flex:0 0 auto">← К списку</button>
          <button class="btn ghost sm" onclick="go('/edit/${id}')" style="flex:0 0 auto">Изменить</button>
          <button class="btn danger sm" onclick="deleteEvent('${id}')" style="flex:0 0 auto">Удалить</button>
        </div>
      </div>
    </div>
    <div class="tabs">${tabs}</div>
    ${body}`;
}

function tabDashboard(ev) {
  const s = eventStats(ev.id);
  const cls = s.overdue > 0 || s.over > 0 ? 'danger' : s.readiness >= 100 ? 'ok' : 'warn';
  const riskLabel = cls === 'danger' ? 'Требует внимания' : cls === 'warn' ? 'Идёт подготовка' : 'Всё готово';
  return `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px">
        <h2 style="margin:0">Готовность мероприятия</h2><span class="badge ${cls}">${riskLabel}</span>
      </div>
      <div class="progress ${cls}"><div style="width:${s.readiness}%"></div></div>
      <div class="muted">${s.readiness}% - выполнено ${s.done} из ${s.tasks} задач · до мероприятия ${s.daysLeft} дн.</div>
    </div>
    <div class="grid cols-4">
      <div class="stat"><div class="stat-info"><div class="num">${s.done}/${s.tasks}</div><div class="lbl">Задачи выполнены</div></div></div>
      <div class="stat"><div class="stat-info"><div class="num" style="color:${s.overdue ? 'var(--danger)' : 'inherit'}">${s.overdue}</div><div class="lbl">Просрочено</div></div></div>
      <div class="stat"><div class="stat-info"><div class="num" style="color:${s.over ? 'var(--danger)' : 'inherit'}">${fmtMoney(s.fact)}</div><div class="lbl">Факт (план ${fmtMoney(s.plan)})</div></div></div>
      <div class="stat"><div class="stat-info"><div class="num">${s.regs}/${s.plannedGuests}</div><div class="lbl">Регистрации</div></div></div>
    </div>
    <div class="card">
      <h2>Светофор рисков</h2>
      <div class="risk-bar">
        <div class="risk-item"><div class="rl">Просроченные задачи</div><div class="rv" style="color:${s.overdue ? 'var(--danger)' : 'var(--ok)'}">${s.overdue}</div></div>
        <div class="risk-item"><div class="rl">Превышение бюджета</div><div class="rv" style="color:${s.over ? 'var(--danger)' : 'var(--ok)'}">${s.over ? '+' + fmtMoney(s.over) : 'нет'}</div></div>
        <div class="risk-item"><div class="rl">Регистрации</div><div class="rv">${s.regs} из ${s.plannedGuests}</div></div>
        <div class="risk-item"><div class="rl">До мероприятия</div><div class="rv">${s.daysLeft} дн.</div></div>
      </div>
    </div>
    <div class="card">
      <h2>Аналитика участников</h2>
      <div class="risk-bar">
        <div class="risk-item"><div class="rl">Пришло / зарегистрировано</div><div class="rv">${s.attended}/${s.regs} (${s.attendanceRate}%)</div></div>
        <div class="risk-item"><div class="rl">План гостей</div><div class="rv">${s.plannedGuests}</div></div>
        <div class="risk-item"><div class="rl">Стоимость привлечения</div><div class="rv">${s.regs ? fmtMoney(s.costPerGuest) : '—'}</div></div>
        <div class="risk-item"><div class="rl">Заполнение плана</div><div class="rv">${s.plannedGuests ? Math.round(s.regs / s.plannedGuests * 100) : 0}%</div></div>
      </div>
    </div>`;
}

function tabTasks(ev) {
  const tasks = DB.tasks.filter(t => t.eventId === ev.id);
  const cols = [{ key: 'todo', title: 'Надо сделать' }, { key: 'in_progress', title: 'В работе' }, { key: 'done', title: 'Готово' }];
  const colHtml = cols.map(c => {
    const items = tasks.filter(t => t.status === c.key).map(t => {
      const od = isOverdue(t);
      const next = t.status === 'todo' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'todo';
      const nextLabel = t.status === 'todo' ? 'В работу' : t.status === 'in_progress' ? 'Готово' : 'Вернуть';
      const pr = t.priority || 'medium';
      const comments = (t.comments || []).map(cm => `<div class="t-comment"><b>${esc(cm.author||'—')}:</b> ${esc(cm.text)}</div>`).join('');
      return `<div class="task p-${pr} ${od ? 'overdue' : ''}">
        <div class="t-title"><span>${esc(t.title)}</span><span class="badge p-${pr}" style="font-size:10px;padding:3px 8px">${PRIORITY_LABEL[pr]}</span></div>
        <div class="t-meta"><span>${esc(t.assignee || '—')}</span><span>${t.due ? fmtDate(t.due) : 'без срока'}${od ? ' (просрочено)' : ''}</span></div>
        <div class="t-comments">
          ${comments}
          <form class="t-comment-form" onsubmit="addComment(event,'${t.id}')">
            <input name="text" placeholder="Комментарий..." required>
            <button class="btn sm" type="submit" style="flex:0 0 auto">+</button>
          </form>
        </div>
        <div class="t-actions">
          <button onclick="moveTask('${t.id}','${next}')">${nextLabel}</button>
          <button onclick="deleteTask('${t.id}')">Удалить</button>
        </div>
      </div>`;
    }).join('') || `<div class="muted" style="padding:6px;font-size:13px">Пусто</div>`;
    return `<div class="col"><h4>${c.title} (${tasks.filter(t => t.status === c.key).length})</h4>${items}</div>`;
  }).join('');

  return `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:14px">
        <h2 style="margin:0">Задачи подготовки</h2>
        <button class="btn ai sm" onclick="generatePlan('${ev.id}')">Сгенерировать план</button>
      </div>
      <form onsubmit="addTask(event,'${ev.id}')" class="grid cols-3" style="align-items:end;margin-bottom:12px">
        <div class="field" style="margin:0"><label>Задача</label><input name="title" required></div>
        <div class="field" style="margin:0"><label>Ответственный</label><input name="assignee"></div>
        <div class="field" style="margin:0"><label>Срок</label><input type="date" name="due"></div>
        <div class="field" style="margin:0"><label>Приоритет</label><select name="priority">
          <option value="medium">Средний</option><option value="high">Высокий</option><option value="low">Низкий</option>
        </select></div>
        <div style="grid-column:1/-1"><button class="btn" type="submit">+ Добавить задачу</button></div>
      </form>
    </div>
    <div class="kanban">${colHtml}</div>`;
}

function tabBudget(ev) {
  const items = DB.budget.filter(b => b.eventId === ev.id);
  const plan = items.reduce((s, b) => s + Number(b.planned || 0), 0);
  const fact = items.reduce((s, b) => s + Number(b.actual || 0), 0);
  const over = fact > plan;
  const rows = items.map(b => {
    const diff = Number(b.actual) - Number(b.planned);
    return `<tr class="${diff > 0 ? 'over' : ''}">
      <td>${esc(b.category)}</td><td>${fmtMoney(b.planned)}</td>
      <td><input type="number" value="${b.actual}" style="width:130px;padding:8px" onchange="updateActual('${b.id}', this.value)"></td>
      <td style="color:${diff > 0 ? 'var(--danger)' : diff < 0 ? 'var(--ok)' : 'inherit'};font-weight:600">${diff === 0 ? '—' : (diff > 0 ? '+' : '') + fmtMoney(diff)}</td>
      <td><button class="btn ghost sm" onclick="deleteBudget('${b.id}')">Удалить</button></td>
    </tr>`;
  }).join('') || `<tr><td colspan="5" class="muted">Нет статей расходов</td></tr>`;
  return `
    <div class="card">
      <h2>Бюджет мероприятия</h2>
      ${over ? `<div class="badge danger" style="margin-bottom:14px">Превышение бюджета на ${fmtMoney(fact - plan)}</div>` : `<div class="badge ok" style="margin-bottom:14px">Бюджет в норме</div>`}
      <table>
        <thead><tr><th>Статья</th><th>План</th><th>Факт</th><th>Разница</th><th></th></tr></thead>
        <tbody>${rows}
          <tr class="total-row"><td>ИТОГО</td><td>${fmtMoney(plan)}</td><td>${fmtMoney(fact)}</td><td style="color:${over ? 'var(--danger)' : 'var(--ok)'}">${over ? '+' : ''}${fmtMoney(fact - plan)}</td><td></td></tr>
        </tbody>
      </table>
      <form onsubmit="addBudget(event,'${ev.id}')" class="grid cols-4" style="margin-top:22px;align-items:end">
        <div class="field" style="margin:0"><label>Статья расхода</label><input name="category" required></div>
        <div class="field" style="margin:0"><label>План, ₽</label><input type="number" name="planned" min="0" value="0"></div>
        <div class="field" style="margin:0"><label>Факт, ₽</label><input type="number" name="actual" min="0" value="0"></div>
        <div style="grid-column:1/-1"><button class="btn" type="submit">+ Добавить статью</button></div>
      </form>
    </div>`;
}

function tabRegs(ev) {
  const regs = DB.registrations.filter(r => r.eventId === ev.id);
  const rows = regs.map(r => `<tr>
    <td>${esc(r.name)}</td><td>${esc(r.email)}</td><td>${esc(r.phone || '—')}</td>
    <td><select onchange="updateRegStatus('${r.id}', this.value)" style="padding:8px;max-width:160px">
      ${Object.entries(STATUS_LABEL).map(([v, l]) => `<option value="${v}" ${r.status === v ? 'selected' : ''}>${l}</option>`).join('')}
    </select></td>
    <td><button class="btn ghost sm" onclick="deleteReg('${r.id}')">Удалить</button></td>
  </tr>`).join('') || `<tr><td colspan="5" class="muted">Пока никто не зарегистрировался</td></tr>`;
  const link = location.origin + location.pathname + '#/register/' + ev.id;
  
  setTimeout(() => {
    const container = document.getElementById('client-list-info');
    if(!container) return;
    fetch(`/api/get-client-list/${ev.id}`).then(r=>r.json()).then(data=>{
      if(data.exists) container.innerHTML = `<div style="background:#e0f2e9; padding:16px; border-radius:8px; border:1px solid #3d9970;"><b>Клиент загрузил файл:</b> ${data.fileName} (${data.emails.length} почт)</div>`;
    }).catch(()=>{});
  }, 100);

  return `
    <div class="card">
      <h2>Регистрация участников</h2>
      <div class="grid cols-3" style="margin-bottom:20px">
        <div class="stat"><div class="stat-info"><div class="num">${regs.length}</div><div class="lbl">Всего регистраций</div></div></div>
        <div class="stat"><div class="stat-info"><div class="num">${regs.filter(r => r.status === 'attended').length}</div><div class="lbl">Пришли</div></div></div>
        <div class="stat"><div class="stat-info"><div class="num">${ev.plannedGuests}</div><div class="lbl">План гостей</div></div></div>
      </div>
      <div class="muted" style="margin-bottom:8px">Публичная ссылка для гостей:</div>
      <div class="row">
        <input readonly value="${link}" id="regLink" style="background:var(--primary-soft); color:var(--muted)">
        <button class="btn ghost" onclick="copyRegLink()" style="flex:0 0 auto">Скопировать</button>
        <button class="btn" onclick="openRegPage('${ev.id}')" style="flex:0 0 auto">Открыть</button>
        <button class="btn ghost" onclick="exportRegs('${ev.id}')" style="flex:0 0 auto">CSV</button>
      </div>
    </div>

    <div id="client-list-info" style="margin-bottom: 20px;"></div>

    <div class="card">
      <h2>Рассылка приглашений</h2>
      <div id="drop-zone" style="border: 2px dashed var(--border-strong); border-radius: var(--radius-sm); padding: 30px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--surface-soft);" 
           onclick="document.getElementById('file-input').click()"
           ondrop="handleDrop(event, '${ev.id}', '${esc(ev.title)}', '${esc(ev.date)}', '${esc(ev.location || '')}')" 
           ondragover="event.preventDefault()">
        <div style="font-size: 40px; margin-bottom: 10px;">📄</div>
        <div style="font-weight: 600; color: var(--primary);">Нажмите или перетащите файл сюда</div>
        <div class="muted" style="font-size: 12px; margin-top: 4px;">Excel (.xlsx), Word (.docx) или TXT</div>
        <input type="file" id="file-input" accept=".xlsx, .xls, .docx, .txt, .csv" style="display: none;" 
               onchange="uploadInviteFile(this, '${ev.id}', '${esc(ev.title)}', '${esc(ev.date)}', '${esc(ev.location || '')}')">
      </div>
      <div id="upload-status" style="margin-top: 10px; font-size: 14px; font-weight: 600;"></div>
    </div>

    <div class="card">
      <h2>Зарегистрированные</h2>
      <table><thead><tr><th>Имя</th><th>Email</th><th>Телефон</th><th>Статус</th><th></th></tr></thead><tbody>${rows}</tbody></table>
    </div>`;
}

function tabTeam(ev) {
  const team = DB.team.filter(m => m.eventId === ev.id);
  const contractors = DB.contractors.filter(c => c.eventId === ev.id);
  const teamRows = team.map(m => `<tr>
    <td>${esc(m.name)}</td><td>${esc(m.role)}</td><td>${esc(m.phone || '—')}</td><td>${esc(m.email || '—')}</td>
    <td><button class="btn ghost sm" onclick="deleteTeamMember('${m.id}')">Удалить</button></td>
  </tr>`).join('') || `<tr><td colspan="5" class="muted">Команда не добавлена</td></tr>`;
  const ctRows = contractors.map(c => `<tr>
    <td>${esc(c.name)}</td><td>${esc(c.service)}</td><td>${fmtMoney(c.cost)}</td><td>${esc(c.phone || '—')}</td>
    <td><select onchange="updateContractorStatus('${c.id}', this.value)" style="padding:8px;max-width:160px">
      ${Object.entries(CONTRACTOR_STATUS).map(([v, l]) => `<option value="${v}" ${c.status === v ? 'selected' : ''}>${l}</option>`).join('')}
    </select></td>
    <td><button class="btn ghost sm" onclick="deleteContractor('${c.id}')">Удалить</button></td>
  </tr>`).join('') || `<tr><td colspan="6" class="muted">Подрядчики не добавлены</td></tr>`;
  return `
    <div class="card">
      <h2>Команда мероприятия</h2>
      <table><thead><tr><th>Имя</th><th>Роль</th><th>Телефон</th><th>Email</th><th></th></tr></thead><tbody>${teamRows}</tbody></table>
      <form onsubmit="addTeamMember(event,'${ev.id}')" class="grid cols-4" style="margin-top:16px;align-items:end">
        <div class="field" style="margin:0"><label>Имя</label><input name="name" required></div>
        <div class="field" style="margin:0"><label>Роль</label><input name="role" placeholder="Координатор"></div>
        <div class="field" style="margin:0"><label>Телефон</label><input name="phone"></div>
        <div class="field" style="margin:0"><label>Email</label><input name="email" type="email"></div>
        <div style="grid-column:1/-1"><button class="btn" type="submit">+ Добавить участника</button></div>
      </form>
    </div>
    <div class="card">
      <h2>Подрядчики</h2>
      <table><thead><tr><th>Название</th><th>Услуга</th><th>Стоимость</th><th>Телефон</th><th>Статус</th><th></th></tr></thead><tbody>${ctRows}</tbody></table>
      <form onsubmit="addContractor(event,'${ev.id}')" class="grid cols-3" style="margin-top:16px;align-items:end">
        <div class="field" style="margin:0"><label>Название</label><input name="name" required></div>
        <div class="field" style="margin:0"><label>Услуга</label><input name="service"></div>
        <div class="field" style="margin:0"><label>Стоимость, ₽</label><input type="number" name="cost" min="0" value="0"></div>
        <div class="field" style="margin:0"><label>Телефон</label><input name="phone"></div>
        <div class="field" style="margin:0"><label>Статус</label><select name="status">
          ${Object.entries(CONTRACTOR_STATUS).map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}
        </select></div>
        <div style="grid-column:1/-1"><button class="btn" type="submit">+ Добавить подрядчика</button></div>
      </form>
    </div>`;
}

function viewCalendar() {
  const y = calCursor.getFullYear();
  const m = calCursor.getMonth();
  const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const first = new Date(y, m, 1);
  const startDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);

  const eventsByDate = {};
  DB.events.forEach(e => { const d = parseDate(e.date); if (d) { const k = d.toISOString().slice(0,10); (eventsByDate[k] = eventsByDate[k] || {ev:[], task:[]}).ev.push(e); } });
  DB.tasks.forEach(t => { if (t.due) { const k = t.due; (eventsByDate[k] = eventsByDate[k] || {ev:[], task:[]}).task.push(t); } });

  const heads = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(h => `<div class="cal-head">${h}</div>`).join('');
  let cells = '';
  for (let i = 0; i < startDay; i++) cells += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayDate = new Date(y, m, d);
    const isToday = dayDate.getTime() === today.getTime();
    const bucket = eventsByDate[key] || {ev:[], task:[]};
    const evDots = bucket.ev.map(e => `<div class="cal-dot ev" onclick="event.stopPropagation();go('/event/${e.id}/dashboard')">${esc(e.title)}</div>`).join('');
    const taskDots = bucket.task.map(t => {
      const ov = isOverdue(t);
      return `<div class="cal-dot ${ov?'over':'task'}" onclick="event.stopPropagation();go('/event/${t.eventId}/tasks')">${esc(t.title)}</div>`;
    }).join('');
    cells += `<div class="cal-day ${isToday ? 'today' : ''}"><div class="d">${d}</div>${evDots}${taskDots}</div>`;
  }
  return `${header()}
    <div class="card">
      <div class="cal-nav">
        <button class="btn ghost sm" onclick="calShift(-1)">←</button>
        <h2 style="margin:0">${monthNames[m]} ${y}</h2>
        <button class="btn ghost sm" onclick="calShift(1)">→</button>
      </div>
      <div class="calendar">${heads}${cells}</div>
      <div class="hint" style="margin-top:16px">
        <span class="cal-dot ev" style="display:inline-block">мероприятие</span>
        <span class="cal-dot task" style="display:inline-block">задача</span>
        <span class="cal-dot over" style="display:inline-block">просроченная задача</span>
      </div>
    </div>`;
}
function calShift(delta) {
  calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth() + delta, 1);
  render();
}

function viewRegister(id) {
  const ev = DB.events.find(e => e.id === id);
  if (!ev) return `<div class="app"><div class="card empty">Мероприятие не найдено</div></div>`;
  return `${authHeader()}
    <div class="card reg-form">
      <h1>${esc(ev.title)}</h1>
      <p class="muted" style="margin-bottom:20px">${fmtDate(ev.date)} · ${esc(ev.location || '')}</p>
      ${ev.description ? `<p class="muted" style="margin-bottom:16px">${esc(ev.description)}</p>` : ''}
      <form onsubmit="submitReg(event,'${id}')">
        <div class="field"><label>Имя *</label><input name="name" required></div>
        <div class="field"><label>Email *</label><input type="email" name="email" required></div>
        <div class="field"><label>Телефон</label><input name="phone"></div>
        <button class="btn full" type="submit" style="margin-top:6px">Зарегистрироваться</button>
      </form>
    </div>`;
}

function saveEvent(e, id) {
  e.preventDefault();
  const f = e.target;
  const data = {
    title: f.title.value.trim(), type: f.type.value, date: f.date.value,
    location: f.location.value.trim(), description: f.description.value.trim(),
    goals: f.goals.value.trim(), plannedGuests: Number(f.plannedGuests.value) || 0,
    budgetTotal: Number(f.budgetTotal.value) || 0, organizer: f.organizer.value.trim()
  };
  if (id) {
    const ev = DB.events.find(x => x.id === id);
    if (!ev) return;
    Object.assign(ev, data);
    saveDB(); toast('Изменения сохранены'); go('/event/' + id + '/dashboard');
  } else {
    const ev = { id: uid(), ...data, createdAt: Date.now() };
    DB.events.push(ev); saveDB(); toast('Мероприятие создано'); go('/event/' + ev.id + '/dashboard');
  }
}

function deleteEvent(id) {
  if (!confirm('Удалить мероприятие и все связанные данные?')) return;
  DB.events = DB.events.filter(e => e.id !== id);
  DB.tasks = DB.tasks.filter(t => t.eventId !== id);
  DB.budget = DB.budget.filter(b => b.eventId !== id);
  DB.registrations = DB.registrations.filter(r => r.eventId !== id);
  DB.team = DB.team.filter(m => m.eventId !== id);
  DB.contractors = DB.contractors.filter(c => c.eventId !== id);
  saveDB(); toast('Удалено'); go('/');
}

function addTask(e, evId) {
  e.preventDefault(); const f = e.target;
  DB.tasks.push({ id: uid(), eventId: evId, title: f.title.value.trim(), assignee: f.assignee.value.trim(), due: f.due.value, priority: f.priority.value, status: 'todo', comments: [] });
  saveDB(); toast('Задача добавлена'); render();
}
function moveTask(id, status) { const t = DB.tasks.find(t => t.id === id); if (t) { t.status = status; saveDB(); render(); } }
function deleteTask(id) { DB.tasks = DB.tasks.filter(t => t.id !== id); saveDB(); render(); }
function addComment(e, taskId) {
  e.preventDefault(); const f = e.target;
  const t = DB.tasks.find(t => t.id === taskId);
  if (!t) return;
  if (!t.comments) t.comments = [];
  t.comments.push({ id: uid(), author: currentUser()?.name || 'Вы', text: f.text.value.trim(), createdAt: Date.now() });
  saveDB(); render();
}

const TASK_TEMPLATES = {
  'Хакатон': [
    ['Забронировать площадку', 'high'], ['Согласовать кейтеринг', 'high'],
    ['Подготовить награды и кубки', 'medium'], ['Собрать программу', 'high'],
    ['Разослать приглашения', 'medium'], ['Настроить форму регистрации', 'high'],
    ['Подготовить оборудование и Wi-Fi', 'high'], ['Организовать фото/видео', 'low']
  ],
  'Корпоратив': [
    ['Выбрать ресторан/площадку', 'high'], ['Заказать торт', 'medium'],
    ['Согласовать ведущего и программу', 'high'], ['Подготовить подарки', 'medium'],
    ['Организовать транспорт', 'medium'], ['Согласовать меню', 'high']
  ],
  'Конференция': [
    ['Подтвердить спикеров', 'high'], ['Подготовить оборудование', 'high'],
    ['Изготовить бейджи', 'medium'], ['Согласовать кейтеринг', 'medium'],
    ['Организовать регистрацию на входе', 'high'], ['Подготовить полиграфию', 'low']
  ]
};

function generatePlan(evId) {
  const ev = DB.events.find(e => e.id === evId);
  if (!ev) return;
  const tpl = TASK_TEMPLATES[ev.type] || TASK_TEMPLATES['Корпоратив'];
  let added = 0;
  tpl.forEach(([title, priority]) => {
    if (!DB.tasks.some(t => t.eventId === evId && t.title === title)) {
      DB.tasks.push({ id: uid(), eventId: evId, title, assignee: '', due: '', priority, status: 'todo', comments: [] });
      added++;
    }
  });
  saveDB(); toast(added ? `Добавлено задач: ${added}` : 'Все шаблонные задачи уже есть'); render();
}

function addBudget(e, evId) {
  e.preventDefault(); const f = e.target;
  DB.budget.push({ id: uid(), eventId: evId, category: f.category.value.trim(), planned: Number(f.planned.value) || 0, actual: Number(f.actual.value) || 0 });
  saveDB(); toast('Статья добавлена'); render();
}
function updateActual(id, val) {
  const b = DB.budget.find(b => b.id === id);
  if (!b) return;
  b.actual = Number(val) || 0;
  const items = DB.budget.filter(x => x.eventId === b.eventId);
  const plan = items.reduce((s, x) => s + Number(x.planned || 0), 0);
  const fact = items.reduce((s, x) => s + Number(x.actual || 0), 0);
  saveDB();
  if (fact > plan) toast(`Превышение бюджета на ${fmtMoney(fact - plan)}`);
  render();
}
function deleteBudget(id) { DB.budget = DB.budget.filter(b => b.id !== id); saveDB(); render(); }

function updateRegStatus(id, val) { const r = DB.registrations.find(r => r.id === id); if (r) { r.status = val; saveDB(); render(); } }
function deleteReg(id) { DB.registrations = DB.registrations.filter(r => r.id !== id); saveDB(); render(); }
function submitReg(e, evId) {
  e.preventDefault(); const f = e.target;
  DB.registrations.push({ id: uid(), eventId: evId, name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), status: 'registered', createdAt: Date.now() });
  saveDB(); f.reset(); toast('Вы зарегистрированы! Спасибо.');
}
function copyRegLink() { const inp = document.getElementById('regLink'); inp.select(); document.execCommand('copy'); toast('Ссылка скопирована'); }
function openRegPage(id) { window.open(location.pathname + '#/register/' + id, '_blank'); }

function exportRegs(evId) {
  const regs = DB.registrations.filter(r => r.eventId === evId);
  if (!regs.length) { toast('Нет регистраций для экспорта'); return; }
  const rows = [['Имя','Email','Телефон','Статус']];
  regs.forEach(r => rows.push([r.name, r.email, r.phone || '', STATUS_LABEL[r.status] || r.status]));
  downloadCSV(rows, `registrations_${evId}.csv`);
  toast('CSV выгружен');
}
function downloadCSV(rows, filename) {
  const csv = rows.map(row => row.map(v => `"${String(v == null ? '' : v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function addTeamMember(e, evId) {
  e.preventDefault(); const f = e.target;
  DB.team.push({ id: uid(), eventId: evId, name: f.name.value.trim(), role: f.role.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim() });
  saveDB(); toast('Участник добавлен'); render();
}
function deleteTeamMember(id) { DB.team = DB.team.filter(m => m.id !== id); saveDB(); render(); }
function addContractor(e, evId) {
  e.preventDefault(); const f = e.target;
  DB.contractors.push({ id: uid(), eventId: evId, name: f.name.value.trim(), service: f.service.value.trim(), cost: Number(f.cost.value) || 0, phone: f.phone.value.trim(), status: f.status.value });
  saveDB(); toast('Подрядчик добавлен'); render();
}
function deleteContractor(id) { DB.contractors = DB.contractors.filter(c => c.id !== id); saveDB(); render(); }
function updateContractorStatus(id, val) { const c = DB.contractors.find(c => c.id === id); if (c) { c.status = val; saveDB(); render(); } }

function exportAll() {
  const rows = [['Тип','ID','Название','Доп. инфо']];
  DB.events.forEach(e => rows.push(['Событие', e.id, e.title, `${e.type}, ${e.date}`]));
  DB.tasks.forEach(t => rows.push(['Задача', t.id, t.title, `${t.status}, ${t.priority}`]));
  DB.budget.forEach(b => rows.push(['Бюджет', b.id, b.category, `план ${b.planned}, факт ${b.actual}`]));
  DB.registrations.forEach(r => rows.push(['Регистрация', r.id, r.name, `${r.email}, ${r.status}`]));
  DB.requests.forEach(r => rows.push(['Заявка', r.id, r.clientName, `${r.clientEmail}, ${r.status}`]));
  downloadCSV(rows, 'eventos_export.csv');
  toast('Данные выгружены');
}

/* ГЛОБАЛЬНЫЙ ЧАТ */
let socket = null;
function viewGlobalChat() {
  return `${header()}
    <div class="chat-shell">
      <div class="chat-window">
        <div class="chat-head" style="background:linear-gradient(135deg, var(--accent), var(--primary))">
          <div class="avatar" style="background:rgba(255,255,255,0.3)">💬</div>
          <div class="info"><b>Общий чат ИвентОС</b><span>Общайтесь с коллегами в реальном времени</span></div>
        </div>
        <div class="chat-log" id="globalChatLog" style="background:#f4f8fc"></div>
        <div id="filePreview" style="display:none; padding: 10px; background: var(--primary-soft); border-top: 1px solid var(--border); font-size: 13px;"></div>
        <form class="chat-input" onsubmit="sendGlobalMessage(event)">
          <label class="btn ghost" style="padding: 12px; cursor:pointer; margin:0" title="Прикрепить файл">
            📎
            <input type="file" id="chatFileInput" style="display:none" onchange="uploadFileForChat(this)">
          </label>
          <input id="globalChatInput" autocomplete="off" placeholder="Написать сообщение...">
          <button class="btn" type="submit">Отправить</button>
        </form>
      </div>
    </div>`;
}

function mountGlobalChat() {
  const log = document.getElementById('globalChatLog');
  if (!log) return;
  log.innerHTML = '<div class="muted" style="text-align:center; margin-top:20px">Подключение...</div>';
  if (window.socket) window.socket.disconnect();
  window.socket = io();
  socket = window.socket;

  socket.on('connect', () => { log.innerHTML = '<div class="muted" style="text-align:center; margin-top:20px">Ожидание сообщений...</div>'; });
  socket.on('chat history', (history) => {
    log.innerHTML = '';
    if (history.length === 0) log.innerHTML = '<div class="muted" style="text-align:center; margin-top:20px">Пока нет сообщений. Напишите первым!</div>';
    history.forEach(msg => appendMessageToLog(msg));
  });
  socket.on('chat message', (msg) => appendMessageToLog(msg));
  socket.on('connect_error', () => { log.innerHTML = '<div class="muted" style="text-align:center; color:var(--danger)">Ошибка подключения.</div>'; });
  setTimeout(() => document.getElementById('globalChatInput')?.focus(), 100);
}

function appendMessageToLog(msg) {
  const log = document.getElementById('globalChatLog');
  const empty = log.querySelector('.muted');
  if (empty) empty.remove();
  const u = currentUser();
  const isMe = u && u.name === msg.user;
  let fileHtml = '';
  if (msg.fileUrl) {
    if (msg.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      fileHtml = `<br><img src="${msg.fileUrl}" style="max-width:100%; border-radius:8px; margin-top:8px;">`;
    } else {
      fileHtml = `<br><a href="${msg.fileUrl}" target="_blank" style="color:var(--primary); font-weight:600; font-size:12px">📄 Скачать ${esc(msg.fileName)}</a>`;
    }
  }
  const html = `<div class="msg ${isMe ? 'user' : 'bot'}" style="max-width: 85%">
    <div style="font-size:11px; opacity:0.7; margin-bottom:4px; display:flex; justify-content:space-between; gap:10px"><b>${esc(msg.user)}</b> <span>${msg.time}</span></div>
    <div style="font-size:14px">${esc(msg.text)}</div>
    ${fileHtml}
  </div>`;
  log.insertAdjacentHTML('beforeend', html);
  log.scrollTop = log.scrollHeight;
}

function sendGlobalMessage(e) {
  e.preventDefault();
  const input = document.getElementById('globalChatInput');
  const text = input.value.trim();
  if (!text) return;
  const u = currentUser();
  socket.emit('chat message', { user: u.name, text: text });
  input.value = '';
}

async function uploadFileForChat(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const preview = document.getElementById('filePreview');
  preview.style.display = 'block';
  preview.innerHTML = `Загрузка файла: <b>${esc(file.name)}</b>...`;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await response.json();
    if (data.url) {
      const u = currentUser();
      socket.emit('chat message', { user: u.name, text: `Отправил файл:`, fileUrl: data.url, fileName: data.name });
      preview.style.display = 'none';
    } else {
      preview.innerHTML = `<span style="color:var(--danger)">Ошибка: ${data.error}</span>`;
    }
  } catch (err) { preview.innerHTML = `<span style="color:var(--danger)">Ошибка сети</span>`; }
  input.value = '';
}

function handleDrop(e, eventId, title, date, location) {
  e.preventDefault();
  document.getElementById('drop-zone').style.borderColor = 'var(--border-strong)';
  const files = e.dataTransfer.files;
  if (files.length > 0) uploadInviteFile({ files: files }, eventId, title, date, location);
}

async function uploadInviteFile(input, eventId, title, date, location) {
  if (!input.files || !input.files.length) return;
  const file = input.files[0];
  const statusDiv = document.getElementById('upload-status');
  statusDiv.innerHTML = `⏳ Загрузка и отправка...`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('eventId', eventId);
  formData.append('eventTitle', title);
  formData.append('eventDate', date);
  formData.append('eventLocation', location);
  try {
    const response = await fetch('/api/invite-file', { method: 'POST', body: formData });
    const data = await response.json();
    if (data.success) statusDiv.innerHTML = `✅ ${data.message}`;
    else statusDiv.innerHTML = `<span style="color:var(--danger)">❌ Ошибка: ${data.error}</span>`;
  } catch (err) { statusDiv.innerHTML = `<span style="color:var(--danger)">❌ Ошибка сети</span>`; }
}

parseHash();