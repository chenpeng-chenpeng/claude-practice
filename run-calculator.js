'use strict';

const { add, subtract, multiply, divide, calculate } = require('./calculator');

const a = parseFloat(process.argv[2]);
const op = process.argv[3];
const b = parseFloat(process.argv[4]);

if (process.argv.length < 5 || isNaN(a) || isNaN(b) || !op) {
  console.log('用法: node run-calculator.js <数字> <操作符> <数字>');
  console.log('操作符: add, subtract, multiply, divide');
  console.log('示例: node run-calculator.js 10 add 5');
  process.exit(1);
}

try {
  const result = calculate(op, a, b);
  console.log(`${a} ${op} ${b} = ${result}`);
} catch (err) {
  console.error('错误:', err.message);
  process.exit(1);
}
