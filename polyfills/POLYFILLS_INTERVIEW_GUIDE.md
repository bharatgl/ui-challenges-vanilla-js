# Polyfills Interview Guide

Use this as a revision sheet for frontend interviews. The code below is written in plain JavaScript and explained in interview-friendly language.

## Quick Interview Formula

When asked to write a polyfill, answer in this order:

1. State what the native method does.
2. Mention 1 or 2 edge cases before coding.
3. Write the basic working version first.
4. Call out improvements after the code.

Example opening:

"I will first write the core version, then I will mention edge cases like empty input, sparse arrays, preserving order, or handling plain values."

## 1. `Function.prototype.myCall`

```js
Function.prototype.myCall = function (context, ...args) {
  const fn = this; // 1
  const ctx = context == null ? globalThis : Object(context); // 2
  const key = Symbol("fn"); // 3

  ctx[key] = fn; // 4
  const result = ctx[key](...args); // 5
  delete ctx[key]; // 6

  return result; // 7
};
```

### Line by line

1. `this` is the function on which `myCall` was invoked, so I store it in `fn`.
2. If `context` is `null` or `undefined`, I default to `globalThis`; otherwise I convert primitives like strings or numbers into objects.
3. I create a unique property key so I do not overwrite any existing property on the context object.
4. I temporarily attach the function to the context object.
5. I invoke that function so `this` inside it points to `ctx`.
6. I clean up the temporary property after execution.
7. I return whatever the original function returned.

### Follow-up questions

- Why use `Object(context)`?
  Because primitives cannot directly hold properties, so I box them into objects.
- Why use `Symbol`?
  It guarantees a unique temporary key and avoids collisions.
- What happens if `context` is `null`?
  In non-strict polyfill style, it falls back to `globalThis`.
- Will this change `this` for arrow functions?
  No. Arrow functions do not have their own dynamic `this`.

## 2. `Function.prototype.myApply`

```js
Function.prototype.myApply = function (context, args = []) {
  const fn = this; // 1
  const ctx = context == null ? globalThis : Object(context); // 2
  const key = Symbol("fn"); // 3

  ctx[key] = fn; // 4
  const result = ctx[key](...args); // 5
  delete ctx[key]; // 6

  return result; // 7
};
```

### Line by line

1. Save the original function.
2. Normalize the context exactly like `call`.
3. Create a unique temporary property.
4. Attach the function to the target object.
5. Execute it, but spread an array of arguments instead of taking them individually.
6. Remove the temporary property.
7. Return the original result.

### Follow-up questions

- Difference between `call` and `apply`?
  `call` takes arguments one by one, `apply` takes them as an array-like input.
- Why give `args = []` by default?
  So `myApply(obj)` still works without throwing on spread.

## 3. `Function.prototype.myBind`

```js
Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this; // 1

  return function boundFn(...laterArgs) { // 2
    return fn.apply( // 3
      context == null ? globalThis : Object(context), // 4
      [...boundArgs, ...laterArgs] // 5
    );
  };
};
```

### Line by line

1. Save the original function that needs a bound context.
2. Return a new wrapper function; `bind` does not execute immediately.
3. When the wrapper is called, invoke the original function using `apply`.
4. Reuse the normalized context.
5. Merge arguments given during binding with arguments given later.

### Follow-up questions

- Difference between `bind` and `call`?
  `call` executes immediately; `bind` returns a new function.
- Does this support constructor behavior with `new`?
  No. This is the common interview version. Full native `bind` also handles `new`.
- What is partial application here?
  Pre-filling some arguments with `boundArgs`.

## 4. `Array.prototype.myMap`

```js
Array.prototype.myMap = function (callback, thisArg) {
  if (typeof callback !== "function") { // 1
    throw new TypeError("callback must be a function");
  }

  const result = new Array(this.length); // 2

  for (let i = 0; i < this.length; i++) { // 3
    if (i in this) { // 4
      result[i] = callback.call(thisArg, this[i], i, this); // 5
    }
  }

  return result; // 6
};
```

### Line by line

1. Native `map` expects a function, so I validate the input.
2. I create a result array of the same length because `map` preserves array length.
3. Loop through every index.
4. Skip holes in sparse arrays, which matches native behavior.
5. Call the callback with value, index, and original array; optionally bind `thisArg`.
6. Return the transformed array.

