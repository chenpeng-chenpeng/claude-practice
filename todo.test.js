'use strict';

const {
  addTodo,
  completeTodo,
  deleteTodo,
  getTodo,
  listTodos,
  sortByPriority,
  clearTodos,
  getTodoCount,
} = require('./todo');

// 每个测试前清空状态
beforeEach(() => {
  clearTodos();
});

// ---------------------------------------------------------------------------
// addTodo
// ---------------------------------------------------------------------------
describe('addTodo', () => {
  test('添加一个待办事项，返回包含所有字段的副本', () => {
    const todo = addTodo('买菜');

    expect(todo).toHaveProperty('id');
    expect(todo.title).toBe('买菜');
    expect(todo.priority).toBe('medium');
    expect(todo.completed).toBe(false);
    expect(todo.dueDate).toBeNull();
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.completedAt).toBeNull();
  });

  test('可以指定优先级', () => {
    const todo = addTodo('紧急任务', 'high');

    expect(todo.priority).toBe('high');
  });

  test('优先级大小写不敏感', () => {
    const todo = addTodo('测试', 'LOW');

    expect(todo.priority).toBe('low');
  });

  test('可以指定截止日期', () => {
    const due = new Date('2026-12-31');
    const todo = addTodo('年终总结', 'high', due);

    expect(todo.dueDate).toEqual(due);
  });

  test('标题为空时抛出错误', () => {
    expect(() => addTodo('')).toThrow(/标题不能为空/);
  });

  test('标题超过 200 字符时抛出错误', () => {
    const longTitle = 'a'.repeat(201);
    expect(() => addTodo(longTitle)).toThrow(/标题不能超过/);
  });

  test('无效优先级抛出错误', () => {
    expect(() => addTodo('测试', 'urgent')).toThrow(/无效的优先级/);
  });

  test('标题不是字符串时抛出 TypeError', () => {
    expect(() => addTodo(123)).toThrow(TypeError);
  });

  test('每个 todo 有唯一 id', () => {
    const a = addTodo('A');
    const b = addTodo('B');
    expect(a.id).not.toBe(b.id);
  });
});

