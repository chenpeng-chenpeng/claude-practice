/**
 * users.js 单元测试
 *
 * 覆盖：
 *  - 正常流程（增 / 查 / 删 / 改 / 角色）
 *  - 输入验证（空值、类型错误、边界值）
 *  - 角色权限体系
 *  - 不可变性验证
 *  - 边界/异常路径
 */

const {
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
} = require('./users');

// 每个测试用例前重置状态
beforeEach(() => {
  clearUsers();
});

// ============================================================
// addUser（含角色）
// ============================================================

describe('addUser', () => {
  test('成功添加用户并返回用户副本', () => {
    const user = addUser('张三', 'zhangsan@example.com');

    expect(user).toEqual({
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'viewer',
      createdAt: expect.any(Date),
    });
    expect(getUserCount()).toBe(1);
  });

  test('可以指定角色', () => {
    const admin = addUser('管理员', 'admin@test.com', 'admin');
    const editor = addUser('编辑', 'editor@test.com', 'editor');
    const viewer = addUser('访客', 'viewer@test.com', 'viewer');

    expect(admin.role).toBe('admin');
    expect(editor.role).toBe('editor');
    expect(viewer.role).toBe('viewer');
  });

  test('默认角色为 viewer', () => {
    const user = addUser('默认用户', 'default@test.com');
    expect(user.role).toBe('viewer');
  });

  test('无效角色抛出错误', () => {
    expect(() => addUser('张三', 'a@b.com', 'superadmin')).toThrow('无效的角色');
    expect(() => addUser('张三', 'a@b.com', '')).toThrow('无效的角色');
  });

  test('角色名大小写不敏感', () => {
    const user = addUser('Admin', 'a@b.com', 'ADMIN');
    expect(user.role).toBe('admin');
  });

  // ---- 原有验证 ----

  test('邮箱自动转为小写', () => {
    const user = addUser('Alice', 'Alice@Example.COM');
    expect(user.email).toBe('alice@example.com');
  });

  test('用户名自动去除首尾空格', () => {
    const user = addUser('  李四  ', 'lisi@test.com');
    expect(user.name).toBe('李四');
  });

  test('用户名为空字符串时抛出', () => {
    expect(() => addUser('   ', 'test@test.com')).toThrow('用户名不能为空');
  });

  test('用户名超过 100 字符时抛出', () => {
    const longName = 'x'.repeat(101);
    expect(() => addUser(longName, 'test@test.com')).toThrow('用户名不能超过 100 个字符');
  });

  test('邮箱格式无效时抛出', () => {
    expect(() => addUser('张三', 'not-an-email')).toThrow('邮箱格式无效');
  });

  test('参数类型不是字符串时抛出 TypeError', () => {
    expect(() => addUser(null, 'a@b.com')).toThrow(TypeError);
  });

  test('重复邮箱抛出错误', () => {
    addUser('张三', 'dup@test.com');
    expect(() => addUser('李四', 'dup@test.com')).toThrow('已被注册');
  });
});

// ============================================================
// 角色权限
// ============================================================

describe('角色权限', () => {
  test('admin 拥有所有权限', () => {
    expect(hasPermission('admin', 'delete_user')).toBe(true);
    expect(hasPermission('admin', 'edit_user')).toBe(true);
    expect(hasPermission('admin', 'view_users')).toBe(true);
    expect(canDelete('admin')).toBe(true);
    expect(canEdit('admin')).toBe(true);
    expect(canView('admin')).toBe(true);
  });

  test('editor 可以编辑和查看，但不能删除', () => {
    expect(canDelete('editor')).toBe(false);
    expect(canEdit('editor')).toBe(true);
    expect(canView('editor')).toBe(true);
  });

  test('viewer 只能查看', () => {
    expect(canDelete('viewer')).toBe(false);
    expect(canEdit('viewer')).toBe(false);
    expect(canView('viewer')).toBe(true);
  });

  test('无效角色返回无权限', () => {
    expect(hasPermission('hacker', 'delete_user')).toBe(false);
    expect(hasPermission('', 'view_users')).toBe(false);
  });
});

// ============================================================
// updateUser
// ============================================================

describe('updateUser', () => {
  test('updateUser名', () => {
    addUser('旧名', 'old@test.com');
    const updated =updateUser('old@test.com', { name: '新名' });

    expect(updated.name).toBe('新名');
    expect(getUser('old@test.com').name).toBe('新名');
  });

  test('更新邮箱', () => {
    addUser('张三', 'old@test.com');
    const updated =updateUser('old@test.com', { email: 'new@test.com' });

    expect(updated.email).toBe('new@test.com');
    expect(getUser('old@test.com')).toBeNull();
    expect(getUser('new@test.com')).not.toBeNull();
  });

  test('更新不存在的用户返回 null', () => {
    expect(updateUser('nobody@test.com', { name: 'x' })).toBeNull();
  });

  test('更新时新邮箱与已有用户冲突', () => {
    addUser('A', 'a@test.com');
    addUser('B', 'b@test.com');
    expect(() => updateUser('a@test.com', { email: 'b@test.com' })).toThrow('已被注册');
  });

  test('更新时保留角色不变', () => {
    addUser('编辑', 'e@test.com', 'editor');
    const updated = updateUser('e@test.com', { name: '新编辑' });
    expect(updated.role).toBe('editor');
  });
});