### Follow-up questions

- Why not use `push`?
  Using indexed assignment preserves the same positions and holes as the original array.
- Does `map` mutate the original array?
  No. It returns a new array.
- Why `callback.call(thisArg, ...)`?
  Native methods allow an optional `thisArg`.

## 5. `Array.prototype.myFilter`

```js
Array.prototype.myFilter = function (callback, thisArg) {
  if (typeof callback !== "function") { // 1
    throw new TypeError("callback must be a function");
  }

  const result = []; // 2

  for (let i = 0; i < this.length; i++) { // 3
    if (i in this && callback.call(thisArg, this[i], i, this)) { // 4
      result.push(this[i]); // 5
    }
  }

  return result; // 6
};
```

### Line by line

1. Validate callback.
2. Start with an empty result because we do not know output length in advance.
3. Iterate through the original array.
4. Skip holes and keep only elements whose callback returns a truthy value.
5. Add matching elements to the result.
6. Return the filtered array.

### Follow-up questions

- Why not create `new Array(this.length)`?
  Because filter output length is not fixed.
- Does `filter` preserve holes?
  No. It returns a packed array of matched values.
- Can callback access index and array?
  Yes, native signature is `(value, index, array)`.

## 6. `Array.prototype.myReduce`

```js
Array.prototype.myReduce = function (callback, initialValue) {
  if (typeof callback !== "function") { // 1
    throw new TypeError("callback must be a function");
  }

  let i = 0; // 2
  let accumulator; // 3

  if (arguments.length >= 2) { // 4
    accumulator = initialValue; // 5
  } else {
    while (i < this.length && !(i in this)) { // 6
      i++;
    }

    if (i >= this.length) { // 7
      throw new TypeError("Reduce of empty array with no initial value");
    }

    accumulator = this[i]; // 8
    i++; // 9
  }

  for (; i < this.length; i++) { // 10
    if (i in this) { // 11
      accumulator = callback(accumulator, this[i], i, this); // 12
    }
  }

  return accumulator; // 13
};
```

### Line by line

1. Validate that reducer is a function.
2. Start from index `0`.
3. Declare accumulator separately because it depends on whether `initialValue` exists.
4. Check whether the caller passed an initial value.
5. If yes, accumulator starts from it.
6. If not, find the first actual present element because sparse arrays may have holes at the start.
7. If no valid element exists, reduce must throw.
8. Use the first present element as the initial accumulator.
9. Move to the next index because the first one is already consumed.
10. Iterate through the remaining array.
11. Skip holes in sparse arrays.
12. Update accumulator using callback signature `(accumulator, currentValue, index, array)`.
13. Return the final accumulated result.

### Follow-up questions

- Why use `arguments.length >= 2` instead of `initialValue !== undefined`?
  Because `undefined` can itself be a valid initial value.
- Why skip holes using `i in this`?
  Native `reduce` ignores empty slots in sparse arrays.
- What happens for `[].myReduce(fn)`?
  It throws a `TypeError`.

## 7. `Promise.myAll`

```js
Promise.myAll = function (iterable) {
  const items = Array.from(iterable); // 1

  return new Promise((resolve, reject) => { // 2
    if (items.length === 0) { // 3
      resolve([]);
      return;
    }

    const results = new Array(items.length); // 4
    let completed = 0; // 5

    items.forEach((item, index) => { // 6
      Promise.resolve(item).then( // 7
        (value) => { // 8
          results[index] = value; // 9
          completed += 1; // 10

          if (completed === items.length) { // 11
            resolve(results); // 12
          }
        },
        reject // 13
      );
    });
  });
};
```

### Line by line

1. Convert the iterable into an array so I can use `length`, indexing, and order tracking.
2. Return a new promise, which is what `Promise.all` does.
3. If input is empty, resolve immediately with an empty array.
4. Create a results array to preserve input order.
5. Track how many promises have fulfilled.
6. Process each item.
7. Wrap each item with `Promise.resolve` so plain values also work.
8. On fulfillment, capture the resolved value.
9. Store the result at the same input index.
10. Increment the count of completed promises.
11. When every promise has fulfilled, finish the outer promise.
12. Resolve with the ordered results array.
13. If any input rejects, reject immediately. This is fail-fast behavior.

