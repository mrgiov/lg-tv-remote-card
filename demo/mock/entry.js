/** Runs the real card against the mock TV, with a control panel to make the TV do things on demand. */
import { MockTv } from '../../test/support/mock-tv.mjs';
import '../../src/lg-tv-remote-card.js';

const $ = (id) => document.getElementById(id);
const tv = new MockTv({ power: 'on', wakeDelayMs: 4000, sleepDelayMs: 2500, latencyMs: 0 });
let external = true; // pretend to be inside the Home Assistant app (native haptics) or a plain browser (vibration)

const card = document.createElement('lg-tv-remote-card');
card.setConfig({ type: 'custom:lg-tv-remote-card', entity: tv.entity, name: 'TV Salone' });
$('card-slot').append(card);

const push = () => { card.hass = tv.hass({ external }); renderPanel(); };
tv.onChange = push;

// ---- log -----------------------------------------------------------------
const log = (kind, text) => {
  const row = document.createElement('li');
  row.className = kind;
  row.textContent = text;
  $('log').prepend(row);
  while ($('log').children.length > 60) $('log').lastChild.remove();
};
const describe = (data) => Object.entries(data ?? {}).filter(([key]) => key !== 'entity_id')
  .map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`).join(' ');

for (const method of ['callService', 'callWS']) {
  const original = tv[method].bind(tv);
  tv[method] = async (...args) => {
    const domain = method === 'callService' ? args[0] : args[0].domain;
    const service = method === 'callService' ? args[1] : args[0].service;
    const data = method === 'callService' ? args[2] : args[0].service_data;
    if (!(domain === 'lgtv_pointer' && service === 'move')) log('call', `${domain}.${service} ${describe(data)}`);
    try { return await original(...args); } catch (error) { log('fail', `${domain}.${service}: ${error.message}`); throw error; }
  };
}
const pushHaptic = tv.haptics.push.bind(tv.haptics);
tv.haptics.push = (message) => { log('haptic', `vibrazione nativa: ${message.payload.hapticType}`); return pushHaptic(message); };
const nativeVibrate = navigator.vibrate?.bind(navigator);
navigator.vibrate = (pattern) => { log('haptic', `vibrazione del browser: ${JSON.stringify(pattern)}`); return nativeVibrate ? nativeVibrate(pattern) : true; };

// ---- panel ---------------------------------------------------------------
function renderPanel() {
  for (const button of document.querySelectorAll('[data-power]')) button.setAttribute('aria-pressed', String(button.dataset.power === tv.power));
  $('field').setAttribute('aria-pressed', String(tv.fieldFocused));
  $('fail').setAttribute('aria-pressed', String(Boolean(tv.failNext)));
  $('external').setAttribute('aria-pressed', String(external));
  $('external-label').textContent = external ? "Nell'app di Home Assistant (vibrazione nativa)" : 'In un browser (vibrazione del telefono)';
  $('tv-now').textContent = tv.power !== 'on' ? (tv.power === 'off' ? 'In standby' : 'Non raggiungibile')
    : tv.appId === 'com.webos.app.livetv' ? `Canale ${tv.channels[tv.channelIndex].channelNumber} · ${tv.channels[tv.channelIndex].channelName}`
      : tv.appId === 'com.webos.app.home' ? 'Schermata Home' : tv.source;
  $('tv-volume').textContent = tv.muted ? 'Muto' : `Volume ${tv.volume}`;
  $('tv-text').textContent = tv.fieldFocused ? `Campo aperto: «${tv.text}»` : 'Nessun campo di testo aperto';
}

for (const button of document.querySelectorAll('[data-power]')) {
  button.addEventListener('click', () => { tv.power = button.dataset.power; tv.fieldFocused = false; log('event', `la TV passa a: ${tv.power}`); push(); });
}
$('field').addEventListener('click', () => { tv.focusTextField(!tv.fieldFocused); log('event', tv.fieldFocused ? 'la TV apre un campo di testo' : 'la TV chiude il campo di testo'); renderPanel(); });
$('home').addEventListener('click', () => { if (tv.power === 'on') { tv.goHome(); log('event', 'la TV torna alla Home'); } });
$('zap').addEventListener('click', () => { if (tv.power !== 'on') return; tv.channelIndex = (tv.channelIndex + 3) % tv.channels.length; tv.appId = 'com.webos.app.livetv'; tv.source = 'Canali TV'; log('event', 'qualcuno cambia canale con il telecomando'); push(); });
$('app').addEventListener('click', () => { if (tv.power !== 'on') return; tv.appId = 'netflix'; tv.source = 'Netflix'; log('event', 'la TV apre Netflix'); push(); });
$('fail').addEventListener('click', () => { tv.failNext = tv.failNext ? null : (domain) => domain !== 'lgtv_pointer'; renderPanel(); });
$('external').addEventListener('click', () => { external = !external; push(); });
$('wake').addEventListener('change', (event) => { tv.wakeDelayMs = Number(event.target.value); });
$('latency').addEventListener('change', (event) => { tv.latencyMs = Number(event.target.value); });
$('clear').addEventListener('click', () => { $('log').replaceChildren(); });

push();
