/** Seleciona um elemento do DOM garantindo que ele exista. */
export function $<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Elemento não encontrado: ${selector}`);
  return el;
}