# Verify — calculator.js + users.js

## Build

No build step — pure Node.js (CommonJS).

```bash
# Nothing to build, just Node.js >= 18
node --version
```

## Launch / Run

**CLI surface (calculator):**

```bash
node run-calculator.js <a> <op> <b>
# Example: node run-calculator.js 2 power 3
```

**Library surface (both modules):**

```bash
node -e "const m = require('./calculator'); console.log(m.power(2, 3))"
node -e "const m = require('./users'); console.log(m.addUser('test','t@t.com'))"
```

## Drive flows

| Surface | Flow |
|---------|------|
| CLI | `node run-calculator.js` with each operation |
| CLI (errors) | Missing args, non-numeric args, unsupported ops |
| Library | `require` + call exported functions directly |
| Library (errors) | Call with bad types, missing fields, edge values |

## Gotchas

- `run-calculator.js` help text (line 11) is hand-maintained — check it when adding operations
- `OPERATIONS` map in `calculator.js` is the source of truth for valid ops
- `users.js` has internal mutable state (`clearUsers()` needed for isolation)
