const { currying } = require('./otherPolyfills');

// To run: npx jest curry.test.js

describe('currying', () => {
  test('calls fn when all args provided at once', () => {
    const sum = (a, b, c) => a + b + c;
    const curried = currying(sum);

    expect(curried(1, 2, 3)).toBe(6);
  });

  test('supports one arg at a time', () => {
    const sum = (a, b, c) => a + b + c;
    const curried = currying(sum);

    expect(curried(1)(2)(3)).toBe(6);
  });

  test('supports partial application', () => {
    const sum = (a, b, c) => a + b + c;
    const curried = currying(sum);

    expect(curried(1, 2)(3)).toBe(6);
    expect(curried(1)(2, 3)).toBe(6);
  });

  test('works with a two-argument function', () => {
    const multiply = (a, b) => a * b;
    const curried = currying(multiply);

    expect(curried(3)(4)).toBe(12);
    expect(curried(3, 4)).toBe(12);
  });

  test('works with a single-argument function', () => {
    const double = (a) => a * 2;
    const curried = currying(double);

    expect(curried(5)).toBe(10);
  });

  test('reusable partial — same curried fn called multiple times', () => {
    const sum = (a, b, c) => a + b + c;
    const curried = currying(sum);
    const addOne = curried(1);

    expect(addOne(2)(3)).toBe(6);
    expect(addOne(5)(5)).toBe(11);
  });
});
