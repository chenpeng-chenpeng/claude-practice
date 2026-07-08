'use strict';

/**
 * 共享的输入校验 — 确保两个参数都是有效的数字
 * @param {*} a - 第一个操作数
 * @param {*} b - 第二个操作数
 * @throws {TypeError} 如果任一参数不能转为有效数字
 */
function validateNumbers(a, b) {
  const numA = Number(a);
  const numB = Number(b);

  if (isNaN(numA) || a === null || a === undefined || a === '') {
    throw new TypeError(`参数 a 不是有效数字: ${JSON.stringify(a)}`);
  }
  if (isNaN(numB) || b === null || b === undefined || b === '') {
    throw new TypeError(`参数 b 不是有效数字: ${JSON.stringify(b)}`);
  }

  return [numA, numB];
}

/**
 * 加法
 * @param {number} a
 * @param {number} b
 * @returns {number} a + b
 */
function add(a, b) {
  const [numA, numB] = validateNumbers(a, b);
  return numA + numB;
}

/**
 * 减法
 * @param {number} a
 * @param {number} b
 * @returns {number} a - b
 */
function subtract(a, b) {
  const [numA, numB] = validateNumbers(a, b);
  return numA - numB;
}

/**
 * 乘法
 * @param {number} a
 * @param {number} b
 * @returns {number} a * b
 */
function multiply(a, b) {
  const [numA, numB] = validateNumbers(a, b);
  return numA * numB;
}

/**
 * 除法
 * @param {number} a - 被除数
 * @param {number} b - 除数
 * @throws {Error} 当除数为 0 时抛出
 * @returns {number} a / b
 */
function divide(a, b) {
  const [numA, numB] = validateNumbers(a, b);
  if (numB === 0) {
    throw new Error('除数不能为 0');
  }
  return numA / numB;
}

// 操作映射表 — 消除深层 if/else 嵌套
const OPERATIONS = {
  add,
  subtract,
  multiply,
  divide,
};

/**
 * 根据操作名称执行计算（委托给具体的运算函数）
 * @param {string} operation - 操作名称: 'add' | 'subtract' | 'multiply' | 'divide'
 * @param {number} a
 * @param {number} b
 * @throws {Error} 如果操作名称不支持
 * @returns {number} 计算结果
 */
function calculate(operation, a, b) {
  const fn = OPERATIONS[operation];
  if (!fn) {
    throw new Error(`不支持的操作: "${operation}"，支持的操作: ${Object.keys(OPERATIONS).join(', ')}`);
  }
  return fn(a, b);
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  calculate,
};
