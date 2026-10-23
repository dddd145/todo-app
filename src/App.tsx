import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Todo, Category } from './types';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';

const STORAGE_KEY = 'pg3_custom_todo_app';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [filterCategory, setFilterCategory] = useState<Category | 'すべて'>('すべて');
  const [filterStatus, setFilterStatus] = useState<'すべて' | '未完了' | '完了'>('未完了');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

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
    .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf());

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 text-gray-800">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800">🎓 学生生活 タスク＆課題管理</h1>
          <p className="text-sm text-slate-500 mt-1">講義の提出期限・就活・日常のタスクを一元管理</p>
        </header>

        <TodoForm onAdd={handleAddTodo} />

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

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as Category | 'すべて')}
            className="text-sm p-1.5 border border-gray-300 rounded-lg bg-white"
          >
            <option value="すべて">全カテゴリ</option>
            <option value="大学課題">大学課題</option>
            <option value="就活">就活</option>
            <option value="アルバイト">アルバイト</option>
            <option value="プライベート">プライベート</option>
          </select>
        </div>

        <div>
          {filteredTodos.length === 0 ? (
            <div className="text-center bg-white border border-gray-200 rounded-xl p-8 text-gray-400">
              該当するタスクはありません。
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