/** Puts a DOM (jsdom) in place so the card can run in Node, then loads it once. */
import { JSDOM } from 'jsdom';

let loaded = false;

export async function setupDom() {
  if (loaded) return;
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/', pretendToBeVisual: true });
  const { window } = dom;
  for (const name of ['window', 'document', 'HTMLElement', 'customElements', 'Element', 'Node', 'Event', 'CustomEvent', 'MouseEvent', 'localStorage', 'requestAnimationFrame', 'cancelAnimationFrame']) {
    Object.defineProperty(globalThis, name, { value: name === 'window' ? window : window[name], configurable: true, writable: true });
  }
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });
  // jsdom lays nothing out and lacks a few browser APIs the card uses
  Object.defineProperty(window.HTMLElement.prototype, 'clientWidth', { get() { return 360; }, configurable: true });
  Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', { get() { return 40; }, configurable: true });
  window.Element.prototype.animate = () => ({ cancel() {} });
  window.Element.prototype.setPointerCapture = () => {};
  window.Element.prototype.hasPointerCapture = () => true;
  window.Element.prototype.scrollIntoView = () => {};
  window.vibrationLog = [];
  window.navigator.vibrate = (pattern) => { window.vibrationLog.push(pattern); return true; };
  await import('../../src/lg-tv-remote-card.js');
  loaded = true;
}

export const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

/** Waits until `check()` is truthy, so tests do not depend on exact timing. */
export async function until(check, timeoutMs = 2000, stepMs = 10) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (check()) return;
    await wait(stepMs);
  }
  throw new Error(`condition not met within ${timeoutMs} ms: ${check}`);
}

/** Mounts a card wired to a mock TV; every TV change is pushed into the card like Home Assistant does. */
export async function mountCard(tv, { config = {}, external = true } = {}) {
  await setupDom();
  localStorage.clear();
  window.vibrationLog.length = 0;
  const card = document.createElement('lg-tv-remote-card');
  document.body.append(card);
  card.setConfig({ type: 'custom:lg-tv-remote-card', entity: tv.entity, name: 'TV Salotto', ...config });
  tv.onChange = () => { card.hass = tv.hass({ external }); };
  card.hass = tv.hass({ external });
  const root = card.shadowRoot;
  return {
    card, root,
    $: (selector) => root.querySelector(selector),
    $$: (selector) => [...root.querySelectorAll(selector)],
    byId: (id) => root.getElementById(id),
    click: (target) => (typeof target === 'string' ? root.querySelector(target) : target).click(),
    unmount: () => card.remove(),
  };
}

/** A synthetic pointer event with the fields the card reads. */
export function pointer(type, element, { x = 0, y = 0, id = 1 } = {}) {
  const event = new window.MouseEvent(type, { bubbles: true, composed: true, clientX: x, clientY: y });
  Object.defineProperty(event, 'pointerId', { value: id });
  element.dispatchEvent(event);
}
