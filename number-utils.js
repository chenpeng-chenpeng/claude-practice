'use strict';

/**
 * 数字工具模块
 * @module number-utils
 */

// ---- 公开 API ----

/**
 * 将数字限制在指定范围内
 * @param {number} value
 * @param {number} min - 下限
 * @param {number} max - 上限
 * @returns {number}
 */
function clamp(value, min, max) {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    throw new TypeError('所有参数必须是数字类型');
  }
  if (min > max) {
    throw new Error('min 不能大于 max');
  }
  return Math.min(Math.max(value, min), max);
}

/**
 * 生成 [min, max) 范围内的随机整数
 * @param {number} min - 下限（含）
 * @param {number} max - 上限（不含）
 * @returns {number}
 */
function randomInt(min, max) {
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new TypeError('min 和 max 必须是数字类型');
  }
  if (min >= max) {
    throw new Error('min 必须小于 max');
  }
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 格式化为人民币金额字符串
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new TypeError('参数 amount 必须是有效数字');
  }
  return '¥' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 判断是否为质数
 * @param {number} n
 * @returns {boolean}
 */
function isPrime(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('参数 n 必须是整数类型');
  }
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * 计算阶乘
 * @param {number} n - 非负整数
 * @returns {number}
 */
function factorial(n) {
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new TypeError('参数 n 必须是整数类型');
  }
  if (n < 0) {
    throw new Error('n 不能为负数');
  }
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

module.exports = { clamp, randomInt, formatCurrency, isPrime, factorial };
