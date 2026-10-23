import React, { useState } from 'react';
import dayjs from 'dayjs';
import { PlusCircle } from 'lucide-react';
import { Category, Priority, Todo } from '../types';

interface TodoFormProps {
  onAdd: (todo: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('大学課題');
  const [priority, setPriority] = useState<Priority>('中');
  const [dueDate, setDueDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('タスク名を入力してください');
      return;
    }
    setError('');
    onAdd({ title, category, priority, dueDate });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      {error && <p className="text-red-500 text-sm mb-2 font-medium">{error}</p>}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="課題やタスクを入力..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 font-medium transition cursor-pointer"
          >
            <PlusCircle size={18} /> 追加
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
          <label className="flex items-center gap-2">
            <span className="shrink-0">カテゴリ:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="p-1.5 border border-gray-300 rounded-md w-full bg-white"
            >
              <option value="大学課題">大学課題</option>
              <option value="就活">就活</option>
              <option value="アルバイト">アルバイト</option>
              <option value="プライベート">プライベート</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="shrink-0">優先度:</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="p-1.5 border border-gray-300 rounded-md w-full bg-white"
            >
              <option value="高">高 (急ぎ)</option>
              <option value="中">中</option>
              <option value="低">低</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="shrink-0">提出期限:</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="p-1.5 border border-gray-300 rounded-md w-full bg-white"
            />
          </label>
        </div>
      </div>
    </form>
  );
};