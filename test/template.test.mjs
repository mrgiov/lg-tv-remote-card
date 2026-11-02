import test from 'node:test';
import assert from 'node:assert/strict';
import { cardTemplate } from '../src/template.js';
import { TABS } from '../src/constants.js';

test('only the tab buttons carry data-tab: the click handler would treat any other element as a tab switch', () => {
  const markup = cardTemplate();
  assert.equal((markup.match(/data-tab=/g) ?? []).length, TABS.length);
});