// ============================================================
// changeRole
// ============================================================

describe('changeRole', () => {
  test('修改角色成功', () => {
    addUser('张三', 'z@test.com', 'viewer');
    const updated = changeRole('z@test.com', 'admin');

    expect(updated.role).toBe('admin');
    expect(getUser('z@test.com').role).toBe('admin');
  });

  test('不存在的用户返回 null', () => {
    expect(changeRole('ghost@test.com', 'admin')).toBeNull();
  });

  test('无效角色抛出错误', () => {
    addUser('张三', 'z@test.com');
    expect(() => changeRole('z@test.com', 'superuser')).toThrow('无效的角色');
  });
});

// ============================================================
// listByRole
// ============================================================

describe('listByRole', () => {
  test('按角色筛选用户', () => {
    addUser('管理员A', 'a1@test.com', 'admin');
    addUser('管理员B', 'a2@test.com', 'admin');
    addUser('编辑', 'e@test.com', 'editor');
    addUser('访客', 'v@test.com', 'viewer');

    expect(listByRole('admin')).toHaveLength(2);
    expect(listByRole('editor')).toHaveLength(1);
    expect(listByRole('viewer')).toHaveLength(1);
  });

  test('无效角色返回空数组', () => {
    addUser('张三', 'z@test.com');
    expect(listByRole('invalid')).toEqual([]);
  });

  test('角色名大小写不敏感', () => {
    addUser('A', 'a@test.com', 'ADMIN');
    expect(listByRole('admin')).toHaveLength(1);
  });
});

// ============================================================
// getUser / deleteUser / 辅助函数（原测试保留）
// ============================================================

describe('getUser', () => {
  test('找到用户返回包含角色的副本', () => {
    addUser('王五', 'wangwu@example.com', 'editor');
    const found = getUser('wangwu@example.com');
    expect(found).toEqual({
      name: '王五',
      email: 'wangwu@example.com',
      role: 'editor',
      createdAt: expect.any(Date),
    });
  });

  test('不存在的邮箱返回 null', () => {
    expect(getUser('nobody@test.com')).toBeNull();
  });
});

describe('deleteUser', () => {
  test('删除存在的用户返回 true', () => {
    addUser('孙七', 'sunqi@test.com');
    expect(deleteUser('sunqi@test.com')).toBe(true);
    expect(getUserCount()).toBe(0);
  });

  test('删除不存在的用户返回 false', () => {
    expect(deleteUser('ghost@test.com')).toBe(false);
  });
});

describe('辅助函数', () => {
  test('listUsers 返回包含角色的所有用户', () => {
    addUser('A', 'a@a.com', 'admin');
    const all = listUsers();
    expect(all).toHaveLength(1);
    expect(all[0]).toHaveProperty('role', 'admin');
  });

  test('getUserCount 返回正确数量', () => {
    expect(getUserCount()).toBe(0);
    addUser('A', 'a@a.com');
    expect(getUserCount()).toBe(1);
  });

  test('clearUsers 清空所有用户', () => {
    addUser('A', 'a@a.com');
    clearUsers();
    expect(getUserCount()).toBe(0);
  });
});

// ============================================================
// 不可变性
// ============================================================

describe('不可变性', () => {
  test('addUser 返回的副本修改不影响内部存储', () => {
    const user = addUser('张三', 'zhangsan@test.com', 'admin');
    user.role = 'viewer';
    expect(getUser('zhangsan@test.com').role).toBe('admin');
  });

  test('listUsers 返回的副本修改不影响内部存储', () => {
    addUser('A', 'a@a.com');
    const snapshot = listUsers();
    snapshot[0].role = 'hacked';
    expect(listUsers()[0].role).toBe('viewer');
  });
});

// ============================================================
// 集成流程：角色完整场景
// ============================================================

describe('集成流程：角色管理', () => {
  test('完整的角色分配场景', () => {
    // 1. 创建管理员
    const admin = addUser('管理员', 'admin@test.com', 'admin');
    expect(canDelete(admin.role)).toBe(true);

    // 2. 创建编辑
    const editor = addUser('编辑员', 'editor@test.com', 'editor');
    expect(canEdit(editor.role)).toBe(true);
    expect(canDelete(editor.role)).toBe(false);

    // 3. 创建访客
    const viewer = addUser('访客', 'viewer@test.com');
    expect(viewer.role).toBe('viewer');

    // 4. 按角色筛选
    expect(listByRole('admin')).toHaveLength(1);
    expect(listByRole('editor')).toHaveLength(1);
    expect(listByRole('viewer')).toHaveLength(1);

    // 5. 提升角色
    changeRole('viewer@test.com', 'editor');
    expect(getUser('viewer@test.com').role).toBe('editor');
    expect(listByRole('viewer')).toHaveLength(0);
    expect(listByRole('editor')).toHaveLength(2);

    // 6. updateUser信息
    updateUser('admin@test.com', { name: '超级管理员' });
    expect(getUser('admin@test.com').name).toBe('超级管理员');
  });
});
