/** Card markup. Data attributes are the contract with the card class: data-button, data-action, data-tab, data-repeat. */

export const icon = (name) => `<ha-icon icon="mdi:${name}"></ha-icon>`;

/** Own line icons for the tab bar (they match the design wireframes, which Material Design Icons does not). */
const TAB_ICONS = {
  dpad: '<path d="M12 3l3 4h-6zM12 21l3-4h-6zM3 12l4-3v6zM21 12l-4-3v6z"/><circle cx="12" cy="12" r="2"/>',
  touch: '<path d="M5 4l5 15 2.5-6 6-2.5z"/>',
  keypad: '<path d="M6 6h.01M12 6h.01M18 6h.01M6 12h.01M12 12h.01M18 12h.01M6 18h.01M12 18h.01M18 18h.01" style="stroke-width:3.4"/>',
  apps: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
};
const tabIcon = (name) => `<svg class="tab-icon" viewBox="0 0 24 24" aria-hidden="true">${TAB_ICONS[name]}</svg>`;

/** A remote key that presses a TV button (`data-button`) or runs a card action (`data-action`). */
const key = (content, { button, action, className = '', label = '' }) => {
  const target = button ? `data-button="${button}"` : `data-action="${action}"`;
  const aria = label ? ` aria-label="${label}"` : '';
  return `<button class="key ${className}" ${target}${aria}>${content}</button>`;
};

const dpad = () => `
  <div class="dpad">
    <span></span>${key(icon('chevron-up'), { button: 'UP', label: 'Su' })}<span></span>
    ${key(icon('chevron-left'), { button: 'LEFT', label: 'Sinistra' })}${key('OK', { button: 'ENTER', className: 'ok primary' })}${key(icon('chevron-right'), { button: 'RIGHT', label: 'Destra' })}
    <span></span>${key(icon('chevron-down'), { button: 'DOWN', label: 'Giù' })}<span></span>
  </div>`;

const transport = () => `
  <div class="transport">
    ${key(icon('rewind'), { button: 'REWIND', label: 'Indietro veloce' })}
    ${key(icon('play-pause'), { action: 'play-pause', label: 'Play e pausa' })}
    ${key(icon('fast-forward'), { button: 'FASTFORWARD', label: 'Avanti veloce' })}
  </div>`;

const keypad = () => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => key(n, { button: String(n) })).join('');
  return `
    <div class="keypad">${digits}${key('Lista', { button: 'LIST' })}${key('0', { button: '0' })}${key('Guida', { button: 'GUIDE' })}</div>
    <div class="keys-extra">
      ${key(icon('menu'), { button: 'MENU', label: 'Menu' })}
      ${key(icon('information-outline'), { button: 'INFO', label: 'Info' })}
      ${key(icon('exit-to-app'), { button: 'EXIT', label: 'Esci' })}
    </div>
    <div class="colors">
      ${key('', { button: 'RED', className: 'red', label: 'Rosso' })}${key('', { button: 'GREEN', className: 'green', label: 'Verde' })}
      ${key('', { button: 'YELLOW', className: 'yellow', label: 'Giallo' })}${key('', { button: 'BLUE', className: 'blue', label: 'Blu' })}
    </div>`;
};

const sheetHead = (title, extra = '') => `
  <div class="sheet-grip"></div>
  <div class="sheet-head"><b>${title}</b>${extra}${key(icon('close'), { action: 'close-sheet', label: 'Chiudi' })}</div>`;

const keyboardSheet = () => `
  <div class="kb-sheet" id="kb-sheet" role="dialog" aria-label="Tastiera">
    <div class="sheet-grip"></div>
    <div class="line">
      <input type="text" id="text" placeholder="Scrivi o detta…" autocomplete="off" autocapitalize="sentences" enterkeyhint="send">
      ${key(icon('microphone'), { action: 'dictate', className: 'icon-only', label: 'Detta' })}
      ${key(icon('close'), { action: 'close-sheet', className: 'icon-only', label: 'Chiudi' })}
    </div>
    <div class="line">
      ${key('Cancella', { action: 'clear-text' })}
      ${key(`${icon('keyboard-return')}&nbsp;Invio`, { action: 'enter-key', className: 'primary' })}
    </div>
    <div class="status">Il testo appare subito sul campo aperto della TV. Invio conferma e chiude.</div>
  </div>`;

