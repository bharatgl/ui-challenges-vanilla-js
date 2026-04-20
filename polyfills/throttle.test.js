const { throttle } = require('./otherPolyfills');

// To run: npx jest throttle.test.js

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('calls fn immediately on first call', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 300);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('does not call fn again within the limit', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 300);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('calls fn again after limit has passed', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 300);

    throttled();
    jest.advanceTimersByTime(300);
    throttled();

    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('does not call fn if called before limit expires', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 300);

    throttled();
    jest.advanceTimersByTime(200);
    throttled(); // still within limit

    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('passes arguments to fn', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 300);

    throttled('a', 'b');

    expect(fn).toHaveBeenCalledWith('a', 'b');
  });

  test('allows multiple calls separated by limit intervals', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 300);

    throttled();
    jest.advanceTimersByTime(300);
    throttled();
    jest.advanceTimersByTime(300);
    throttled();

    expect(fn).toHaveBeenCalledTimes(3);
  });
});
