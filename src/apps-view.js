/** Renders the "App" tab: favourite tiles, inputs, and a collapsible list of the other apps. */
import { BRAND_COLORS, FALLBACK_TILE_COLOR } from './constants.js';
import { groupSources } from './logic.js';

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const section = (title, content) => {
  const fragment = document.createDocumentFragment();
  fragment.append(element('div', 'label', title), content);
  return fragment;
};

/** An app tile: the TV's own icon when it was copied locally, otherwise its brand colour and first letter. */
export function appTile(name, { current, icons, onSelect }) {
  const tile = element('button', name === current ? 'tile current' : 'tile');
  const badge = element('div', 'icon');
  if (icons?.[name]) {
    badge.style.backgroundImage = `url("${icons[name]}")`;
  } else {
    badge.style.background = BRAND_COLORS[name] ?? FALLBACK_TILE_COLOR;
    badge.textContent = name.charAt(0);
  }
  tile.append(badge, element('span', '', name));
  tile.addEventListener('click', () => onSelect(name));
  return tile;
}

const inputIcon = (name) => (name === 'Canali TV' ? 'television' : 'video-input-hdmi');

function appGrid(names, { current, icons, onSelect }) {
  const grid = element('div', 'tiles');
  names.forEach((name) => grid.append(appTile(name, { current, icons, onSelect })));
  return grid;
}

/** Inputs as small icon keys: the TV tuner and the HDMI numbers. */
function inputKeys(names, { current, onSelect, showIcon }) {
  const grid = element('div', 'inputs-grid');
  names.forEach((name) => {
    const button = element('button', name === current ? 'key current' : 'key');
    button.innerHTML = `${showIcon(inputIcon(name))}<span>${name.replace('HDMI ', '')}</span>`;
    button.setAttribute('aria-label', name);
    button.addEventListener('click', () => onSelect(name));
    grid.append(button);
  });
  return grid;
}

/** The "App" tab: favourite apps first, then all the others in one scrolling grid. Inputs live in the header sheet. */
export function renderApps(container, { sources, current, config, icons, onSelect, showIcon }) {
  container.replaceChildren();
  if (!sources.length) {
    container.append(element('div', 'status', 'Elenco disponibile a TV accesa'));
    return;
  }
  const groups = groupSources(sources, config);
  const options = { current, icons, onSelect, showIcon };
  if (groups.favorites.length) container.append(section('PREFERITE', appGrid(groups.favorites, options)));
  if (groups.others.length) container.append(section(groups.favorites.length ? 'ALTRE APP' : 'APP', appGrid(groups.others, options)));
}

/** Body of the "Ingressi e app" sheet: the same pieces plus a way to the full list. */
export function renderInputsSheet(container, { sources, current, config, icons, onSelect, showIcon }) {
  container.replaceChildren();
  if (!sources.length) {
    container.append(element('div', 'status', 'Elenco disponibile a TV accesa'));
    return;
  }
  const groups = groupSources(sources, config);
  const options = { current, icons, onSelect, showIcon };
  const all = element('button', 'key more');
  all.dataset.action = 'show-all-apps';
  all.textContent = `Tutte le app · ${groups.others.length + groups.favorites.length}`;
  container.append(
    section('INGRESSI', inputKeys(groups.inputs, options)),
    section('APP', appGrid(groups.favorites, options)),
    all,
  );
}
