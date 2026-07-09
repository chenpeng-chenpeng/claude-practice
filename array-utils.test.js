'use strict';

const { chunk, unique, shuffle, flatten, range } = require('./array-utils');

describe('chunk', () => {
  test('按大小分块', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('块大小等于数组长度', () => {
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
  });

  test('空数组返回空数组', () => {
    expect(chunk([], 2)).toEqual([]);
  });

  test('size < 1 抛出错误', () => {
    expect(() => chunk([1, 2], 0)).toThrow();
  });

  test('非数组输入抛出 TypeError', () => {
    expect(() => chunk('abc', 2)).toThrow(TypeError);
  });
});

describe('unique', () => {
  test('移除重复值', () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  test('无重复时不变', () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('不修改原数组', () => {
    const arr = [1, 1, 2];
    const copy = [...arr];
    unique(arr);
    expect(arr).toEqual(copy);
  });

  test('非数组输入抛出 TypeError', () => {
    expect(() => unique(null)).toThrow(TypeError);
  });
});

describe('shuffle', () => {
  test('返回相同长度的数组', () => {
    const result = shuffle([1, 2, 3, 4, 5]);
    expect(result).toHaveLength(5);
  });

  test('包含所有原始元素', () => {
    const result = shuffle([1, 2, 3]);
    expect(result.sort()).toEqual([1, 2, 3]);
  });

  test('不修改原数组', () => {
    const arr = [1, 2, 3];
    const copy = [...arr];
    shuffle(arr);
    expect(arr).toEqual(copy);
  });

  test('非数组输入抛出 TypeError', () => {
    expect(() => shuffle(123)).toThrow(TypeError);
  });
});

describe('flatten', () => {
  test('扁平化一层嵌套', () => {
    expect(flatten([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5]);
  });

  test('已是扁平数组不变', () => {
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
  });
});

describe('range', () => {
  test('生成范围数组', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  test('自定义步长', () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
  });

  test('负步长', () => {
    expect(range(5, 1, -1)).toEqual([5, 4, 3, 2, 1]);
  });

  test('step 为 0 抛出错误', () => {
    expect(() => range(0, 5, 0)).toThrow();
  });
});
