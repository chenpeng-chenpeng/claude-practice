'use strict';

const { clamp, randomInt, formatCurrency, isPrime, factorial } = require('./number-utils');

describe('clamp', () => {
  test('值在范围内不变', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test('小于下限时返回下限', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  test('大于上限时返回上限', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test('min > max 抛出错误', () => {
    expect(() => clamp(5, 10, 0)).toThrow();
  });

  test('非数字输入抛出 TypeError', () => {
    expect(() => clamp('5', 0, 10)).toThrow(TypeError);
  });
});

describe('randomInt', () => {
  test('返回值在指定范围内', () => {
    for (let i = 0; i < 100; i++) {
      const val = randomInt(0, 10);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(10);
    }
  });

  test('min >= max 抛出错误', () => {
    expect(() => randomInt(5, 5)).toThrow();
  });

  test('返回整数', () => {
    const val = randomInt(0, 100);
    expect(Number.isInteger(val)).toBe(true);
  });
});

describe('formatCurrency', () => {
  test('格式化为人民币', () => {
    expect(formatCurrency(1234.5)).toBe('¥1,234.50');
  });

  test('整数补两位小数', () => {
    expect(formatCurrency(99)).toBe('¥99.00');
  });

  test('NaN 抛出 TypeError', () => {
    expect(() => formatCurrency(NaN)).toThrow(TypeError);
  });
});

describe('isPrime', () => {
  test('2 是质数', () => {
    expect(isPrime(2)).toBe(true);
  });

  test('4 不是质数', () => {
    expect(isPrime(4)).toBe(false);
  });

  test('1 不是质数', () => {
    expect(isPrime(1)).toBe(false);
  });

  test('大质数 97', () => {
    expect(isPrime(97)).toBe(true);
  });
});

describe('factorial', () => {
  test('5 的阶乘', () => {
    expect(factorial(5)).toBe(120);
  });

  test('0 的阶乘为 1', () => {
    expect(factorial(0)).toBe(1);
  });

  test('负数抛出错误', () => {
    expect(() => factorial(-1)).toThrow();
  });
});
