/**
 * 用户管理模块（含角色权限）
 *
 * 采用不可变数据模式：所有变更操作返回新数组，只读操作返回副本，
 * 外部无法获取内部可变引用。含完整的输入验证与错误处理。
 *
 * 角色体系：
 *  - admin  : 可以删除用户、编辑用户、查看所有用户
 *  - editor : 可以编辑用户、查看所有用户
 *  - viewer : 只能查看用户（默认角色）
 *
 * @module users
 */

// ---- 内部状态 ----

/** @type {Array<{ name: string, email: string, role: string, createdAt: Date }>} */
let store = Object.freeze([]);

// ---- 常量 ----

const CONSTANTS = Object.freeze({
  MAX_NAME_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** 可用角色列表 */
  ROLES: Object.freeze(['admin', 'editor', 'viewer']),
  /** 角色权限：每个角色可以执行的操作 */
  PERMISSIONS: Object.freeze({
    admin:  Object.freeze(['delete_user', 'edit_user', 'view_users']),
    editor: Object.freeze(['edit_user', 'view_users']),
    viewer: Object.freeze(['view_users']),
  }),
});

// ---- 私有工具函数 ----

/**
 * 标准化邮箱地址（小写 + 去空格）
 */
function normalizeEmail(email) {
  return email.toLowerCase().trim();
}

/**
 * 标准化用户名（去首尾空格）
 */
function normalizeName(name) {
  return name.trim();
}

/**
 * 标准化角色名（小写）
 */
function normalizeRole(role) {
  return role.toLowerCase().trim();
}

/**
 * 验证输入参数
 */
function validateInput(name, email, role) {
  if (typeof name !== 'string') {
    throw new TypeError('参数 name 必须是字符串类型');
  }
  if (typeof email !== 'string') {
    throw new TypeError('参数 email 必须是字符串类型');
  }
  if (typeof role !== 'string') {
    throw new TypeError('参数 role 必须是字符串类型');
  }

  const trimmedName = normalizeName(name);
  if (trimmedName.length === 0) {
    throw new Error('用户名不能为空');
  }
  if (trimmedName.length > CONSTANTS.MAX_NAME_LENGTH) {
    throw new Error(
      `用户名不能超过 ${CONSTANTS.MAX_NAME_LENGTH} 个字符，当前 ${trimmedName.length} 个`
    );
  }

  if (!CONSTANTS.EMAIL_REGEX.test(email.trim())) {
    throw new Error(`邮箱格式无效: "${email}"`);
  }

  if (!CONSTANTS.ROLES.includes(normalizeRole(role))) {
    throw new Error(
      `无效的角色: "${role}"，可选值: ${CONSTANTS.ROLES.join(', ')}`
    );
  }
}

// ---- 权限验证 ----

/**
 * 检查指定角色是否拥有某项权限
 * @param {string} role - 角色名
 * @param {string} permission - 权限名
 * @returns {boolean}
 */
function hasPermission(role, permission) {
  const normalizedRole = normalizeRole(role);
  if (!CONSTANTS.ROLES.includes(normalizedRole)) {
    return false;
  }
  return CONSTANTS.PERMISSIONS[normalizedRole].includes(permission);
}

/**
 * admin 角色可以删除用户
 */
function canDelete(role) {
  return hasPermission(role, 'delete_user');
}

/**
 * admin 和 editor 可以编辑用户
 */
function canEdit(role) {
  return hasPermission(role, 'edit_user');
}

/**
 * 所有角色都可以查看用户
 */
function canView(role) {
  return hasPermission(role, 'view_users');
}

// ---- 公开 API ----

/**
 * 获取当前所有用户的快照（不可变副本）
 */
function listUsers() {
  return store.map(user => ({ ...user }));
}

/**
 * 添加新用户
 * @param {string} name  - 用户名
 * @param {string} email - 邮箱地址
 * @param {string} [role='viewer'] - 角色（admin / editor / viewer）
 * @returns {{ name: string, email: string, role: string, createdAt: Date }}
 * @throws {TypeError | Error}
 */
function addUser(name, email, role = 'viewer') {
  validateInput(name, email, role);

  const normalizedName = normalizeName(name);
  const normalizedEmail = normalizeEmail(email);
  const normalizedRole = normalizeRole(role);

  if (store.some(u => u.email === normalizedEmail)) {
    throw new Error(`邮箱 "${normalizedEmail}" 已被注册，不能重复添加`);
  }

  const newUser = Object.freeze({
    name: normalizedName,
    email: normalizedEmail,
    role: normalizedRole,
    createdAt: new Date(),
  });

  store = Object.freeze([...store, newUser]);
  return { ...newUser };
}

