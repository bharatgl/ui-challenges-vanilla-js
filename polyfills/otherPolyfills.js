//polyfills for debounce, throttle , memoise, flat, curry
//first polyfill for debounce

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// polyfill for throttle

function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// memoize polyfill

function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// polyfill for currying

function currying(fn, depth) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...next) => curried.apply(this, [...args, ...next]);
  };
}
// array.prototype.flat

Array.prototype.flat = function (depth = 1) {
  const result = [];

  for (const item of this) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...item.flat(depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
};

module.exports = { debounce, throttle, memoize, currying };
