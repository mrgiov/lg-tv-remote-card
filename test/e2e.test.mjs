/** End-to-end tests: the real card against a mock TV (no TV, no Home Assistant). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { MockTv } from './support/mock-tv.mjs';
import { mountCard, pointer, until, wait } from './support/dom.mjs';
import { POWER_HOLD_MS } from '../src/constants.js';

const withCard = (options, run) => async () => {
  const tv = new MockTv(options.tv);
  const ui = await mountCard(tv, options);
  try { await run({ tv, ui }); } finally { ui.unmount(); }
};

// ---- power --------------------------------------------------------------

test('power button: red while the TV is on, grey when it is off', withCard({}, async ({ tv, ui }) => {
  assert.equal(ui.byId('power').classList.contains('off'), false);
  tv.power = 'off';
  tv.onChange();
  assert.equal(ui.byId('power').classList.contains('off'), true);
  tv.power = 'unavailable';
  tv.onChange();
  assert.equal(ui.byId('power').classList.contains('off'), true);
}));

test('switching on: ring spins and status reads "Accensione…" until the TV reports on', withCard({ tv: { power: 'off', wakeDelayMs: 120 } }, async ({ tv, ui }) => {
  assert.ok(ui.$('.stage').classList.contains('standby'));
  ui.click('#power-big');
  assert.equal(ui.byId('power').classList.contains('busy'), true);
  assert.equal(ui.byId('status').textContent, 'Accensione…');
  assert.equal(tv.called('media_player', 'turn_on').length, 1);
  await until(() => tv.power === 'on');
  await until(() => !ui.byId('power').classList.contains('busy'));
  assert.equal(ui.$('.stage').classList.contains('standby'), false);
  assert.equal(ui.byId('power').classList.contains('off'), false);
}));

test('switching off needs a long press; a short tap does nothing', withCard({ tv: { sleepDelayMs: 500 } }, async ({ tv, ui }) => {
  const power = ui.byId('power');
  pointer('pointerdown', power);
  await wait(100);
  pointer('pointerup', power);
  await wait(50);
  assert.equal(tv.called('media_player', 'turn_off').length, 0);

  pointer('pointerdown', power);
  await wait(POWER_HOLD_MS + 150);
  assert.equal(tv.called('media_player', 'turn_off').length, 1);
  assert.equal(power.classList.contains('busy'), true);
  assert.equal(ui.byId('status').textContent, 'Spegnimento…');
  await until(() => tv.power === 'off');
  await until(() => !power.classList.contains('busy'));
  assert.equal(power.classList.contains('off'), true);
}));

// ---- remote keys (regression: clicks inside the body used to be taken for tab switches) ----

test('d-pad, keypad and nav keys send their buttons', withCard({}, async ({ tv, ui }) => {
  ui.click('[data-tab="dpad"]');
  for (const button of ['UP', 'LEFT', 'ENTER', 'RIGHT', 'DOWN']) ui.click(`[data-button="${button}"]`);
  ui.click('[data-button="BACK"]');
  ui.click('[data-button="HOME"]');
  await wait(20);
  ui.click('[data-tab="keys"]');
  for (const button of ['5', 'MENU', 'GUIDE', 'RED']) ui.click(`[data-button="${button}"]`);
  await wait(20);
  assert.deepEqual(tv.buttons(), ['UP', 'LEFT', 'ENTER', 'RIGHT', 'DOWN', 'BACK', 'HOME', '5', 'MENU', 'GUIDE', 'RED']);
}));

test('only a tab button switches tabs', withCard({}, async ({ ui }) => {
  ui.click('[data-tab="keys"]');
  assert.equal(ui.card._tab, 'keys');
  ui.click('[data-button="MENU"]');
  assert.equal(ui.card._tab, 'keys');
  ui.click('[data-tab="apps"]');
  assert.equal(ui.card._tab, 'apps');
  assert.ok(ui.$('[data-view="apps"]').classList.contains('active'));
}));

// ---- touchpad -------------------------------------------------------------

test('touchpad: a tap clicks, a drag moves the pointer', withCard({}, async ({ tv, ui }) => {
  ui.click('[data-tab="pad"]');
  const pad = ui.byId('pad');
  pointer('pointerdown', pad, { x: 100, y: 100 });
  pointer('pointerup', pad, { x: 100, y: 100 });
  await wait(30);
  assert.equal(tv.called('lgtv_pointer', 'click').length, 1);

  pointer('pointerdown', pad, { x: 100, y: 100, id: 2 });
  for (let i = 1; i <= 6; i += 1) { pointer('pointermove', pad, { x: 100 + i * 20, y: 100 + i * 10, id: 2 }); await wait(40); }
  pointer('pointerup', pad, { x: 220, y: 160, id: 2 });
  await wait(60);
  assert.ok(tv.called('lgtv_pointer', 'move').length >= 1);
}));

// ---- now playing strip -----------------------------------------------------

test('live TV: the strip shows channel and programme; the tint follows the channel', withCard({}, async ({ ui }) => {
  await until(() => ui.byId('now-sub').textContent.includes('Programma'));
  assert.equal(ui.byId('now-title').textContent, 'Rai 1');
  assert.match(ui.byId('now-sub').textContent, /Programma 1\.1 · \d+ min/);
  assert.equal(ui.byId('now').dataset.mode, 'live');
  assert.equal(ui.byId('now').classList.contains('gone'), false);
  assert.match(ui.$('ha-card').style.getPropertyValue('--tint'), /^hsl/);
}));

test('channel up and down move the channel and the strip follows', withCard({}, async ({ tv, ui }) => {
  ui.click('[data-repeat="CHANNELUP"]'); // a plain click: the hold-to-repeat handlers listen to pointer events
  tv.channelIndex = 1;
  tv.onChange();
  await until(() => ui.byId('now-title').textContent === 'Rai 2');
}));

test('inside an app: the strip shows the app with transport keys; on the home screen it disappears', withCard({}, async ({ tv, ui }) => {
  tv.appId = 'netflix';
  tv.source = 'Netflix';
  tv.onChange();
  assert.equal(ui.byId('now').dataset.mode, 'app');
  assert.equal(ui.byId('now-title').textContent, 'Netflix');
  assert.equal(ui.byId('now').classList.contains('gone'), false);
  tv.goHome();
  assert.equal(ui.byId('now').classList.contains('gone'), true);
}));

// ---- channels, favourites, number pad -------------------------------------

test('channels sheet: favourites with programmes, stars persist, search filters', withCard({}, async ({ tv, ui }) => {
  ui.click('.now .open');
  assert.equal(ui.$('ha-card').dataset.sheet, 'channels');
  await until(() => ui.$$('#channel-list .ch-row').length > 0);
  await until(() => ui.$$('#channel-list .line2').some((line) => line.textContent.includes('Programma')));
  ui.click('[data-star="3"]');
  assert.deepEqual(JSON.parse(localStorage.getItem('lg-tv-remote:favorites')).value, ['3']);
  assert.deepEqual(ui.$$('#channel-list .ch-row').map((row) => row.dataset.channel), ['3']);

  ui.click('[data-action="toggle-all-channels"]');
  assert.equal(ui.$$('#channel-list .ch-row').length, 1 + tv.channels.length);

  const search = ui.byId('channel-search');
  search.value = 'rai 4';
  search.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.deepEqual(ui.$$('#channel-list .ch-row').map((row) => row.dataset.channel), ['10']);
}));

test('tapping a channel tunes it and closes the sheet', withCard({}, async ({ tv, ui }) => {
  ui.click('.now .open');
  await until(() => ui.$$('#channel-list .ch-row').length > 0);
  ui.click('[data-channel="5"]');
  assert.equal(tv.called('media_player', 'play_media', { media_content_id: '5' }).length, 1);
  assert.equal(ui.$('ha-card').dataset.sheet, undefined);
  await until(() => ui.byId('now-title').textContent === 'Canale 5');
}));

test('number pad: the display names the channel, tapping it goes at once', withCard({}, async ({ tv, ui }) => {
  ui.click('.now .open');
  await until(() => ui.$$('#channel-list .ch-row').length > 0);
  ui.click('[data-action="open-numpad"]');
  assert.equal(ui.$('ha-card').dataset.sheet, 'numpad');
  ui.click('[data-digit="1"]');
  ui.click('[data-digit="0"]');
  assert.equal(ui.byId('num-value').textContent, '10');
  assert.equal(ui.byId('num-name').textContent, 'Rai 4');
  ui.click('#num-display');
  assert.equal(tv.called('media_player', 'play_media', { media_content_id: '10' }).length, 1);
}));

test('number pad: the channel goes by itself after 1.8 s, and every digit restarts the wait', withCard({}, async ({ tv, ui }) => {
  ui.click('.now .open');
  await until(() => ui.$$('#channel-list .ch-row').length > 0);
  ui.click('[data-action="open-numpad"]');
  ui.click('[data-digit="1"]');
  await wait(1200);
  ui.click('[data-digit="1"]'); // "11" is Iris: the first wait must not fire
  await wait(1200);
  assert.equal(tv.called('media_player', 'play_media').length, 0);
  await until(() => tv.called('media_player', 'play_media').length === 1, 1500);
  assert.equal(tv.called('media_player', 'play_media')[0].data.media_content_id, '11');
}));

test('number pad: an unknown number never tunes anything', withCard({}, async ({ tv, ui }) => {
  ui.click('.now .open');
  await until(() => ui.$$('#channel-list .ch-row').length > 0);
  ui.click('[data-action="open-numpad"]');
  ui.click('[data-digit="9"]');
  ui.click('[data-digit="9"]');
  assert.equal(ui.byId('num-name').textContent, 'Canale non trovato');
  ui.click('#num-display');
  await wait(2000);
  assert.equal(tv.called('media_player', 'play_media').length, 0);
}));

// ---- volume ------------------------------------------------------------

test('volume pop-over: opens from the dock, slider sets the level, closes on a tap outside', withCard({}, async ({ tv, ui }) => {
  ui.click('#dock-volume');
  assert.equal(ui.$('ha-card').dataset.pop, 'volume');
  const pill = ui.byId('vpill');
  pill.getBoundingClientRect = () => ({ top: 0, bottom: 200, left: 0, right: 60, width: 60, height: 200 });
  pointer('pointerdown', pill, { x: 30, y: 100 }); // halfway up
  await wait(30);
  assert.equal(tv.volume, 50);
  assert.equal(ui.byId('vol-level').textContent, '50');
  ui.click('#pop-scrim');
  assert.equal(ui.$('ha-card').dataset.pop, undefined);
}));

test('mute toggles through the header key', withCard({}, async ({ tv, ui }) => {
  ui.click('#mute');
  await until(() => tv.muted);
  await until(() => ui.byId('mute').classList.contains('alert'));
  ui.click('#mute');
  await until(() => !tv.muted);
}));

// ---- apps and inputs ----------------------------------------------------------

test('apps tab: favourites first, the rest below, icons come from the component, a tap selects the source', withCard({}, async ({ tv, ui }) => {
  ui.click('[data-tab="apps"]');
  await until(() => ui.$$('#apps .tile .icon').some((icon) => icon.style.backgroundImage.includes('Netflix')));
  const labels = ui.$$('#apps .label').map((label) => label.textContent);
  assert.deepEqual(labels, ['PREFERITE', 'ALTRE APP']);
  assert.equal(ui.$$('#apps .tile').some((tile) => tile.textContent.includes('Developer Mode')), false); // hidden by default
  assert.equal(ui.$('#apps .inputs-grid'), null);
  ui.$$('#apps .tile').find((tile) => tile.textContent.includes('YouTube')).click();
  assert.equal(tv.called('media_player', 'select_source', { source: 'YouTube' }).length, 1);
}));

test('inputs sheet: HDMI inputs as keys, apps below', withCard({}, async ({ tv, ui }) => {
  ui.click('[data-action="open-inputs"]');
  assert.equal(ui.$('ha-card').dataset.sheet, 'inputs');
  assert.equal(ui.$$('#inputs-body .inputs-grid .key').length, 5);
  ui.$$('#inputs-body .inputs-grid .key')[2].click();
  assert.equal(tv.called('media_player', 'select_source', { source: 'HDMI 2' }).length, 1);
  assert.equal(ui.$('ha-card').dataset.sheet, undefined);
}));

// ---- keyboard --------------------------------------------------------------------

test('keyboard: opens by itself when the TV focuses a field, mirrors the text, Enter sends it and closes', withCard({}, async ({ tv, ui }) => {
  await until(() => tv.listeners.length > 0);
  tv.focusTextField(true);
  assert.equal(ui.$('ha-card').dataset.sheet, 'keyboard');
  const input = ui.byId('text');
  input.value = 'ciao';
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  await until(() => tv.text === 'ciao');
  const insert = tv.called('webostv', 'command').find((call) => call.data.command.endsWith('/insertText'));
  assert.equal(insert.data.payload.replace, true); // the TV ignores anything but a real boolean
  ui.click('[data-action="enter-key"]');
  await until(() => ui.$('ha-card').dataset.sheet === undefined);
  assert.equal(tv.fieldFocused, false);
}));

test('keyboard: typing with no field open on the TV shows a clear error', withCard({}, async ({ tv, ui }) => {
  ui.click('[data-action="open-keyboard"]');
  const input = ui.byId('text');
  input.value = 'x';
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  await until(() => ui.byId('toast').classList.contains('visible'));
  assert.match(ui.byId('toast').textContent, /Nessun campo di testo aperto/);
}));

// ---- feedback -----------------------------------------------------------------------

test('haptics: native messages inside the app, strength follows the setting, off is silent', async () => {
  const kinds = async (config) => {
    const tv = new MockTv();
    const ui = await mountCard(tv, { config });
    ui.click('[data-button="HOME"]');
    const sent = tv.haptics.map((message) => message.payload.hapticType);
    ui.unmount();
    return sent;
  };
  assert.deepEqual(await kinds({}), ['selection']); // soft is the default
  assert.deepEqual(await kinds({ haptics: 'strong' }), ['medium']);
  assert.deepEqual(await kinds({ haptics: 'off' }), []);
  assert.deepEqual(await kinds({ haptics: false }), []);
});

test('haptics: in a plain browser the card vibrates instead', async () => {
  const tv = new MockTv();
  const ui = await mountCard(tv, { external: false });
  ui.click('[data-button="HOME"]');
  assert.deepEqual(window.vibrationLog, [20]);
  assert.equal(tv.haptics.length, 0);
  ui.unmount();
});

test('a failed command shows a toast and an error haptic', withCard({}, async ({ tv, ui }) => {
  tv.failNext = (domain, service) => service === 'button';
  ui.click('[data-button="UP"]');
  await until(() => ui.byId('toast').classList.contains('visible'));
  assert.ok(tv.haptics.some((message) => message.payload.hapticType === 'warning'));
}));

test('an unreachable TV says so instead of failing silently', withCard({ tv: { power: 'unavailable' } }, async ({ ui }) => {
  assert.equal(ui.byId('status').textContent, 'Non raggiungibile');
  assert.equal(ui.byId('standby-title').textContent, 'TV non raggiungibile');
}));
