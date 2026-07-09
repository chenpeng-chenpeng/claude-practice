'use strict';

/**
 * 字符串工具模块
 * @module string-utils
 */

const CONSTANTS = Object.freeze({
  MAX_TRUNCATE_LENGTH: 1000,
});

// ---- 私有工具 ----

function validateString(input, paramName) {
  if (typeof input !== 'string') {
    throw new TypeError(`参数 ${paramName} 必须是字符串类型`);
  }
}

// ---- 公开 API ----

/**
 * 首字母大写
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  validateString(str, 'str');
  if (str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 截断字符串并追加省略号
 * @param {string} str - 原始字符串
 * @param {number} maxLen - 最大长度（含省略号）
 * @returns {string}
 */
function truncate(str, maxLen) {
  validateString(str, 'str');
  if (typeof maxLen !== 'number' || maxLen < 3) {
    throw new Error('maxLen 必须是 >= 3 的数字');
  }
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}

/**
 * 转 URL 友好格式（"Hello World" → "hello-world"）
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  validateString(str, 'str');
  return str
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 反转字符串
 * @param {string} str
 * @returns {string}
 */
function reverse(str) {
  validateString(str, 'str');
  return str.split('').reverse().join('');
}

/**
 * 统计单词数
 * @param {string} str
 * @returns {number}
 */
function countWords(str) {
  validateString(str, 'str');
  const trimmed = str.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

module.exports = { capitalize, truncate, slugify, reverse, countWords };
