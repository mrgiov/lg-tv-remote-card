/** Reads data from the TV through webostv.command responses, with a small browser cache. */
import { CACHE_TTL_MS } from './constants.js';

const CACHE_PREFIX = 'lg-tv-remote:';

export function readCache(key, maxAgeMs = Infinity) {
  try {
    const entry = JSON.parse(localStorage.getItem(CACHE_PREFIX + key));
    return entry && Date.now() - entry.at < maxAgeMs ? entry.value : null;
  } catch (error) {
    return null; // storage is optional
  }
}

export function writeCache(key, value) {
  try { localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ at: Date.now(), value })); } catch (error) { /* storage is optional */ }
}

/** Calls a service that returns data and gives back the part that belongs to `entity`. */
async function callForResponse(hass, domain, service, entity, data) {
  const result = await hass.callWS({
    type: 'call_service', domain, service, service_data: { entity_id: entity, ...data }, return_response: true,
  });
  return result?.response?.[entity] ?? result?.response; // entity services key by entity, plain services do not
}

export const tvCommand = (hass, entity, command, payload) =>
  callForResponse(hass, 'webostv', 'command', entity, payload ? { command, payload } : { command });

/** The raw channel list, cached for a day. */
export async function loadChannelList(hass, entity) {
  const cached = readCache(`channels:${entity}`, CACHE_TTL_MS);
  if (cached) return cached;
  const response = await tvCommand(hass, entity, 'tv/getChannelList');
  const list = (response?.channelList ?? []).map((channel) => ({
    channelId: channel.channelId, channelNumber: channel.channelNumber, channelName: channel.channelName,
    TV: channel.TV, Radio: channel.Radio, Invisible: channel.Invisible,
  })); // the TV sends about 500 KB; keep only what the card uses
  if (list.length) writeCache(`channels:${entity}`, list);
  return list;
}

/** Programme list of a channel (the current one when `channelId` is omitted). */
export async function loadProgramInfo(hass, entity, channelId) {
  const response = await tvCommand(hass, entity, 'tv/getChannelProgramInfo', channelId ? { channelId } : undefined);
  return { channel: response?.channel, programList: response?.programList ?? [] };
}

/** {app title: local icon url}; empty when the lgtv_pointer component is not installed. */
export async function loadAppIcons(hass, entity) {
  const cached = readCache(`icons:${entity}`, CACHE_TTL_MS);
  if (cached) return cached;
  if (!hass.services.lgtv_pointer?.app_icons) return {};
  const response = await callForResponse(hass, 'lgtv_pointer', 'app_icons', entity, {});
  const icons = response?.icons ?? {};
  if (Object.keys(icons).length) writeCache(`icons:${entity}`, icons);
  return icons;
}