### Follow-up questions

- Why use `Promise.resolve(item)`?
  Because `Promise.all` accepts plain values, promises, and thenables.
- Why not `push` into `results`?
  Because completion order can differ from input order.
- Does `Promise.all` wait for all promises after one rejection?
  No. It rejects immediately on the first rejection.

## 8. `Promise.myRace`

```js
Promise.myRace = function (iterable) {
  const items = Array.from(iterable); // 1

  return new Promise((resolve, reject) => { // 2
    items.forEach((item) => { // 3
      Promise.resolve(item).then(resolve, reject); // 4
    });
  });
};
```

### Line by line

1. Convert iterable into an array for consistent handling.
2. Return a new promise.
3. Start all entries together.
4. The first promise that settles, either fulfilled or rejected, decides the output.

### Follow-up questions

- Difference between `race` and `all`?
  `all` waits for every fulfillment, `race` settles on the first settled input.
- What happens for an empty iterable?
  The returned promise stays pending forever.
- Difference between `race` and `any`?
  `race` cares about first settle; `any` cares about first fulfillment.

## 9. `Promise.myAllSettled`

```js
Promise.myAllSettled = function (iterable) {
  const items = Array.from(iterable); // 1

  return new Promise((resolve) => { // 2
    if (items.length === 0) { // 3
      resolve([]);
      return;
    }

    const results = new Array(items.length); // 4
    let completed = 0; // 5

    items.forEach((item, index) => { // 6
      Promise.resolve(item)
        .then(
          (value) => { // 7
            results[index] = { status: "fulfilled", value }; // 8
          },
          (reason) => { // 9
            results[index] = { status: "rejected", reason }; // 10
          }
        )
        .then(() => { // 11
          completed += 1; // 12

          if (completed === items.length) { // 13
            resolve(results); // 14
          }
        });
    });
  });
};
```

### Line by line

1. Convert iterable to array.
2. Return a new promise that will always resolve once all inputs settle.
3. Empty input resolves immediately with `[]`.
4. Create result storage.
5. Track how many inputs have settled.
6. Process each input promise or value.
7. Success handler.
8. Store the fulfilled shape expected by native `allSettled`.
9. Failure handler.
10. Store the rejected shape expected by native `allSettled`.
11. After either success or failure, continue to the next `.then`.
12. Count this item as settled.
13. When all have settled, finish.
14. Resolve with the ordered status array.

### Follow-up questions

- Why does `allSettled` resolve even if some promises reject?
  Because the goal is to report every outcome, not fail fast.
- Difference between `allSettled` and `all`?
  `all` rejects on first failure, `allSettled` waits for every promise and returns status objects.

## 10. `Promise.myAny`

```js
Promise.myAny = function (iterable) {
  const items = Array.from(iterable); // 1

  return new Promise((resolve, reject) => { // 2
    if (items.length === 0) { // 3
      reject(new AggregateError([], "All promises were rejected"));
      return;
    }

    const errors = new Array(items.length); // 4
    let rejectedCount = 0; // 5

    items.forEach((item, index) => { // 6
      Promise.resolve(item).then(resolve).catch((error) => { // 7
        errors[index] = error; // 8
        rejectedCount += 1; // 9

        if (rejectedCount === items.length) { // 10
          reject(new AggregateError(errors, "All promises were rejected")); // 11
        }
      });
    });
  });
};
```

### Line by line

1. Convert iterable to array for indexing and length checks.
2. Return a new promise.
3. If there is no input, reject immediately with `AggregateError`.
4. Keep all rejection reasons.
5. Track how many inputs have rejected.
6. Process each input.
7. If any promise fulfills, resolve immediately; otherwise catch that rejection.
8. Store rejection reason in the same input position.
9. Increase rejected count.
10. If every input rejected, then `any` must reject.
11. Reject with an `AggregateError` containing all collected errors.

### Follow-up questions

- Difference between `any` and `race`?
  `any` ignores rejections until all reject; `race` settles on the first result of either kind.
- Why `AggregateError`?
  Native `Promise.any` reports all rejection reasons together.
- What if the first three reject and the fourth fulfills?
  It resolves with the fourth value immediately.

## 11. `debounce`

