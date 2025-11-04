const A_CODE = 'A'.charCodeAt(0);
const Z_CODE = 'Z'.charCodeAt(0);

export function isLetter(ch) {
  const c = ch.toUpperCase();
  return c >= 'A' && c <= 'Z';
}

export function toAZIndex(ch) {
  const code = ch.toUpperCase().charCodeAt(0);
  if (code < A_CODE || code > Z_CODE) return null;
  return code - A_CODE; // 0..25
}

export function fromAZIndex(i, keepUpper = true) {
  const ch = String.fromCharCode(i + A_CODE);
  return keepUpper ? ch : ch.toLowerCase();
}

// Normaliza texto: quita acentos y Ñ→N para trabajar con alfabeto A–Z
export function normalizeText(str) {
  return (str ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // acentos
    .replace(/ñ/gi, 'n');
}

// Limpia clave Vigenère: solo letras A–Z
export function sanitizeKey(str) {
  return normalizeText(str).replace(/[^a-zA-Z]/g, '').toUpperCase();
}
