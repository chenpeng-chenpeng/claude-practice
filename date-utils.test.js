'use strict';

const { formatDate, daysBetween, isWeekend, addDays, isLeapYear } = require('./date-utils');

describe('formatDate', () => {
  test('格式化日期为 yyyy-MM-dd', () => {
    expect(formatDate(new Date('2026-07-09'))).toBe('2026-07-09');
  });

  test('月份和日期补零', () => {
    expect(formatDate(new Date('2026-01-05'))).toBe('2026-01-05');
  });

  test('无效日期抛出 TypeError', () => {
    expect(() => formatDate(new Date('invalid'))).toThrow(TypeError);
  });

  test('非 Date 输入抛出 TypeError', () => {
    expect(() => formatDate('2026-01-01')).toThrow(TypeError);
  });
});

describe('daysBetween', () => {
  test('计算天数差', () => {
    const a = new Date('2026-01-01');
    const b = new Date('2026-01-10');
    expect(daysBetween(a, b)).toBe(9);
  });

  test('顺序无关（返回绝对值）', () => {
    const a = new Date('2026-01-01');
    const b = new Date('2026-01-10');
    expect(daysBetween(b, a)).toBe(9);
  });

  test('同一天返回 0', () => {
    const d = new Date('2026-07-09');
    expect(daysBetween(d, d)).toBe(0);
  });
});

describe('isWeekend', () => {
  test('周六为周末', () => {
    expect(isWeekend(new Date('2026-07-11'))).toBe(true); // Saturday
  });

  test('周日为周末', () => {
    expect(isWeekend(new Date('2026-07-12'))).toBe(true); // Sunday
  });

  test('周一不是周末', () => {
    expect(isWeekend(new Date('2026-07-13'))).toBe(false);
  });
});

describe('addDays', () => {
  test('增加天数返回新 Date', () => {
    const date = new Date('2026-07-09');
    const result = addDays(date, 5);
    expect(formatDate(result)).toBe('2026-07-14');
  });

  test('不修改原日期', () => {
    const date = new Date('2026-07-09');
    const original = formatDate(date);
    addDays(date, 10);
    expect(formatDate(date)).toBe(original);
  });

  test('支持负天数', () => {
    const date = new Date('2026-07-09');
    expect(formatDate(addDays(date, -2))).toBe('2026-07-07');
  });
});

describe('isLeapYear', () => {
  test('2024 是闰年', () => {
    expect(isLeapYear(2024)).toBe(true);
  });

  test('2025 不是闰年', () => {
    expect(isLeapYear(2025)).toBe(false);
  });

  test('世纪年 1900 不是闰年', () => {
    expect(isLeapYear(1900)).toBe(false);
  });

  test('世纪年 2000 是闰年', () => {
    expect(isLeapYear(2000)).toBe(true);
  });
});
