'use strict';

const { pick, omit, deepClone, isEmpty, merge } = require('./object-utils');

const sample = { a: 1, b: 2, c: 3 };

describe('pick', () => {
  test('选取指定键', () => {
    expect(pick(sample, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  test('选取不存在的键被忽略', () => {
    expect(pick(sample, ['a', 'z'])).toEqual({ a: 1 });
  });

  test('不修改原对象', () => {
    const copy = { ...sample };
    pick(sample, ['a']);
    expect(sample).toEqual(copy);
  });

  test('非对象输入抛出 TypeError', () => {
    expect(() => pick('abc', ['a'])).toThrow(TypeError);
  });
});

describe('omit', () => {
  test('排除指定键', () => {
    expect(omit(sample, ['b'])).toEqual({ a: 1, c: 3 });
  });

  test('排除不存在的键无影响', () => {
    expect(omit(sample, ['z'])).toEqual(sample);
  });

  test('不修改原对象', () => {
    const copy = { ...sample };
    omit(sample, ['a']);
    expect(sample).toEqual(copy);
  });
});

describe('deepClone', () => {
  test('深拷贝嵌套对象', () => {
    const obj = { a: 1, b: { c: 2 } };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned.b).not.toBe(obj.b);
  });

  test('修改副本不影响原对象', () => {
    const obj = { a: { b: 1 } };
    const cloned = deepClone(obj);
    cloned.a.b = 999;
    expect(obj.a.b).toBe(1);
  });
});

describe('isEmpty', () => {
  test('空对象返回 true', () => {
    expect(isEmpty({})).toBe(true);
  });

  test('有属性的对象返回 false', () => {
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});

describe('merge', () => {
  test('合并多个对象', () => {
    expect(merge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  test('后面的覆盖前面的', () => {
    expect(merge({ a: 1 }, { a: 99 })).toEqual({ a: 99 });
  });

  test('不修改源对象', () => {
    const a = { x: 1 };
    merge(a, { y: 2 });
    expect(a).toEqual({ x: 1 });
  });
});
