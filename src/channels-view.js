/** Renders the channel list sheet and the number display. Pure markup from data; events are handled by the card. */
import { favoriteChannels, channelColor, searchChannels } from './channels.js';
import { FAVORITES_FALLBACK } from './constants.js';
import { icon } from './template.js';

const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function programLine(program, t) {
  if (!program?.name) return '';
  return `${escapeHtml(program.name)} · ${t('now.minutes', { n: program.minutesLeft })}`;
}

function channelRow(channel, { current, starred, program, t }) {
  const mini = program?.name ? `<div class="mini"><i style="width:${Math.round(program.progress * 100)}%"></i></div>` : '';
  return `
    <div class="ch-row${channel.number === current ? ' current' : ''}" role="button" tabindex="0"${channel.number === current ? ' aria-current="true"' : ''} data-channel="${escapeHtml(channel.number)}">
      <div class="logo" style="--logo:${channelColor(channel.name)}">${escapeHtml(channel.number)}</div>
      <div class="text"><div class="line1">${escapeHtml(channel.name)}</div><div class="line2">${programLine(program, t)}</div>${mini}</div>
      <button class="star${starred ? ' on' : ''}" data-star="${escapeHtml(channel.number)}" aria-label="${t(starred ? 'star.remove' : 'star.add')}">${icon(starred ? 'star' : 'star-outline')}</button>
    </div>`;
}

/**
 * Searching lists matches; otherwise favourites first, then "all channels" on request.
 * `programs` maps a channel number to the programme on air (when already known).
 */
export function channelListHtml({ channels, favorites, query, showAll, current, programs, t }) {
  if (!channels.length) return `<div class="status">${t('list.empty')}</div>`;
  const row = (channel) => channelRow(channel, { current, starred: favorites.includes(channel.number), program: programs[channel.number], t });
  if (query.trim()) {
    const found = searchChannels(channels, query).slice(0, 60);
    return found.length ? found.map(row).join('') : `<div class="status">${t('list.noMatch')}</div>`;
  }
  const picked = favoriteChannels(channels, favorites, FAVORITES_FALLBACK);
  const heading = t(favorites.length ? 'list.favorites' : 'list.firstChannels');
  const more = `<button class="key more" data-action="toggle-all-channels">${showAll ? t('list.showFavorites') : t('list.allCount', { n: channels.length })}${icon(showAll ? 'chevron-up' : 'chevron-down')}</button>`;
  return `<div class="label">${heading}</div>${picked.map(row).join('')}${more}${showAll ? `<div class="label">${t('list.all')}</div>${channels.map(row).join('')}` : ''}`;
}
