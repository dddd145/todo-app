import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import type { Todo } from './types';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';

dayjs.locale('ja');

const STORAGE_KEY_TODOS = 'pg3_custom_todo_app';
const STORAGE_KEY_CATS = 'pg3_custom_todo_categories';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TODOS);
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<string[]>(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CATS);
    const parsed = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : ['課題', 'アルバイト', 'プライベート'];
  } catch {
    return ['課題', 'アルバイト', 'プライベート'];
  }
});

  const [filterCategory, setFilterCategory] = useState<string>('すべて');
  const [filterStatus, setFilterStatus] = useState<'すべて' | '未完了' | '完了'>('未完了');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date'); 

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATS, JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (newCat: string) => {
    if (!categories.includes(newCat)) {
      setCategories([...categories, newCat]);
    }
  };

  const handleAddTodo = (newTodoData: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...newTodoData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
    };
    setTodos([newTodo, ...todos]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = todos
    .filter(todo => filterCategory === 'すべて' || todo.category === filterCategory)
    .filter(todo => {
      if (filterStatus === '未完了') return !todo.completed;
      if (filterStatus === '完了') return todo.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }
        return dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf();
      }
      return dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf();
    });

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 text-gray-800">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6 flex justify-between items-center pb-2 border-b border-gray-200">
          <h1 className="text-xl font-bold text-slate-800">Todo管理ソフト</h1>
          <p className="text-sm text-slate-500 font-medium">
            {dayjs().format('YYYY年MM月DD日 (ddd)')}
          </p>
        </header>

        <TodoForm
          categories={categories}
          onAdd={handleAddTodo}
          onAddCategory={handleAddCategory}
        />

        {/* コントロールエリア (フィルター & ソート切り替え) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex gap-1 text-sm">
            {(['すべて', '未完了', '完了'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${filterStatus === status ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex gap-2 text-sm">
            {/* ソート順の選択 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
              className="p-1.5 border border-gray-300 rounded-lg bg-white font-medium"
            >
              <option value="date">日付順</option>
              <option value="priority">優先度順</option>
            </select>

            {/* カテゴリ絞り込み */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-1.5 border border-gray-300 rounded-lg bg-white"
            >
              <option value="すべて">全カテゴリ</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Todo 一覧 */}
        <div>
          {filteredTodos.length === 0 ? (
            <div className="text-center bg-white border border-gray-200 rounded-xl p-8 text-gray-400">
              該当する予定はありません。
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}