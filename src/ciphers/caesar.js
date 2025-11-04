import { mod } from '../core/mod.js';
import { toAZIndex, fromAZIndex, isLetter, normalizeText } from '../core/codec.js';

export function caesarEncrypt(text, k, options = {}) {
  const { onlyLetters = true, preserveCase = true } = options;
  const K = mod(Number(k || 0), 26);
  const norm = normalizeText(text);

  let out = '';
  for (let i = 0; i < norm.length; i++) {
    const origCh = text[i];
    const ch = norm[i];

    if (isLetter(ch)) {
      const idx = toAZIndex(ch);
      const enc = mod(idx + K, 26);
      const keepUpper = preserveCase ? (origCh === origCh.toUpperCase()) : true;
      out += fromAZIndex(enc, keepUpper);
    } else {
      out += onlyLetters ? origCh : ch;
    }
  }
  return out;
}

export function caesarDecrypt(text, k, options = {}) {
  return caesarEncrypt(text, -Number(k || 0), options);
}
