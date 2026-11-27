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

const dpad = (t) => `
  <div class="dpad">
    <span></span>${key(icon('chevron-up'), { button: 'UP', label: t('label.up') })}<span></span>
    ${key(icon('chevron-left'), { button: 'LEFT', label: t('label.left') })}${key('OK', { button: 'ENTER', className: 'ok primary' })}${key(icon('chevron-right'), { button: 'RIGHT', label: t('label.right') })}
    <span></span>${key(icon('chevron-down'), { button: 'DOWN', label: t('label.down') })}<span></span>
  </div>`;

const transport = (t) => `
  <div class="transport">
    ${key(icon('rewind'), { button: 'REWIND', label: t('label.rewind') })}
    ${key(icon('play-pause'), { action: 'play-pause', label: t('label.playPause') })}
    ${key(icon('fast-forward'), { button: 'FASTFORWARD', label: t('label.fastForward') })}
  </div>`;

const keypad = (t) => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => key(n, { button: String(n) })).join('');
  return `
    <div class="keypad">${digits}${key(t('label.list'), { button: 'LIST' })}${key('0', { button: '0' })}${key(t('label.guide'), { button: 'GUIDE' })}</div>
    <div class="keys-extra">
      ${key(icon('menu'), { button: 'MENU', label: t('label.menu') })}
      ${key(icon('information-outline'), { button: 'INFO', label: t('label.info') })}
      ${key(icon('exit-to-app'), { button: 'EXIT', label: t('label.exit') })}
    </div>
    <div class="colors">
      ${key('', { button: 'RED', className: 'red', label: t('label.red') })}${key('', { button: 'GREEN', className: 'green', label: t('label.green') })}
      ${key('', { button: 'YELLOW', className: 'yellow', label: t('label.yellow') })}${key('', { button: 'BLUE', className: 'blue', label: t('label.blue') })}
    </div>`;
};

const sheetHead = (t, title, extra = '') => `
  <div class="sheet-grip"></div>
  <div class="sheet-head"><b>${title}</b>${extra}${key(icon('close'), { action: 'close-sheet', label: t('label.close') })}</div>`;

const keyboardSheet = (t) => `
  <div class="kb-sheet" id="kb-sheet" role="dialog" aria-label="${t('label.keyboard')}">
    <div class="sheet-grip"></div>
    <div class="line">
      <input type="text" id="text" placeholder="${t('kb.placeholder')}" autocomplete="off" autocapitalize="sentences" enterkeyhint="send">
      ${key(icon('microphone'), { action: 'dictate', className: 'icon-only', label: t('label.dictate') })}
      ${key(icon('close'), { action: 'close-sheet', className: 'icon-only', label: t('label.close') })}
    </div>
    <div class="line">
      ${key(t('label.clear'), { action: 'clear-text' })}
      ${key(`${icon('keyboard-return')}&nbsp;${t('label.enter')}`, { action: 'enter-key', className: 'primary' })}
    </div>
    <div class="status">${t('kb.hint')}</div>
  </div>`;

const channelsSheet = (t) => `
  <div class="panel-sheet" id="channels-sheet" role="dialog" aria-label="${t('label.channels')}">
    ${sheetHead(t, t('label.channels'), key(icon('dialpad'), { action: 'open-numpad', label: t('label.typeNumber') }))}
    <label class="search">${icon('magnify')}<input type="search" id="channel-search" placeholder="${t('search.placeholder')}" autocomplete="off" enterkeyhint="search"></label>
    <div class="sheet-scroll" id="channel-list"></div>
  </div>`;

const numpadSheet = (t) => {
  const digit = (n) => `<button class="key" data-digit="${n}">${n}</button>`;
  return `
  <div class="panel-sheet" id="numpad-sheet" role="dialog" aria-label="${t('label.channelNumber')}">
    ${sheetHead(t, t('label.channelNumber'))}
    <div class="num-display" id="num-display" role="button" aria-label="${t('label.goToChannel')}"><span class="num-ring" id="num-ring"></span><b id="num-value"></b><span id="num-name"></span></div>
    <div class="num-keys">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit).join('')}
      <button class="key" data-digit="-" aria-label="${t('label.dash')}">${icon('minus')}</button>${digit(0)}<button class="key" data-digit="del" aria-label="${t('label.delete')}">${icon('backspace-outline')}</button>
    </div>
  </div>`;
};

const inputsSheet = (t) => `
  <div class="panel-sheet" id="inputs-sheet" role="dialog" aria-label="${t('label.inputsAndApps')}">
    ${sheetHead(t, t('label.inputsAndApps'))}
    <div class="sheet-scroll" id="inputs-body"></div>
  </div>`;

