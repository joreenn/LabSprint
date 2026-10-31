import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  accessibleAccent,
  appearanceVariables,
  contrastRatio,
  defaultAppearance,
  isAppearance,
  themes,
} from '../src/lib/appearance';

test('all theme buttons retain readable white text, including extreme custom colors', () => {
  for (const color of [
    ...themes.map((t) => t.accent),
    '#ffffff',
    '#ffff00',
    '#000000',
    '#00ff00',
    '#00ffff',
    '#ff00ff',
  ])
    assert.ok(contrastRatio(accessibleAccent(color), '#ffffff') >= 4.5, color);
});
test('appearance rejects arbitrary CSS values and preserves gradient vs solid intent', () => {
  assert.equal(isAppearance({ ...defaultAppearance, accent: 'red;display:none' }), false);
  assert.equal(isAppearance({ ...defaultAppearance, secondary: '#fff' }), false);
  assert.equal(isAppearance(defaultAppearance), true);
  assert.match(appearanceVariables(defaultAppearance)['--app-gradient'], /^linear-gradient/);
  assert.doesNotMatch(
    appearanceVariables({ ...defaultAppearance, style: 'solid' })['--app-gradient'],
    /gradient/,
  );
  assert.equal(themes.length >= 18, true);
});
test('dark themes preserve both readable accent text and white button labels', () => {
  for (const theme of [...themes, { ...defaultAppearance, accent: '#000000' }]) {
    const variables = appearanceVariables(theme, true);
    assert.ok(contrastRatio(variables['--primary'], '#222431') >= 4.5);
    assert.ok(contrastRatio(variables['--button-primary'], '#ffffff') >= 4.5);
  }
});

test('custom extremes keep hero captions and the practice button readable', () => {
  for (const theme of [
    ...themes,
    ...['#000000', '#ffffff', '#ffff00', '#00ffff'].map((color) => ({
      ...defaultAppearance,
      accent: color,
      secondary: color,
    })),
  ]) {
    const variables = appearanceVariables(theme);
    assert.ok(contrastRatio(variables['--green'], '#303b1f') >= 4.5);
    for (const color of variables['--app-gradient'].match(/#[a-f0-9]{6}/g) || [])
      assert.ok(contrastRatio(color, '#ada6c4') >= 4.5);
  }
});