```js
function debounce(fn, delay) {
  let timerId; // 1

  return function (...args) { // 2
    const context = this; // 3
    clearTimeout(timerId); // 4

    timerId = setTimeout(() => { // 5
      fn.apply(context, args); // 6
    }, delay);
  };
}
```

### Line by line

1. Store timer id in closure so it persists across calls.
2. Return a wrapped function.
3. Save `this` so the original function gets the right context.
4. Cancel any previously scheduled execution.
5. Schedule a new execution after the delay.
6. Run the original function with original context and latest arguments.

### Follow-up questions

- What problem does debounce solve?
  It prevents a function from running too often during rapid repeated events.
- Common use case?
  Search input API calls, resize handlers.
- Difference between leading and trailing debounce?
  Leading runs at the start, trailing runs after the final pause.

## 12. `throttle`

```js
function throttle(fn, limit) {
  let waiting = false; // 1

  return function (...args) { // 2
    if (waiting) { // 3
      return;
    }

    waiting = true; // 4
    fn.apply(this, args); // 5

    setTimeout(() => { // 6
      waiting = false; // 7
    }, limit);
  };
}
```

### Line by line

1. Keep a flag that tells whether execution is currently blocked.
2. Return a wrapped function.
3. If still inside throttle window, ignore the call.
4. Lock the function.
5. Execute immediately on the first allowed call.
6. Start a timer for the throttle window.
7. Unlock after the limit so the next call can run.

### Follow-up questions

- What problem does throttle solve?
  It limits execution rate to at most once in a given time window.
- Difference between debounce and throttle?
  Debounce waits for silence, throttle allows periodic execution.
- What kind of throttle is this?
  Leading-only throttle.

## 13. `memoize`

```js
function memoize(fn) {
  const cache = new Map(); // 1

  return function (...args) { // 2
    const key = JSON.stringify(args); // 3

    if (cache.has(key)) { // 4
      return cache.get(key); // 5
    }

    const result = fn.apply(this, args); // 6
    cache.set(key, result); // 7

    return result; // 8
  };
}
```

### Line by line

1. Create a cache that survives across calls.
2. Return a wrapper function.
3. Build a simple cache key from the arguments.
4. If result already exists, skip recomputation.
5. Return cached output.
6. Otherwise run the original function.
7. Store the new result.
8. Return it.

### Follow-up questions

- Limitation of `JSON.stringify(args)`?
  It can fail for circular references and may not distinguish all object shapes safely.
- Good use case?
  Expensive pure functions like factorial, fibonacci, or derived computations.
- Can we memoize async functions?
  Yes, but then the cache usually stores promises.

## 14. `curry`

```js
function curry(fn) {
  return function curried(...args) { // 1
    if (args.length >= fn.length) { // 2
      return fn.apply(this, args); // 3
    }

    return function (...nextArgs) { // 4
      return curried.apply(this, [...args, ...nextArgs]); // 5
    };
  };
}
```

### Line by line

1. Return a wrapper that collects arguments over multiple calls.
2. `fn.length` tells how many declared parameters the original function expects.
3. If enough arguments are available, execute the original function.
4. Otherwise return another function to collect more arguments.
5. Merge old and new arguments, then retry the same logic.

### Follow-up questions

- Difference between currying and partial application?
  Currying converts a function into chained unary or partial calls; partial application only pre-fills some arguments.
- What is `fn.length`?
  The number of declared parameters on the function definition.
- Can `curried(1, 2)(3)` work?
  Yes, because the implementation accepts multiple args per step.

## 15. `Array.prototype.myFlat`

```js
Array.prototype.myFlat = function (depth = 1) {
  const result = []; // 1

  const flatten = (arr, currentDepth) => { // 2
    for (let i = 0; i < arr.length; i++) { // 3
      if (!(i in arr)) { // 4
        continue;
      }

      const value = arr[i]; // 5

      if (Array.isArray(value) && currentDepth > 0) { // 6
        flatten( // 7
          value,
          currentDepth === Infinity ? Infinity : currentDepth - 1
        );
      } else {
        result.push(value); // 8
      }
    }
  };

  flatten(this, depth); // 9
  return result; // 10
};
```

### Line by line