/** Expanding controls opened from the dock, like the Control Center sliders: volume and channel. */
const popovers = (t) => `
  <div class="pop-scrim" id="pop-scrim"></div>
  <div class="pop" id="pop-volume" role="dialog" aria-label="${t('label.volume')}">
    <div class="vpill" id="vpill"><div class="vfill" id="vfill"></div><div class="vlabel">${icon('volume-high')}<b id="vol-level">–</b></div></div>
    <div class="pop-row">
      <button class="key" data-repeat="VOLUMEDOWN" aria-label="${t('label.volumeDown')}">${icon('minus')}</button>
      <button class="key" data-repeat="VOLUMEUP" aria-label="${t('label.volumeUp')}">${icon('plus')}</button>
    </div>
  </div>
  <div class="pop" id="pop-channel" role="dialog" aria-label="${t('label.channel')}">
    <div class="cpill">
      <button class="key" data-repeat="CHANNELUP" aria-label="${t('label.channelUp')}">${icon('chevron-up')}</button>
      <div class="clabel"><b id="pop-channel-number">–</b><span id="pop-channel-name"></span></div>
      <button class="key" data-repeat="CHANNELDOWN" aria-label="${t('label.channelDown')}">${icon('chevron-down')}</button>
    </div>
    <div class="pop-row">
      <button class="key" data-action="open-numpad" aria-label="${t('label.typeNumber')}">${icon('dialpad')}</button>
      <button class="key" data-action="open-channels" aria-label="${t('label.channelList')}">${icon('format-list-bulleted')}</button>
    </div>
  </div>`;

const TAB_BUTTONS = [
  { tab: 'dpad', icon: 'dpad' },
  { tab: 'pad', icon: 'touch' },
  { tab: 'keys', icon: 'keypad' },
  { tab: 'apps', icon: 'apps' },
];

export function cardTemplate(t) {
  const tabBar = TAB_BUTTONS.map((tab) => `<button class="tab" data-tab="${tab.tab}" aria-label="${t(`tab.${tab.tab}`)}">${tabIcon(tab.icon)}<span class="tab-label">${t(`tab.${tab.tab}`)}</span></button>`).join('');
  return `
<ha-card>
  <div class="kb-backdrop" id="kb-backdrop"></div>
  <div class="head">
    <button class="key power" id="power" aria-label="${t('label.power')}">${icon('power')}</button>
    <div class="info"><div class="title" id="name"></div><div class="status" id="status"></div></div>
    <button class="key" data-action="open-inputs" aria-label="${t('label.inputsAndApps')}" data-group="controls">${icon('video-input-hdmi')}</button>
    <button class="key" id="mute" data-action="mute" aria-label="${t('label.mute')}"></button>
  </div>

  <div class="now" id="now" data-mode="live" data-group="controls">
    <button class="key step live-only" data-repeat="CHANNELDOWN" aria-label="${t('label.channelDown')}">${icon('chevron-left')}</button>
    <button class="open" data-action="open-now" aria-label="${t('label.channelsAndApps')}">
      <div class="logo" id="now-logo"></div>
      <div class="text"><div class="line1" id="now-title"></div><div class="line2" id="now-sub"></div><div class="bar" id="now-bar"><i id="now-fill"></i></div></div>
    </button>
    <button class="key step live-only" data-repeat="CHANNELUP" aria-label="${t('label.channelUp')}">${icon('chevron-right')}</button>
    <button class="key step app-only" data-button="REWIND" aria-label="${t('label.rewind')}">${icon('rewind')}</button>
    <button class="key step app-only" data-action="play-pause" aria-label="${t('label.playPause')}">${icon('play-pause')}</button>
    <button class="key step app-only" data-button="FASTFORWARD" aria-label="${t('label.fastForward')}">${icon('fast-forward')}</button>
  </div>

  <div class="body" id="body" data-active-tab="dpad">
    <div class="stage" id="stage">
      <div class="center" id="center">
        <div class="panel" data-panel="dpad">${dpad(t)}${transport(t)}</div>
        <div class="panel" data-panel="pad"><div class="pad" id="pad"></div></div>
        <div class="panel" data-panel="keys">${keypad(t)}</div>
      </div>
      <div class="scroll-view" data-view="apps"><div id="apps"></div></div>

      <div class="standby-overlay">
        <button class="power-big" id="power-big" aria-label="${t('standby.off')}">${icon('power')}</button>
        <div><b id="standby-title"></b><span id="standby-hint"></span></div>
      </div>
      <div class="toast" id="toast" role="status"></div>
      <div class="sheet" id="sheet">
        <b>${t('sheet.powerOff')}</b>
        <div class="hint" id="sheet-hint"></div>
        <div class="track"><div class="fill" id="sheet-fill"></div></div>
      </div>
    </div>
    <div class="rail scroll" id="strip"><span>▲</span><span class="vertical">${t('rail.scroll')}</span><span>▼</span></div>
  </div>

  <div class="dock" data-group="controls">
    ${key(icon('keyboard-backspace'), { button: 'BACK', label: t('label.back') })}
    ${key(icon('home'), { button: 'HOME', label: t('label.home') })}
    ${key(icon('keyboard-outline'), { action: 'open-keyboard', label: t('label.keyboard') })}
    <button class="key" data-action="toggle-volume" id="dock-volume" aria-label="${t('label.volume')}">${icon('volume-high')}</button>
    <button class="key" data-action="toggle-channel" id="dock-channel" aria-label="${t('label.channels')}">${icon('television-guide')}</button>
  </div>
  <div class="tabs" id="tabs" data-group="controls"><span class="tab-pill" id="tab-pill"><i class="blob" id="tab-blob"></i></span>${tabBar}</div>
  ${popovers(t)}
  ${keyboardSheet(t)}${channelsSheet(t)}${numpadSheet(t)}${inputsSheet(t)}
</ha-card>`;
}

export const muteIcon = (muted) => icon(muted ? 'volume-off' : 'volume-high');

export const padHint = (hasPointer, t) =>
  hasPointer
    ? `${icon('cursor-default-click-outline')}<span>${t('pad.pointer')}</span>`
    : `${icon('gesture-swipe')}<span>${t('pad.swipe')}</span>`;
