'use strict';

/**
 * 对象工具模块
 * @module object-utils
 */

// ---- 私有工具 ----

function validateObject(input, paramName) {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new TypeError(`参数 ${paramName} 必须是普通对象类型`);
  }
}

// ---- 公开 API ----

/**
 * 从对象中选取指定键（不可变，返回新对象）
 * @param {Object} obj
 * @param {string[]} keys
 * @returns {Object}
 */
function pick(obj, keys) {
  validateObject(obj, 'obj');
  if (!Array.isArray(keys)) {
    throw new TypeError('参数 keys 必须是数组类型');
  }
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

/**
 * 从对象中排除指定键（不可变，返回新对象）
 * @param {Object} obj
 * @param {string[]} keys
 * @returns {Object}
 */
function omit(obj, keys) {
  validateObject(obj, 'obj');
  if (!Array.isArray(keys)) {
    throw new TypeError('参数 keys 必须是数组类型');
  }
  const keySet = new Set(keys);
  return Object.keys(obj).reduce((result, key) => {
    if (!keySet.has(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

/**
 * 深拷贝对象（JSON 安全类型）
 * @param {Object} obj
 * @returns {Object}
 */
function deepClone(obj) {
  validateObject(obj, 'obj');
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 判断对象是否为空（无自有属性）
 * @param {Object} obj
 * @returns {boolean}
 */
function isEmpty(obj) {
  validateObject(obj, 'obj');
  return Object.keys(obj).length === 0;
}

/**
 * 浅合并多个对象（不可变，后面的覆盖前面的）
 * @param {...Object} sources
 * @returns {Object}
 */
function merge(...sources) {
  return Object.assign({}, ...sources);
}

module.exports = { pick, omit, deepClone, isEmpty, merge };