const channelsSheet = () => `
  <div class="panel-sheet" id="channels-sheet" role="dialog" aria-label="Canali">
    ${sheetHead('Canali', key(icon('dialpad'), { action: 'open-numpad', label: 'Digita il numero' }))}
    <label class="search">${icon('magnify')}<input type="search" id="channel-search" placeholder="Cerca un canale" autocomplete="off" enterkeyhint="search"></label>
    <div class="sheet-scroll" id="channel-list"></div>
  </div>`;

const numpadSheet = () => {
  const digit = (n) => `<button class="key" data-digit="${n}">${n}</button>`;
  return `
  <div class="panel-sheet" id="numpad-sheet" role="dialog" aria-label="Numero del canale">
    ${sheetHead('Numero del canale')}
    <div class="num-display" id="num-display" role="button" aria-label="Vai al canale"><span class="num-ring" id="num-ring"></span><b id="num-value"></b><span id="num-name"></span></div>
    <div class="num-keys">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit).join('')}
      <button class="key" data-digit="-" aria-label="Trattino">${icon('minus')}</button>${digit(0)}<button class="key" data-digit="del" aria-label="Cancella">${icon('backspace-outline')}</button>
    </div>
  </div>`;
};

const inputsSheet = () => `
  <div class="panel-sheet" id="inputs-sheet" role="dialog" aria-label="Ingressi e app">
    ${sheetHead('Ingressi e app')}
    <div class="sheet-scroll" id="inputs-body"></div>
  </div>`;

/** Expanding controls opened from the dock, like the Control Center sliders: volume and channel. */
const popovers = () => `
  <div class="pop-scrim" id="pop-scrim"></div>
  <div class="pop" id="pop-volume" role="dialog" aria-label="Volume">
    <div class="vpill" id="vpill"><div class="vfill" id="vfill"></div><div class="vlabel">${icon('volume-high')}<b id="vol-level">–</b></div></div>
    <div class="pop-row">
      <button class="key" data-repeat="VOLUMEDOWN" aria-label="Volume giù">${icon('minus')}</button>
      <button class="key" data-repeat="VOLUMEUP" aria-label="Volume su">${icon('plus')}</button>
    </div>
  </div>
  <div class="pop" id="pop-channel" role="dialog" aria-label="Canale">
    <div class="cpill">
      <button class="key" data-repeat="CHANNELUP" aria-label="Canale su">${icon('chevron-up')}</button>
      <div class="clabel"><b id="pop-channel-number">–</b><span id="pop-channel-name"></span></div>
      <button class="key" data-repeat="CHANNELDOWN" aria-label="Canale giù">${icon('chevron-down')}</button>
    </div>
    <div class="pop-row">
      <button class="key" data-action="open-numpad" aria-label="Digita il numero">${icon('dialpad')}</button>
      <button class="key" data-action="open-channels" aria-label="Elenco canali">${icon('format-list-bulleted')}</button>
    </div>
  </div>`;

const TAB_BUTTONS = [
  { tab: 'dpad', icon: 'dpad', label: 'Frecce' },
  { tab: 'pad', icon: 'touch', label: 'Touchpad' },
  { tab: 'keys', icon: 'keypad', label: 'Tasti' },
  { tab: 'apps', icon: 'apps', label: 'App' },
];