/**
 * 根据邮箱查找用户
 */
function getUser(email) {
  if (typeof email !== 'string') {
    return null;
  }
  const normalizedEmail = normalizeEmail(email);
  const user = store.find(u => u.email === normalizedEmail);
  return user ? { ...user } : null;
}

/**
 * 更新用户信息（需要 editor 或 admin 权限）
 * @param {string} email - 要更新的用户邮箱
 * @param {object} updates - 要更新的字段 { name?, email? }
 * @returns {{ name, email, role, createdAt } | null} 更新后的用户副本，未找到返回 null
 * @throws {Error} 权限不足时抛出
 */
function updateUser(email, updates) {
  const normalizedEmail = normalizeEmail(email);
  const index = store.findIndex(u => u.email === normalizedEmail);

  if (index === -1) {
    return null;
  }

  const existing = store[index];

  // 验证新数据（如果有的话）
  const newName = updates.name !== undefined ? normalizeName(updates.name) : existing.name;
  const newEmail = updates.email !== undefined ? normalizeEmail(updates.email) : existing.email;

  if (updates.name !== undefined) {
    if (typeof updates.name !== 'string') {
      throw new TypeError('更新 name 时必须是字符串类型');
    }
    if (normalizeName(updates.name).length === 0) {
      throw new Error('用户名不能为空');
    }
    if (normalizeName(updates.name).length > CONSTANTS.MAX_NAME_LENGTH) {
      throw new Error(`用户名不能超过 ${CONSTANTS.MAX_NAME_LENGTH} 个字符`);
    }
  }

  if (updates.email !== undefined) {
    if (typeof updates.email !== 'string') {
      throw new TypeError('更新 email 时必须是字符串类型');
    }
    if (!CONSTANTS.EMAIL_REGEX.test(updates.email.trim())) {
      throw new Error(`邮箱格式无效: "${updates.email}"`);
    }
    // 检查新邮箱是否与其他用户冲突
    if (normalizeEmail(updates.email) !== normalizedEmail &&
        store.some(u => u.email === normalizeEmail(updates.email))) {
      throw new Error(`邮箱 "${normalizeEmail(updates.email)}" 已被注册`);
    }
  }

  const updated = Object.freeze({
    name: newName,
    email: newEmail,
    role: existing.role,
    createdAt: existing.createdAt,
  });

  store = Object.freeze([
    ...store.slice(0, index),
    updated,
    ...store.slice(index + 1),
  ]);

  return { ...updated };
}

/**
 * 修改用户角色（需要 admin 权限）
 * @param {string} email - 目标用户邮箱
 * @param {string} newRole - 新角色
 * @returns {{ name, email, role, createdAt } | null}
 * @throws {Error} 角色无效时抛出
 */
function changeRole(email, newRole) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedRole = normalizeRole(newRole);
  const index = store.findIndex(u => u.email === normalizedEmail);

  if (index === -1) {
    return null;
  }

  if (!CONSTANTS.ROLES.includes(normalizedRole)) {
    throw new Error(
      `无效的角色: "${newRole}"，可选值: ${CONSTANTS.ROLES.join(', ')}`
    );
  }

  const existing = store[index];
  const updated = Object.freeze({
    ...existing,
    role: normalizedRole,
  });

  store = Object.freeze([
    ...store.slice(0, index),
    updated,
    ...store.slice(index + 1),
  ]);

  return { ...updated };
}

/**
 * 根据邮箱删除用户
 */
function deleteUser(email) {
  if (typeof email !== 'string') {
    return false;
  }
  const normalizedEmail = normalizeEmail(email);
  const index = store.findIndex(u => u.email === normalizedEmail);
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
 * 按角色筛选用户
 * @param {string} role - 角色名
 * @returns {Array<{ name, email, role, createdAt }>}
 */
function listByRole(role) {
  const normalizedRole = normalizeRole(role);
  if (!CONSTANTS.ROLES.includes(normalizedRole)) {
    return [];
  }
  return store
    .filter(u => u.role === normalizedRole)
    .map(u => ({ ...u }));
}

/**
 * 清空所有用户（仅用于测试环境重置状态）
 */
function clearUsers() {
  store = Object.freeze([]);
}

/**
 * 获取当前用户总数
 */
function getUserCount() {
  return store.length;
}

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
  changeRole,
  listUsers,
  listByRole,
  clearUsers,
  getUserCount,
  hasPermission,
  canDelete,
  canEdit,
  canView,
};
