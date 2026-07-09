'use strict';

/**
 * 数组工具模块
 * @module array-utils
 */

// ---- 私有工具 ----

function validateArray(input, paramName) {
  if (!Array.isArray(input)) {
    throw new TypeError(`参数 ${paramName} 必须是数组类型`);
  }
}

// ---- 公开 API ----

/**
 * 将数组按指定大小分块
 * @param {Array} arr
 * @param {number} size - 每块大小
 * @returns {Array<Array>}
 */
function chunk(arr, size) {
  validateArray(arr, 'arr');
  if (typeof size !== 'number' || size < 1) {
    throw new Error('size 必须是 >= 1 的数字');
  }
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * 数组去重（不可变，返回新数组）
 * @param {Array} arr
 * @returns {Array}
 */
function unique(arr) {
  validateArray(arr, 'arr');
  return [...new Set(arr)];
}

/**
 * 随机打乱数组（Fisher-Yates，不修改原数组）
 * @param {Array} arr
 * @returns {Array}
 */
function shuffle(arr) {
  validateArray(arr, 'arr');
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 扁平化嵌套数组（一层）
 * @param {Array} arr
 * @returns {Array}
 */
function flatten(arr) {
  validateArray(arr, 'arr');
  return arr.reduce((flat, item) => flat.concat(item), []);
}

/**
 * 生成数字范围数组
 * @param {number} start - 起始值（含）
 * @param {number} end - 结束值（含）
 * @param {number} [step=1] - 步长
 * @returns {Array<number>}
 */
function range(start, end, step = 1) {
  if (typeof start !== 'number' || typeof end !== 'number') {
    throw new TypeError('start 和 end 必须是数字类型');
  }
  if (step === 0) {
    throw new Error('step 不能为 0');
  }
  const result = [];
  const direction = step > 0 ? 1 : -1;
  for (let i = start; direction > 0 ? i <= end : i >= end; i += step) {
    result.push(i);
  }
  return result;
}

module.exports = { chunk, unique, shuffle, flatten, range };