// ---------------------------------------------------------------------------
// completeTodo
// ---------------------------------------------------------------------------
describe('completeTodo', () => {
  test('将未完成事项标记为已完成', () => {
    const todo = addTodo('看书');
    const completed = completeTodo(todo.id);

    expect(completed.completed).toBe(true);
    expect(completed.completedAt).toBeInstanceOf(Date);
  });

  test('已完成事项再次标记，状态不变', () => {
    const todo = addTodo('看书');
    completeTodo(todo.id);
    const again = completeTodo(todo.id);

    expect(again.completed).toBe(true);
  });

  test('不存在的 id 返回 null', () => {
    expect(completeTodo('nonexistent')).toBeNull();
  });

  test('id 不是字符串时返回 null', () => {
    expect(completeTodo(null)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// deleteTodo
// ---------------------------------------------------------------------------
describe('deleteTodo', () => {
  test('删除存在的事项返回 true', () => {
    const todo = addTodo('临时任务');
    expect(deleteTodo(todo.id)).toBe(true);
    expect(getTodoCount()).toBe(0);
  });

  test('删除不存在的事项返回 false', () => {
    expect(deleteTodo('nonexistent')).toBe(false);
  });

  test('id 不是字符串时返回 false', () => {
    expect(deleteTodo(undefined)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getTodo
// ---------------------------------------------------------------------------
describe('getTodo', () => {
  test('按 id 查找事项', () => {
    const todo = addTodo('运动');
    const found = getTodo(todo.id);

    expect(found).not.toBeNull();
    expect(found.title).toBe('运动');
  });

  test('不存在的 id 返回 null', () => {
    expect(getTodo('nope')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// listTodos
// ---------------------------------------------------------------------------
describe('listTodos', () => {
  test('默认返回全部事项', () => {
    addTodo('A');
    addTodo('B');
    expect(listTodos()).toHaveLength(2);
  });

  test('all 过滤器返回全部', () => {
    addTodo('A');
    const todo = addTodo('B');
    completeTodo(todo.id);
    expect(listTodos('all')).toHaveLength(2);
  });

  test('active 过滤器只返回未完成的', () => {
    addTodo('A');
    const todo = addTodo('B');
    completeTodo(todo.id);
    expect(listTodos('active')).toHaveLength(1);
  });

  test('completed 过滤器只返回已完成的', () => {
    addTodo('A');
    const todo = addTodo('B');
    completeTodo(todo.id);
    expect(listTodos('completed')).toHaveLength(1);
  });

  test('无效过滤器返回全部', () => {
    addTodo('A');
    expect(listTodos('invalid')).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// sortByPriority
// ---------------------------------------------------------------------------
describe('sortByPriority', () => {
  test('按优先级排序：high > medium > low', () => {
    const low = addTodo('低优', 'low');
    const high = addTodo('高优', 'high');
    const medium = addTodo('中优', 'medium');

    const sorted = sortByPriority([low, high, medium]);

    expect(sorted[0].priority).toBe('high');
    expect(sorted[1].priority).toBe('medium');
    expect(sorted[2].priority).toBe('low');
  });

  test('不修改原数组（不可变）', () => {
    const a = addTodo('A', 'low');
    const b = addTodo('B', 'high');
    const original = [a, b];
    const snapshot = [...original];

    sortByPriority(original);

    expect(original).toEqual(snapshot);
  });

  test('空数组返回空数组', () => {
    expect(sortByPriority([])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 辅助函数
// ---------------------------------------------------------------------------
describe('辅助函数', () => {
  test('getTodoCount 返回正确数量', () => {
    expect(getTodoCount()).toBe(0);
    addTodo('A');
    expect(getTodoCount()).toBe(1);
    addTodo('B');
    expect(getTodoCount()).toBe(2);
  });

  test('clearTodos 清空所有事项', () => {
    addTodo('A');
    addTodo('B');
    clearTodos();
    expect(getTodoCount()).toBe(0);
    expect(listTodos()).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 不可变性
// ---------------------------------------------------------------------------
describe('不可变性', () => {
  test('addTodo 返回的副本修改不影响内部存储', () => {
    const todo = addTodo('测试');
    todo.title = '被篡改';

    const found = getTodo(todo.id);
    expect(found.title).toBe('测试');
  });

  test('listTodos 返回的副本修改不影响内部存储', () => {
    addTodo('A');
    const list = listTodos();
    list[0].title = '被篡改';

    const fresh = listTodos();
    expect(fresh[0].title).toBe('A');
  });

  test('completeTodo 返回的副本修改不影响内部存储', () => {
    const todo = addTodo('任务');
    const done = completeTodo(todo.id);
    done.completed = false;

    const found = getTodo(todo.id);
    expect(found.completed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 集成流程
// ---------------------------------------------------------------------------
describe('集成流程：典型 TODO 使用场景', () => {
  test('添加 → 查询 → 完成 → 删除', () => {
    // 添加
    const todo = addTodo('完成练习 18', 'high', new Date('2026-07-10'));
    expect(todo.title).toBe('完成练习 18');

    // 查询
    const found = getTodo(todo.id);
    expect(found).not.toBeNull();

    // 完成
    const done = completeTodo(todo.id);
    expect(done.completed).toBe(true);

    // 过滤
    expect(listTodos('active')).toHaveLength(0);
    expect(listTodos('completed')).toHaveLength(1);

    // 删除
    expect(deleteTodo(todo.id)).toBe(true);
    expect(getTodoCount()).toBe(0);
  });

  test('多个事项按优先级排序', () => {
    addTodo('普通任务', 'low');
    addTodo('重要任务', 'high');
    addTodo('日常任务'); // 默认 medium
    addTodo('紧急任务', 'high');

    const sorted = sortByPriority(listTodos());

    expect(sorted[0].priority).toBe('high');
    expect(sorted[1].priority).toBe('high');
    expect(sorted[2].priority).toBe('medium');
    expect(sorted[3].priority).toBe('low');
  });
});
