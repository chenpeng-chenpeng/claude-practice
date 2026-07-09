/**
 * TODO 列表管理模块
 *
 * 采用不可变数据模式：所有变更操作返回新数组，只读操作返回副本，
 * 外部无法获取内部可变引用。含完整的输入验证与错误处理。
 *
 * @module todo
 */

'use strict';

// ---- 内部状态 ----

/** @type {Array<{ id: string, title: string, priority: string, dueDate: Date|null, completed: boolean, createdAt: Date, completedAt: Date|null }>} */
let store = Object.freeze([]);

// ---- 常量 ----

const CONSTANTS = Object.freeze({
  MAX_TITLE_LENGTH: 200,
  /** 优先级及排序权重 */
  PRIORITIES: Object.freeze(['high', 'medium', 'low']),
  PRIORITY_ORDER: Object.freeze({ high: 0, medium: 1, low: 2 }),
  /** 过滤器 */
  FILTERS: Object.freeze(['all', 'active', 'completed']),
});

// ---- 私有工具函数 ----

/**
 * 生成唯一 id
 */
function generateId() {
  return 'todo_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

/**
 * 标准化字符串：去首尾空格
 */
function normalize(str) {
  return str.trim();
}

/**
 * 标准化优先级：小写 + 去空格
 */
function normalizePriority(priority) {
  return priority.toLowerCase().trim();
}

// ---- 公开 API ----

/**
 * 添加新待办事项
 * @param {string} title - 标题（1-200 字符）
 * @param {string} [priority='medium'] - 优先级：'high' | 'medium' | 'low'
 * @param {Date|null} [dueDate=null] - 截止日期
 * @returns {{ id, title, priority, dueDate, completed, createdAt, completedAt }}
 * @throws {TypeError|Error}
 */
function addTodo(title, priority = 'medium', dueDate = null) {
  if (typeof title !== 'string') {
    throw new TypeError('参数 title 必须是字符串类型');
  }

  const normalizedTitle = normalize(title);
  if (normalizedTitle.length === 0) {
    throw new Error('标题不能为空');
  }
  if (normalizedTitle.length > CONSTANTS.MAX_TITLE_LENGTH) {
    throw new Error(
      `标题不能超过 ${CONSTANTS.MAX_TITLE_LENGTH} 个字符，当前 ${normalizedTitle.length} 个`
    );
  }

  // 检查 priority 类型 — JavaScript 默认参数只在 undefined 时激活，显式传 null 不会触发默认值
  if (typeof priority !== 'string') {
    throw new TypeError('参数 priority 必须是字符串类型');
  }

  const normalizedPriority = normalizePriority(priority);
  if (!CONSTANTS.PRIORITIES.includes(normalizedPriority)) {
    throw new Error(
      `无效的优先级: "${priority}"，可选值: ${CONSTANTS.PRIORITIES.join(', ')}`
    );
  }

  if (dueDate !== null && dueDate !== undefined && !(dueDate instanceof Date)) {
    throw new TypeError('参数 dueDate 必须是 Date 类型或 null');
  }

  const newTodo = Object.freeze({
    id: generateId(),
    title: normalizedTitle,
    priority: normalizedPriority,
    dueDate: dueDate instanceof Date ? dueDate : null,
    completed: false,
    createdAt: new Date(),
    completedAt: null,
  });

  store = Object.freeze([...store, newTodo]);
  return { ...newTodo };
}

/**
 * 将事项标记为已完成
 * @param {string} id - 事项 id
 * @returns {{ id, title, priority, dueDate, completed, createdAt, completedAt } | null}
 */
function completeTodo(id) {
  if (typeof id !== 'string') {
    return null;
  }

  const index = store.findIndex(item => item.id === id);
  if (index === -1) {
    return null;
  }

  const existing = store[index];
  if (existing.completed) {
    return { ...existing };
  }

  const updated = Object.freeze({
    ...existing,
    completed: true,
    completedAt: new Date(),
  });

  store = Object.freeze([
    ...store.slice(0, index),
    updated,
    ...store.slice(index + 1),
  ]);

  return { ...updated };
}

/**
 * 删除事项
 * @param {string} id - 事项 id
 * @returns {boolean} 是否成功删除
 */
function deleteTodo(id) {
  if (typeof id !== 'string') {
    return false;
  }

  const index = store.findIndex(item => item.id === id);
  if (index === -1) {
    return false;
  }

  store = Object.freeze([
    ...store.slice(0, index),
    ...store.slice(index + 1),
  ]);

  return true;
}

/**
 * 按 id 查找事项
 * @param {string} id
 * @returns {{ id, title, priority, dueDate, completed, createdAt, completedAt } | null}
 */
function getTodo(id) {
  if (typeof id !== 'string') {
    return null;
  }
  const item = store.find(item => item.id === id);
  return item ? { ...item } : null;
}

/**
 * 列出事项（支持过滤）
 * @param {string} [filter='all'] - 'all' | 'active' | 'completed'
 * @returns {Array<{ id, title, priority, dueDate, completed, createdAt, completedAt }>}
 */
function listTodos(filter = 'all') {
  const normalizedFilter = (typeof filter === 'string' ? filter : 'all').toLowerCase().trim();
  let filtered;

  if (normalizedFilter === CONSTANTS.FILTERS[1]) {
    filtered = store.filter(item => !item.completed);
  } else if (normalizedFilter === CONSTANTS.FILTERS[2]) {
    filtered = store.filter(item => item.completed);
  } else {
    filtered = store;
  }

  return filtered.map(item => ({ ...item }));
}

/**
 * 按优先级排序（纯函数，不修改原数组）
 * @param {Array} todos - 事项数组
 * @returns {Array} 排序后的新数组（high → medium → low）
 */
function sortByPriority(todos) {
  if (!Array.isArray(todos)) {
    return [];
  }
  return [...todos].sort(
    (a, b) => CONSTANTS.PRIORITY_ORDER[a.priority] - CONSTANTS.PRIORITY_ORDER[b.priority]
  );
}

/**
 * 清空所有事项（仅用于测试环境）
 */
function clearTodos() {
  store = Object.freeze([]);
}

/**
 * 获取当前事项总数
 * @returns {number}
 */
function getTodoCount() {
  return store.length;
}

module.exports = {
  addTodo,
  completeTodo,
  deleteTodo,
  getTodo,
  listTodos,
  sortByPriority,
  clearTodos,
  getTodoCount,
};