export function cardTemplate() {
  const tabBar = TAB_BUTTONS.map((t) => `<button class="tab" data-tab="${t.tab}" aria-label="${t.label}">${tabIcon(t.icon)}<span class="tab-label">${t.label}</span></button>`).join('');
  return `
<ha-card>
  <div class="kb-backdrop" id="kb-backdrop"></div>
  <div class="head">
    <button class="key power" id="power" aria-label="Accensione">${icon('power')}</button>
    <div class="info"><div class="title" id="name"></div><div class="status" id="status"></div></div>
    <button class="key" data-action="open-inputs" aria-label="Ingressi e app" data-group="controls">${icon('video-input-hdmi')}</button>
    <button class="key" id="mute" data-action="mute" aria-label="Muto"></button>
  </div>

  <div class="now" id="now" data-mode="live" data-group="controls">
    <button class="key step live-only" data-repeat="CHANNELDOWN" aria-label="Canale giù">${icon('chevron-left')}</button>
    <button class="open" data-action="open-now" aria-label="Canali e app">
      <div class="logo" id="now-logo"></div>
      <div class="text"><div class="line1" id="now-title"></div><div class="line2" id="now-sub"></div><div class="bar" id="now-bar"><i id="now-fill"></i></div></div>
    </button>
    <button class="key step live-only" data-repeat="CHANNELUP" aria-label="Canale su">${icon('chevron-right')}</button>
    <button class="key step app-only" data-button="REWIND" aria-label="Indietro veloce">${icon('rewind')}</button>
    <button class="key step app-only" data-action="play-pause" aria-label="Play e pausa">${icon('play-pause')}</button>
    <button class="key step app-only" data-button="FASTFORWARD" aria-label="Avanti veloce">${icon('fast-forward')}</button>
  </div>

  <div class="body" id="body" data-active-tab="dpad">
    <div class="stage" id="stage">
      <div class="center" id="center">
        <div class="panel" data-panel="dpad">${dpad()}${transport()}</div>
        <div class="panel" data-panel="pad"><div class="pad" id="pad"></div></div>
        <div class="panel" data-panel="keys">${keypad()}</div>
      </div>
      <div class="scroll-view" data-view="apps"><div id="apps"></div></div>

      <div class="standby-overlay">
        <button class="power-big" id="power-big" aria-label="Accendi la TV">${icon('power')}</button>
        <div><b id="standby-title"></b><span id="standby-hint"></span></div>
      </div>
      <div class="toast" id="toast" role="status"></div>
      <div class="sheet" id="sheet">
        <b>Spegnere la TV?</b>
        <div class="hint" id="sheet-hint"></div>
        <div class="track"><div class="fill" id="sheet-fill"></div></div>
      </div>
    </div>
    <div class="rail scroll" id="strip"><span>▲</span><span class="vertical">scorri</span><span>▼</span></div>
  </div>

  <div class="dock" data-group="controls">
    ${key(icon('keyboard-backspace'), { button: 'BACK', label: 'Indietro' })}
    ${key(icon('home'), { button: 'HOME', label: 'Home' })}
    ${key(icon('keyboard-outline'), { action: 'open-keyboard', label: 'Tastiera' })}
    <button class="key" data-action="toggle-volume" id="dock-volume" aria-label="Volume">${icon('volume-high')}</button>
    <button class="key" data-action="toggle-channel" id="dock-channel" aria-label="Canali">${icon('television-guide')}</button>
  </div>
  <div class="tabs" id="tabs" data-group="controls"><span class="tab-pill" id="tab-pill"><i class="blob" id="tab-blob"></i></span>${tabBar}</div>
  ${popovers()}
  ${keyboardSheet()}${channelsSheet()}${numpadSheet()}${inputsSheet()}
</ha-card>`;
}

export const muteIcon = (muted) => icon(muted ? 'volume-off' : 'volume-high');

export const padHint = (hasPointer) =>
  hasPointer
    ? `${icon('cursor-default-click-outline')}<span>Trascina per muovere<br>Tocca per cliccare<br>Doppio tocco tenuto: trascina</span>`
    : `${icon('gesture-swipe')}<span>Swipe = frecce<br>Tocco = OK</span>`;