1. This array will collect the flattened output.
2. Use a helper function so recursion is easier to read.
3. Iterate through the current array.
4. Skip holes in sparse arrays.
5. Read current element.
6. If the element is itself an array and depth still allows flattening, recurse.
7. Reduce depth by one each time, except for `Infinity`.
8. Otherwise push the value directly into the result.
9. Start recursion with the original array.
10. Return the flattened result.

### Follow-up questions

- What happens when `depth = 0`?
  The array is returned effectively unchanged.
- How do you support `Infinity`?
  Do not decrement it.
- Why use recursion?
  Because nested arrays naturally fit a recursive traversal.

## 16. Bonus: `Object.myAssign`

```js
Object.myAssign = function (target, ...sources) {
  if (target == null) { // 1
    throw new TypeError("Cannot convert undefined or null to object");
  }

  const to = Object(target); // 2

  for (const source of sources) { // 3
    if (source == null) { // 4
      continue;
    }

    const from = Object(source); // 5

    for (const key of Object.keys(from)) { // 6
      to[key] = from[key]; // 7
    }
  }

  return to; // 8
};
```

### Line by line

1. Native `Object.assign` throws if target is `null` or `undefined`.
2. Convert target to an object.
3. Process each source one by one.
4. Ignore `null` and `undefined` sources.
5. Convert source to object form.
6. Iterate over own enumerable string keys.
7. Copy value into target.
8. Return the mutated target object.

### Follow-up questions

- Is `Object.assign` deep copy?
  No. It is a shallow copy.
- What extra improvement can be added?
  Copy enumerable symbol keys too.

## 17. Bonus: `mySetTimeout` using `setInterval`

```js
function mySetTimeout(fn, delay, ...args) {
  const id = setInterval(() => { // 1
    clearInterval(id); // 2
    fn(...args); // 3
  }, delay);

  return id; // 4
}
```

### Line by line

1. Start an interval that would normally repeat forever.
2. Cancel it on the very first execution.
3. Run the original callback once, so behavior approximates `setTimeout`.
4. Return the interval id so it can still be cleared externally.

### Follow-up questions

- Is this a perfect `setTimeout` polyfill?
  No. It is only an approximation using `setInterval`.
- Why is it still acceptable in interviews?
  Because it demonstrates timer understanding and event loop basics.

## Most Likely Interview Follow-ups

These are the questions most likely to come after you finish coding:

- Why do Promise polyfills use `Promise.resolve`?
  To normalize both plain values and promises.
- Why preserve input order in `Promise.all` and `Promise.allSettled`?
  Native methods return results in input order, not completion order.
- Why use `i in this` in array polyfills?
  To skip holes in sparse arrays.
- Why `arguments.length` check in `reduce`?
  Because `undefined` can be a valid initial value.
- Difference between `Promise.any` and `Promise.race`?
  `any` resolves on first fulfillment and rejects only if all reject; `race` settles on first settle.
- Difference between debounce and throttle?
  Debounce waits for the last call, throttle limits call frequency.
- Biggest limitation of simple `bind` implementation?
  It does not correctly handle constructor usage with `new`.
- Biggest limitation of simple `memoize` implementation?
  `JSON.stringify` is not safe for every input shape.

## 30 Second Revision Script

If you are short on time, remember these points:

- `call`, `apply`, `bind`: temporarily attach function to object, then invoke.
- `map`, `filter`, `reduce`: loop, skip sparse holes, return transformed output.
- `Promise.all`: all success, fail fast.
- `Promise.race`: first settled wins.
- `Promise.allSettled`: wait for all and return status objects.
- `Promise.any`: first fulfilled wins, else `AggregateError`.
- `debounce`: reset timer on every call.
- `throttle`: allow one call per interval.
- `memoize`: cache by arguments.
- `curry`: keep collecting args until enough arrive.
- `flat`: recurse while depth allows.

## Small Corrections From Your Draft

These were the main issues in the earlier snippets, and they are easy to mention if asked:

- `Promise.myAll` used `promise.length`; it should check the iterable converted array.
- `Promise.allSettled` draft was incomplete and never built the final result array.
- `Promise.any` had typos like `funciton`, `error/errors`, and incorrect empty-input logic.
- `reduce` should find the first present element when no initial value is given.
- Prefer custom names like `myRace`, `myAny`, and `myFlat` in interviews instead of overwriting native methods.
