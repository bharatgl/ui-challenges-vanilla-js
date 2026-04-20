require('./otherPolyfills');

// To run: npx jest flat.test.js

describe('Array.prototype.flat', () => {
  test('flattens one level by default', () => {
    expect([1, [2, 3], [4]].flat()).toEqual([1, 2, 3, 4]);
  });

  test('does not flatten beyond default depth of 1', () => {
    expect([1, [2, [3]]].flat()).toEqual([1, 2, [3]]);
  });

  test('flattens to specified depth', () => {
    expect([1, [2, [3, [4]]]].flat(2)).toEqual([1, 2, 3, [4]]);
  });

  test('flattens fully with Infinity depth', () => {
    expect([1, [2, [3, [4, [5]]]]].flat(Infinity)).toEqual([1, 2, 3, 4, 5]);
  });

  test('returns same array if already flat', () => {
    expect([1, 2, 3].flat()).toEqual([1, 2, 3]);
  });

  test('handles empty array', () => {
    expect([].flat()).toEqual([]);
  });

  test('handles array with empty nested arrays', () => {
    expect([1, [], [2]].flat()).toEqual([1, 2]);
  });
});
