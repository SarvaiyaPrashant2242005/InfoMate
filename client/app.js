const API_BASE = 'http://localhost:8000';

// Elements
const messagesEl = document.getElementById('messages');
const formEl = document.getElementById('chat-form');
const inputEl = document.getElementById('query');
const createChatBtn = document.getElementById('create-chat');
const newChatTopBtn = document.getElementById('new-chat-top');
const tabsNav = document.querySelectorAll('.tab-btn');
const historyListEl = document.getElementById('history-list');

// Storage keys
const STORE_CHATS = 'infomate_chats_v1';
const STORE_ACTIVE = 'infomate_active_chat_v1';

// Utils
const uuid = () => (self.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'id-' + Math.random().toString(36).slice(2);
const now = () => new Date().toISOString();

// Model: Chat { id, title, createdAt, updatedAt, sessionId, messages: [ {sender,text,meta} ] }
function loadChats() {
  try { return JSON.parse(localStorage.getItem(STORE_CHATS) || '[]'); } catch { return []; }
}
function saveChats(chats) {
  localStorage.setItem(STORE_CHATS, JSON.stringify(chats));
}
function loadActiveId() {
  return localStorage.getItem(STORE_ACTIVE);
}
function saveActiveId(id) {
  localStorage.setItem(STORE_ACTIVE, id);
}

function createChat(initialTitle = 'New Chat') {
  const chat = {
    id: uuid(),
    title: initialTitle,
    createdAt: now(),
    updatedAt: now(),
    sessionId: uuid(),
    messages: []
  };
  const chats = loadChats();
  chats.unshift(chat);
  saveChats(chats);
  saveActiveId(chat.id);
  return chat;
}

function getActiveChat() {
  const chats = loadChats();
  const activeId = loadActiveId();
  let chat = chats.find(c => c.id === activeId);
  if (!chat) {
    chat = chats[0] || createChat('New Chat');
    saveActiveId(chat.id);
  }
  return chat;
}

function updateChat(updated) {
  const chats = loadChats();
  const idx = chats.findIndex(c => c.id === updated.id);
  if (idx !== -1) {
    chats[idx] = updated;
    saveChats(chats);
  }
}

// Rendering
function renderMessages(chat) {
  messagesEl.innerHTML = '';
  if (!chat.messages.length) {
    // Greet on empty chat and persist greeting so reload preserves it
    chat.messages.push({ sender: 'bot', text: 'Hi! I\'m InfoMate. Ask me anything about the ICT Department.' });
    chat.updatedAt = now();
    updateChat(chat);
  }
  for (const m of chat.messages) {
    addMessageBubble(m.sender, m.text, m.meta);
  }
}

function renderHistoryList(activeId) {
  const chats = loadChats();
  historyListEl.innerHTML = '';
  if (!chats.length) return;
  for (const c of chats) {
    const item = document.createElement('div');
    item.className = 'history-item' + (c.id === activeId ? ' active' : '');
    item.dataset.chatId = c.id;

    const title = document.createElement('div');
    title.className = 'history-title';
    title.textContent = c.title || 'Untitled Chat';
    item.appendChild(title);

    const openBtn = document.createElement('button');
    openBtn.className = 'ghost';
    openBtn.textContent = 'Open';
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      switchChat(c.id);
    });
    item.appendChild(openBtn);

    item.addEventListener('click', () => switchChat(c.id));
    historyListEl.appendChild(item);
  }
}

function setActiveTab(name) {
  tabsNav.forEach(btn => {
    const isActive = btn.dataset.tab === name;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
  document.getElementById('tab-new').hidden = name !== 'new';
  document.getElementById('tab-faculty').hidden = name !== 'faculty';
  document.getElementById('tab-history').hidden = name !== 'history';
}

function addMessageBubble(sender, text, meta = null) {
  const wrap = document.createElement('div');
  wrap.className = `msg ${sender}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  wrap.appendChild(bubble);

  if (meta && Array.isArray(meta.sources) && meta.sources.length) {
    const src = document.createElement('div');
    src.className = 'sources';
    src.innerHTML = '<strong>Sources:</strong> ' + meta.sources.map(s => `#${s.chunk_id} (${(s.score||0).toFixed(2)})`).join(', ');
    wrap.appendChild(src);
  }

  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function pushMessageToChat(chat, sender, text, meta = null) {
  chat.messages.push({ sender, text, meta });
  chat.updatedAt = now();
  // Title: first user message becomes title if default
  if ((!chat.title || chat.title === 'New Chat') && sender === 'user') {
    chat.title = text.slice(0, 60);
  }
  updateChat(chat);
}

async function sendQuery(query) {
  const chat = getActiveChat();
  // Render user message and persist
  addMessageBubble('user', query);
  pushMessageToChat(chat, 'user', query);

  // Thinking bubble
  addMessageBubble('bot thinking', 'Thinking...');

  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, session_id: chat.sessionId })
    });

    // remove the last 'Thinking...' bubble
    const last = messagesEl.querySelector('.msg.bot.thinking');
    if (last) last.remove();

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = `Error: ${res.status} ${err.detail || res.statusText}`;
      addMessageBubble('bot', msg);
      pushMessageToChat(chat, 'bot', msg);
      return;
    }

    const data = await res.json();
    const answer = data.answer || '(no answer)';
    addMessageBubble('bot', answer, { sources: data.sources || [] });
    pushMessageToChat(chat, 'bot', answer, { sources: data.sources || [] });
    // Re-render history titles if first user message updated title
    renderHistoryList(chat.id);
  } catch (e) {
    const last = messagesEl.querySelector('.msg.bot.thinking');
    if (last) last.remove();
    const msg = `Network error: ${e.message}`;
    addMessageBubble('bot', msg);
    pushMessageToChat(chat, 'bot', msg);
  }
}

function switchChat(chatId) {
  saveActiveId(chatId);
  const chat = getActiveChat();
  renderMessages(chat);
  renderHistoryList(chat.id);
}

// Events
formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = inputEl.value.trim();
  if (!q) return;
  inputEl.value = '';
  sendQuery(q);
});

if (createChatBtn) {
  createChatBtn.addEventListener('click', () => {
    const chat = createChat('New Chat');
    switchChat(chat.id);
    setActiveTab('history');
  });
}
if (newChatTopBtn) {
  newChatTopBtn.addEventListener('click', () => {
    const chat = createChat('New Chat');
    switchChat(chat.id);
    setActiveTab('history');
  });
}

tabsNav.forEach(btn => {
  btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
});

// Init
(function init() {
  // Ensure at least one chat exists
  const chats = loadChats();
  if (!chats.length) {
    createChat('New Chat');
  }
  const active = getActiveChat();
  renderMessages(active);
  renderHistoryList(active.id);
  // Default to History tab
  setActiveTab('history');
})();
