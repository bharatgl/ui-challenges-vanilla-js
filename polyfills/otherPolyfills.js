//polyfills for debounce, throttle , memoise, flat, curry
//first polyfill for debounce

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

module.exports = { debounce };

// polyfill for throttle 
