import { mod } from '../core/mod.js';
import { toAZIndex, fromAZIndex, isLetter, normalizeText, sanitizeKey } from '../core/codec.js';

function keyStreamFor(text, key) {
  // Genera índices de clave alineados solo a letras del texto
  const K = sanitizeKey(key);
  if (!K.length) return [];
  const keyIdx = [...K].map(toAZIndex);
  let j = 0;
  const stream = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (isLetter(ch)) {
      stream.push(keyIdx[j % keyIdx.length]);
      j++;
    } else {
      stream.push(null); // no letra -> no avanza la clave
    }
  }
  return stream;
}

export function vigenereEncrypt(text, key, options = {}) {
  const { onlyLetters = true, preserveCase = true } = options;
  const norm = normalizeText(text);
  const stream = keyStreamFor(norm, key);

  let out = '';
  for (let i = 0; i < norm.length; i++) {
    const origCh = text[i];
    const ch = norm[i];

    if (isLetter(ch)) {
      const idx = toAZIndex(ch);
      const k = stream[i] ?? 0;
      const enc = mod(idx + k, 26);
      const keepUpper = preserveCase ? (origCh === origCh.toUpperCase()) : true;
      out += fromAZIndex(enc, keepUpper);
    } else {
      out += onlyLetters ? origCh : ch;
    }
  }
  return out;
}

export function vigenereDecrypt(text, key, options = {}) {
  const norm = normalizeText(text);
  const stream = keyStreamFor(norm, key);
  const { onlyLetters = true, preserveCase = true } = options;

  let out = '';
  for (let i = 0; i < norm.length; i++) {
    const origCh = text[i];
    const ch = norm[i];

    if (isLetter(ch)) {
      const idx = toAZIndex(ch);
      const k = stream[i] ?? 0;
      const dec = mod(idx - k, 26);
      const keepUpper = preserveCase ? (origCh === origCh.toUpperCase()) : true;
      out += fromAZIndex(dec, keepUpper);
    } else {
      out += onlyLetters ? origCh : ch;
    }
  }
  return out;
}
