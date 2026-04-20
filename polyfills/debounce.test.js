const { debounce } = require('./otherPolyfills');

// To run: npx jest debounce.test.js

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('calls fn after the delay', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('does not call fn if called again before delay', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    jest.advanceTimersByTime(200);
    debounced(); // resets timer
    jest.advanceTimersByTime(200);

    expect(fn).not.toHaveBeenCalled();
  });

  test('calls fn only once after multiple rapid calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    debounced();
    debounced();
    jest.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('passes arguments to fn', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced('a', 'b');
    jest.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledWith('a', 'b');
  });

  test('calls fn again after delay if called later', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    jest.advanceTimersByTime(300);

    debounced();
    jest.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
