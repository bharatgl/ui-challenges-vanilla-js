const { memoize } = require('./otherPolyfills');

// To run: npx jest memoise_function.test.js

describe('memoize', () => {
  test('returns correct value', () => {
    const sum = (a, b) => a + b;
    const memoized = memoize(sum);

    expect(memoized(2, 2)).toBe(4);
    expect(memoized(1, 2)).toBe(3);
  });

  test('does not call original fn again for same args', () => {
    const fn = jest.fn((a, b) => a + b);
    const memoized = memoize(fn);

    memoized(2, 2);
    memoized(2, 2);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('calls original fn for different args', () => {
    const fn = jest.fn((a, b) => a + b);
    const memoized = memoize(fn);

    memoized(2, 2);
    memoized(1, 2);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('returns cached value on repeated call', () => {
    const fn = jest.fn((a, b) => a + b);
    const memoized = memoize(fn);

    const first = memoized(2, 2);
    const second = memoized(2, 2);

    expect(first).toBe(second);
  });

  test('handles multiple unique calls correctly', () => {
    const fn = jest.fn((a, b) => a + b);
    const memoized = memoize(fn);

    memoized(2, 2); // call 1
    memoized(2, 2); // cached
    memoized(1, 2); // call 2

    expect(fn).toHaveBeenCalledTimes(2);
    expect(memoized(1, 2)).toBe(3); // still cached
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
