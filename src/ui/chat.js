import { caesarEncrypt, caesarDecrypt } from '../ciphers/caesar.js';
import { vigenereEncrypt, vigenereDecrypt } from '../ciphers/vigenere.js';

const $ = (s) => document.querySelector(s);
const byId = (id) => document.getElementById(id);

// Estado global
const state = {
  cipher: 'caesar',     // 'caesar' | 'vigenere'
  view: 'cipher',       // 'cipher' | 'plain'
  options: {
    onlyLetters: true,
    preserveCase: true,
  },
  key: 3,               // number | string (depende de cipher)
  messages: [],         // {from:'A'|'B', to:'A'|'B', plain:string, ts:number}
};

// Helpers de cifrado segun tipo + vista
function encrypt(plain) {
  if (state.cipher === 'caesar') return caesarEncrypt(plain, state.key, state.options);
  return vigenereEncrypt(plain, String(state.key || ''), state.options);
}
function decrypt(cipherText) {
  if (state.cipher === 'caesar') return caesarDecrypt(cipherText, state.key, state.options);
  return vigenereDecrypt(cipherText, String(state.key || ''), state.options);
}

// Render general
function renderAll() {
  // badge y select
  byId('cipher-badge').textContent =
    state.cipher === 'caesar' ? 'César' : 'Vigenère';

  byId('cipher-select').value = state.cipher;
  byId('view-state').textContent = state.view === 'cipher' ? 'Cifrado' : 'Descifrado';

  // UI de clave
  const keyInput = byId('key-input');
  const keyLabel = byId('key-label');
  if (state.cipher === 'caesar') {
    keyInput.type = 'number';
    keyInput.value = String(state.key ?? 3);
    keyInput.placeholder = 'Ej: 3';
    keyLabel.textContent = 'Clave (K, entero)';
  } else {
    keyInput.type = 'text';
    keyInput.value = String(state.key ?? 'LEMON');
    keyInput.placeholder = 'Ej: LEMON';
    keyLabel.textContent = 'Clave (palabra)';
  }

  // listas por destino
  renderList('A');
  renderList('B');
}

function renderList(forUser /* 'A'|'B' */) {
  const ul = byId(forUser === 'A' ? 'chat-a' : 'chat-b');
  ul.innerHTML = '';
  const items = state.messages.filter(m => m.to === forUser);

  for (const m of items) {
    const li = document.createElement('li');
    li.className = 'msg';
    const meta = document.createElement('div');
    meta.className = 'meta';
    const dt = new Date(m.ts).toLocaleTimeString();
    meta.textContent = `De ${m.from} · ${dt}`;

    const body = document.createElement('div');
    if (state.view === 'cipher') {
      body.textContent = encrypt(m.plain);
    } else {
      body.textContent = m.plain;
    }

    li.appendChild(meta);
    li.appendChild(body);
    ul.appendChild(li);
  }

  // scroll al final
  ul.scrollTop = ul.scrollHeight;
}

// Envío de mensajes
function send(from /* 'A'|'B' */) {
  const to = from === 'A' ? 'B' : 'A';
  const textarea = byId(from === 'A' ? 'input-a' : 'input-b');
  const text = (textarea.value || '').trim();
  if (!text) return;

  state.messages.push({ from, to, plain: text, ts: Date.now() });
  textarea.value = '';
  renderAll();
}

// Eventos de UI
byId('send-a').addEventListener('click', () => send('A'));
byId('send-b').addEventListener('click', () => send('B'));

byId('input-a').addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') send('A');
});
byId('input-b').addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') send('B');
});

byId('toggle-view').addEventListener('click', () => {
  state.view = state.view === 'cipher' ? 'plain' : 'cipher';
  renderAll();
});

byId('cipher-select').addEventListener('change', (e) => {
  const next = e.target.value;
  if (next !== state.cipher) {
    state.cipher = next;
    // Ajustar clave por defecto si vacío
    if (state.cipher === 'caesar' && (state.key === '' || state.key == null)) state.key = 3;
    if (state.cipher === 'vigenere' && (state.key === '' || state.key == null || !isNaN(state.key))) state.key = 'LEMON';
    renderAll();
  }
});

// Clave y opciones
byId('key-input').addEventListener('input', (e) => {
  if (state.cipher === 'caesar') {
    const v = parseInt(e.target.value || '0', 10);
    state.key = isNaN(v) ? 0 : v;
  } else {
    state.key = String(e.target.value || '').toUpperCase();
  }
  renderAll();
});

byId('only-letters').addEventListener('change', (e) => {
  state.options.onlyLetters = e.target.checked;
  renderAll();
});
byId('preserve-case').addEventListener('change', (e) => {
  state.options.preserveCase = e.target.checked;
  renderAll();
});

// Modal inicial
const modal = byId('cipher-modal');
byId('choose-caesar').addEventListener('click', () => {
  state.cipher = 'caesar';
  state.key = 3;
  modal.classList.remove('show');
  renderAll();
});
byId('choose-vigenere').addEventListener('click', () => {
  state.cipher = 'vigenere';
  state.key = 'LEMON';
  modal.classList.remove('show');
  renderAll();
});

// Si quieres "preguntar" también al entrar sin modal (por prompt), descomenta:
/*
window.addEventListener('load', () => {
  const ans = (prompt('Elige cifrado: "c" para César, "v" para Vigenère', 'c') || 'c').toLowerCase();
  state.cipher = ans.startsWith('v') ? 'vigenere' : 'caesar';
  state.key = state.cipher === 'caesar' ? 3 : 'LEMON';
  renderAll();
});
*/

// Arranque (mostrar modal)
renderAll();
