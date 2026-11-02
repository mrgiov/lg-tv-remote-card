/** Pure channel helpers: parsing what the TV reports, favourites, number entry. Covered by test/channels.test.mjs. */

/** The TV writes local times as "2026,11,03,08,30,00". */
export function parseTvTime(text) {
  const [year, month, day, hour, minute, second] = text.split(',').map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

/** The programme on air at `now`, or null when the list does not cover it (never guess a neighbour). */
export function currentProgram(programList, now = new Date()) {
  for (const program of programList ?? []) {
    const start = parseTvTime(program.localStartTime);
    const end = parseTvTime(program.localEndTime);
    if (start <= now && now < end) {
      return {
        name: program.programName, start, end,
        progress: (now - start) / (end - start),
        minutesLeft: Math.max(1, Math.ceil((end - now) / 60000)),
      };
    }
  }
  return null;
}

/** Visible TV channels from `tv/getChannelList`, in channel-number order. */
export function normalizeChannels(rawList) {
  return (rawList ?? [])
    .filter((channel) => channel.TV && !channel.Radio && !channel.Invisible)
    .map((channel) => ({ id: channel.channelId, number: String(channel.channelNumber), name: channel.channelName }))
    .sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
}

const plain = (text) => text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

export function searchChannels(channels, query) {
  const needle = plain(query.trim());
  if (!needle) return channels;
  return channels.filter((channel) => plain(channel.name).includes(needle) || channel.number.startsWith(needle));
}

/** The channel a typed number points to, or null. Leading zeros are ignored ("05" is channel 5). */
export function channelForNumber(channels, typed) {
  if (!typed) return null;
  return channels.find((channel) => parseFloat(channel.number) === parseFloat(typed)) ?? null;
}

export function toggleFavorite(favorites, number) {
  return favorites.includes(number) ? favorites.filter((n) => n !== number) : [...favorites, number];
}

/** Favourite channels in number order; with none chosen yet, the first few so the list is never empty. */
export function favoriteChannels(channels, favorites, fallbackCount = 8) {
  if (!favorites.length) return channels.slice(0, fallbackCount);
  return channels.filter((channel) => favorites.includes(channel.number));
}

/** A stable colour per channel name, used for the logo tile when the TV has no logo. */
export function channelColor(name) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `hsl(${hash % 360} 55% 38%)`;
}

export const isLiveTv = (attributes) => attributes?.app_id === 'com.webos.app.livetv';
