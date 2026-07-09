'use strict';

const {
  add,
  subtract,
  multiply,
  divide,
  power,
  calculate,
} = require('./calculator');

// ---------------------------------------------------------------------------
// add
// ---------------------------------------------------------------------------
describe('add', () => {
  test('returns sum of two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('handles negative numbers', () => {
    expect(add(-5, 3)).toBe(-2);
  });

  test('handles zero', () => {
    expect(add(0, 7)).toBe(7);
  });

  test('parses string inputs', () => {
    expect(add('4', '6')).toBe(10);
  });

  test('throws TypeError for non-numeric input', () => {
    expect(() => add('abc', 5)).toThrow(TypeError);
  });

  test('throws TypeError for undefined', () => {
    expect(() => add(undefined, 5)).toThrow(TypeError);
  });

  test('throws TypeError for null', () => {
    expect(() => add(null, 5)).toThrow(TypeError);
  });
});

// ---------------------------------------------------------------------------
// subtract
// ---------------------------------------------------------------------------
describe('subtract', () => {
  test('returns difference of two numbers', () => {
    expect(subtract(10, 3)).toBe(7);
  });

  test('handles negative result', () => {
    expect(subtract(3, 10)).toBe(-7);
  });

  test('parses string inputs', () => {
    expect(subtract('9', '4')).toBe(5);
  });

  test('throws TypeError for non-numeric input', () => {
    expect(() => subtract('xyz', 1)).toThrow(TypeError);
  });
});

// ---------------------------------------------------------------------------
// multiply
// ---------------------------------------------------------------------------
describe('multiply', () => {
  test('returns product of two numbers', () => {
    expect(multiply(4, 5)).toBe(20);
  });

  test('handles negative numbers', () => {
    expect(multiply(-3, 6)).toBe(-18);
  });

  test('multiplies by zero', () => {
    expect(multiply(99, 0)).toBe(0);
  });

  test('parses string inputs', () => {
    expect(multiply('7', '8')).toBe(56);
  });

  test('throws TypeError for non-numeric input', () => {
    expect(() => multiply('hello', 3)).toThrow(TypeError);
  });
});

// ---------------------------------------------------------------------------
// divide
// ---------------------------------------------------------------------------
describe('divide', () => {
  test('returns quotient of two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('handles non-integer result', () => {
    expect(divide(7, 2)).toBe(3.5);
  });

  test('handles negative division', () => {
    expect(divide(-12, 4)).toBe(-3);
  });

  test('parses string inputs', () => {
    expect(divide('9', '3')).toBe(3);
  });

  test('throws TypeError for non-numeric input', () => {
    expect(() => divide('foo', 2)).toThrow(TypeError);
  });

  test('throws Error when dividing by zero', () => {
    expect(() => divide(5, 0)).toThrow('除数不能为 0');
  });
});

// ---------------------------------------------------------------------------
// power
// ---------------------------------------------------------------------------
describe('power', () => {
  test('calculates a raised to power b', () => {
    expect(power(2, 3)).toBe(8);
  });

  test('returns 1 when exponent is 0', () => {
    expect(power(5, 0)).toBe(1);
  });

  test('handles negative exponent', () => {
    expect(power(2, -1)).toBe(0.5);
  });

  test('handles decimal exponent', () => {
    expect(power(9, 0.5)).toBe(3);
  });

  test('parses string inputs', () => {
    expect(power('3', '2')).toBe(9);
  });

  test('throws TypeError for non-numeric input', () => {
    expect(() => power('abc', 2)).toThrow(TypeError);
  });
});

// ---------------------------------------------------------------------------
// calculate
// ---------------------------------------------------------------------------
describe('calculate', () => {
  test('calls add for "add" operation', () => {
    expect(calculate('add', 2, 3)).toBe(5);
  });

  test('calls subtract for "subtract" operation', () => {
    expect(calculate('subtract', 10, 4)).toBe(6);
  });

  test('calls multiply for "multiply" operation', () => {
    expect(calculate('multiply', 3, 7)).toBe(21);
  });

  test('calls divide for "divide" operation', () => {
    expect(calculate('divide', 20, 4)).toBe(5);
  });

  test('throws Error for unsupported operation', () => {
    expect(() => calculate('modulo', 2, 3)).toThrow(/不支持的操作/);
  });
});
