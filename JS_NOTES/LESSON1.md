# JS Lesson 1 — Execution Context & Call Stack

> The single foundation lesson. Almost every JS "weird behavior" — hoisting, TDZ, `this`, `var`-leaks, stack traces — derives from this.

---

## What is an execution context (EC)?

When the engine encounters code — your script, or a function call — it creates an **execution context**. A container that holds:

- Memory for variables and functions
- A reference to its outer environment (powers the scope chain)
- A `this` binding
- A frame on the call stack
  Two kinds you care about:

- **Global Execution Context (GEC)** — one per script, created at start.
- **Function Execution Context (FEC)** — one per function call (every call — recursive calls each get their own).

---

## Three components of an EC

1. **Lexical Environment** — holds `let`, `const`, function declarations. Has an Environment Record (the bindings) and an Outer Lexical Environment Reference (parent scope pointer).
2. **Variable Environment** — holds `var` declarations.
3. **`this` binding** — determined at context creation.
   `let`/`const` and `var` live in different conceptual buckets — that's why they have different scoping rules.

---

## The two phases (the mental model)

### Phase 1 — Creation

- `var` → memory allocated, **initialized to `undefined`**
- function declaration → memory allocated, **full function value stored**
- `let` / `const` → memory allocated, **uninitialized** (TDZ)
- `class` → similar to `let` (TDZ)
- `this` binding determined
- outer reference set

### Phase 2 — Execution

Code runs line by line. Assignments happen, calls happen, expressions evaluate.

> "Hoisting moves declarations to the top" is technically wrong. Nothing moves. Phase 1 is the real explanation.

---

## Hoisting — full picture

```js
console.log(a); // undefined        — var: hoisted, init to undefined
console.log(b); // ReferenceError   — let: hoisted, TDZ
console.log(c); // ReferenceError   — const: hoisted, TDZ
console.log(typeof d); // undefined — undeclared + typeof = safe (special case)

foo(); // "A"        — function declaration fully hoisted
bar(); // TypeError  — bar is undefined (var-hoisted), can't call undefined
baz(); // ReferenceError — let-hoisted, TDZ

var a = 1;
let b = 2;
const c = 3;
function foo() {
  console.log("A");
}
var bar = function () {};
let baz = function () {};
```

### Sub-rules

- **Function declaration vs expression:** declarations are fully hoisted; expressions are not — only the variable they're assigned to is hoisted.
- **Duplicate function declarations:** last one wins (replaces during creation).
- **Functions in blocks:** historically inconsistent. Don't put `function` declarations inside `if`/`for` blocks. Use expressions.

---

## Temporal Dead Zone (TDZ)

The window between when a `let`/`const`/`class` enters scope and when it's initialized. Accessing it throws `ReferenceError: Cannot access 'x' before initialization`.

```js
{
  console.log(x); // ReferenceError
  let x = 5;
  console.log(x); // 5
}
```

Why TDZ exists:

1. Catches bugs (referencing before declaration is almost always wrong).
2. Distinguishes `let`/`const` from `var` (silent `undefined` vs. clean error).
   `typeof` is **not** safe inside TDZ:

```js
console.log(typeof y); // ReferenceError, NOT "undefined"
let y;
```

But `typeof` _is_ safe for truly undeclared variables:

```js
console.log(typeof neverDeclared); // "undefined" — no error
```

---

## The call stack

LIFO data structure tracking which EC is currently running.

- Script starts → push GEC.
- Function called → push FEC.
- Function returns → pop FEC.
- Script ends → pop GEC.

```js
function a() {
  b();
}
function b() {
  c();
}
function c() {
  console.log("hi");
}
a();
```

```
[ Global ]
[ Global, a ]
[ Global, a, b ]
[ Global, a, b, c ]   ← prints "hi"
[ Global, a, b ]
[ Global, a ]
[ Global ]
[ ]
```

This is exactly what stack traces show.

### Stack overflow

```js
function rec() {
  rec();
} // RangeError: Maximum call stack size exceeded
rec();
```

Stack is finite (~10k–15k frames in V8). No tail-call optimization in major engines (as of 2026), so deep recursion = overflow.

### Async and the stack

`setTimeout`'s callback does **not** run on top of the original stack — by the time it fires, the stack is empty. The callback is pushed onto an empty stack and runs fresh. (Why async stack traces are weird; full picture in Lesson 6.)

---

## Global EC specifics

- **Global object:** `window` (browser) / `global` (Node) / `globalThis` (everywhere).
- **`this` in GEC:** `window` in browser script, `module.exports` (`{}`) in Node module.
- **`var` at top level** becomes a property of the global object in browsers; `let`/`const` do NOT.

```js
var x = 1;
let y = 2;
console.log(window.x); // 1
console.log(window.y); // undefined
```

---

## Interview Q&A patterns

**Q.** Difference between hoisting `var` and `let`?
**A.** Both hoisted. `var` initialized to `undefined`; `let` uninitialized (TDZ). `var` reads give `undefined`; `let` reads throw.

**Q.** Why doesn't `console.log(a); var a = 5;` throw?
**A.** Phase 1 allocated `a` and set it to `undefined`. Phase 2 reads it before assignment.

**Q.** Why does this throw `ReferenceError` instead of giving `undefined`?
**A.** TDZ. `let`/`const`/`class` are hoisted but uninitialized.

**Q.** Function declaration vs expression hoisting?
**A.** Declarations: fully hoisted with body. Expressions: only the variable hoists; the function value is assigned at runtime.

**Q.** What's the call stack at the moment X logs?
**A.** Walk frame by frame, name each function in call order.

---

## Myths to kill

1. "Hoisting moves declarations to the top." — **No, two-phase model.**
2. "`var` doesn't get hoisted." — **Wrong, it does. It just initializes to undefined.**
3. "Only `var` hoists." — **Wrong; `let`/`const`/`class`/function-declarations all hoist, just differently.**
4. "Each `for` iteration creates a new execution context." — **Wrong; with `let` it creates a new lexical environment (block scope), not a new EC.**

---

## Drill (5 puzzles)

Predict output + one-sentence reason from the two-phase model.

```js
// 1
console.log(a);
console.log(b);
var a = 1;
let b = 2;

// 2
foo();
function foo() {
  console.log("A");
}
function foo() {
  console.log("B");
}

// 3
console.log(typeof x);
console.log(typeof y);
let y = 5;

// 4
function outer() {
  console.log(inner);
  inner();
  function inner() {
    console.log("inner!");
  }
}
outer();

// 5 — killer
console.log(typeof greet);
greet();
var greet = "hello";
function greet() {
  console.log("hi");
}
greet();
```

Right answer + wrong reason = wrong. Reasoning is the metric.
