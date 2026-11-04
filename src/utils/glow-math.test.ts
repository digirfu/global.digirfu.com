import test from 'node:test';
import assert from 'node:assert/strict';
import {
  interpolateBowlKeys,
  pointToSegmentDistance,
  isInsideBowl,
  computeLetterProgress,
  calculateLetterState,
  hexToRgb,
  mixRgb,
  smoothstep,
  clamp,
} from './glow-math';

test('clamp and smoothstep stay within [0, 1]', () => {
  assert.equal(clamp(-0.5), 0);
  assert.equal(clamp(1.5), 1);
  assert.equal(clamp(0.5), 0.5);

  assert.equal(smoothstep(0), 0);
  assert.equal(smoothstep(1), 1);
  assert.equal(smoothstep(0.5), 0.5);
  assert.ok(smoothstep(0.2) > 0 && smoothstep(0.2) < 0.2);
});

test('interpolateBowlKeys returns exact key values at key boundaries', () => {
  const atZero = interpolateBowlKeys(0);
  assert.equal(atZero.tip, 0.30);
  assert.equal(atZero.half, 0.34);
  assert.equal(atZero.soft, 0.22);

  const at066 = interpolateBowlKeys(0.66);
  assert.equal(at066.tip, 1.05);
  assert.equal(at066.half, 0.46);

  const beyondMax = interpolateBowlKeys(2.5);
  assert.equal(beyondMax.tip, 2.40);
  assert.equal(beyondMax.half, 3.00);
});

test('interpolateBowlKeys interpolates linearly between keys', () => {
  // between 0.18 and 0.40: midpoint q = 0.29
  // tip goes 0.80 -> 0.95: midpoint is 0.875
  const mid = interpolateBowlKeys(0.29);
  assert.ok(Math.abs(mid.tip - 0.875) < 0.001);
});

test('pointToSegmentDistance calculates accurate euclidean distances', () => {
  // Segment from (0,0) to (10,0). Test point (5, 5). Distance should be 5.
  const d = pointToSegmentDistance(5, 5, 0, 0, 10, 0);
  assert.equal(d, 5);

  // Point beyond endpoint (15, 0). Distance to (10,0) is 5.
  const d2 = pointToSegmentDistance(15, 0, 0, 0, 10, 0);
  assert.equal(d2, 5);
});

test('isInsideBowl identifies coordinates inside or outside the flared wall', () => {
  const aspect = 16 / 9;
  const tip = 1.0;
  const half = 0.4;
  // Inside center near top
  assert.equal(isInsideBowl(0.01, 0.1, tip, half, aspect), true);
  // Outside far horizontally
  assert.equal(isInsideBowl(10.0, 0.1, tip, half, aspect), false);
  // Below tip
  assert.equal(isInsideBowl(0.0, 1.2, tip, half, aspect), false);
});

test('computeLetterProgress calculates character stagger accurately', () => {
  // At p = 0, all should be 0
  assert.equal(computeLetterProgress(0, 0, 10, 0.35), 0);
  assert.equal(computeLetterProgress(0, 5, 10, 0.35), 0);

  // At p = 1, char 0 should be 1
  assert.equal(computeLetterProgress(1, 0, 10, 0.35), 1);
  // At p = 1, last char should also reach 1 since p*(1+spread) - (n-1)/n = 1.35 - 0.9 = 0.45 > spread
  assert.equal(computeLetterProgress(1, 9, 10, 0.35), 1);
});

test('calculateLetterState maps stages: ghost -> accent -> final', () => {
  const ghost = hexToRgb('#ffffff');
  const accent = hexToRgb('#3f7cff');
  const final = hexToRgb('#0b1d3a');

  const s0 = calculateLetterState(0, ghost, accent, final);
  assert.equal(s0.opacity, 0);
  assert.equal(s0.blur, 8);

  const sMid1 = calculateLetterState(0.35, ghost, accent, final);
  assert.equal(sMid1.opacity, 1);
  assert.ok(Math.abs(sMid1.blur - 1.5) < 0.01);

  const sMid2 = calculateLetterState(0.70, ghost, accent, final);
  assert.equal(sMid2.opacity, 1);
  assert.equal(sMid2.blur, 0);
  assert.equal(sMid2.color, 'rgb(63, 124, 255)');

  const s1 = calculateLetterState(1.0, ghost, accent, final);
  assert.equal(s1.opacity, 1);
  assert.equal(s1.blur, 0);
  assert.equal(s1.color, 'rgb(11, 29, 58)');
});
