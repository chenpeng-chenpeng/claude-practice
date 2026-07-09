'use strict';

/**
 * 日期工具模块
 * @module date-utils
 */

// ---- 私有工具 ----

function validateDate(input, paramName) {
  if (!(input instanceof Date) || isNaN(input.getTime())) {
    throw new TypeError(`参数 ${paramName} 必须是有效的 Date 类型`);
  }
}

// ---- 公开 API ----

/**
 * 格式化日期为 ISO 风格字符串（yyyy-MM-dd）
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  validateDate(date, 'date');
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 计算两个日期之间的天数差
 * @param {Date} dateA
 * @param {Date} dateB
 * @returns {number} 绝对值天数差
 */
function daysBetween(dateA, dateB) {
  validateDate(dateA, 'dateA');
  validateDate(dateB, 'dateB');
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.abs(Math.round((dateB.getTime() - dateA.getTime()) / msPerDay));
}

/**
 * 判断是否为周末（周六或周日）
 * @param {Date} date
 * @returns {boolean}
 */
function isWeekend(date) {
  validateDate(date, 'date');
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * 给日期增加指定天数（不可变，返回新 Date）
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
function addDays(date, days) {
  validateDate(date, 'date');
  if (typeof days !== 'number') {
    throw new TypeError('参数 days 必须是数字类型');
  }
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 判断是否为闰年
 * @param {number} year
 * @returns {boolean}
 */
function isLeapYear(year) {
  if (typeof year !== 'number' || !Number.isInteger(year)) {
    throw new TypeError('参数 year 必须是整数类型');
  }
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

module.exports = { formatDate, daysBetween, isWeekend, addDays, isLeapYear };
