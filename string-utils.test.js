'use strict';

const { capitalize, truncate, slugify, reverse, countWords } = require('./string-utils');

describe('capitalize', () => {
  test('首字母大写', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  test('已经是首字母大写', () => {
    expect(capitalize('World')).toBe('World');
  });

  test('空字符串返回空', () => {
    expect(capitalize('')).toBe('');
  });

  test('非字符串输入抛出 TypeError', () => {
    expect(() => capitalize(123)).toThrow(TypeError);
  });
});

describe('truncate', () => {
  test('超长字符串被截断并加省略号', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...');
  });

  test('短字符串不变', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  test('maxLen 小于 3 抛出错误', () => {
    expect(() => truncate('abc', 2)).toThrow();
  });

  test('非字符串输入抛出 TypeError', () => {
    expect(() => truncate(null, 5)).toThrow(TypeError);
  });
});

describe('slugify', () => {
  test('英文转 slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  test('去除特殊字符', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  test('多个空格和连字符合并', () => {
    expect(slugify('foo  --  bar')).toBe('foo-bar');
  });

  test('首尾连字符去除', () => {
    expect(slugify(' -hello- ')).toBe('hello');
  });
});

describe('reverse', () => {
  test('反转字符串', () => {
    expect(reverse('abc')).toBe('cba');
  });

  test('回文字符串反转不变', () => {
    expect(reverse('aba')).toBe('aba');
  });

  test('非字符串输入抛出 TypeError', () => {
    expect(() => reverse(undefined)).toThrow(TypeError);
  });
});

describe('countWords', () => {
  test('统计单词数', () => {
    expect(countWords('hello world')).toBe(2);
  });

  test('空字符串返回 0', () => {
    expect(countWords('   ')).toBe(0);
  });

  test('多余空格不影响计数', () => {
    expect(countWords('  a   b  c  ')).toBe(3);
  });
});
