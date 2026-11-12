import React, { useState } from 'react';
import dayjs from 'dayjs';
import { PlusCircle, Plus } from 'lucide-react';
import type { Priority, Todo } from '../types';

interface TodoFormProps {
  categories: string[];
  onAdd: (todo: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => void;
  onAddCategory: (newCategory: string) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ categories, onAdd, onAddCategory }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState((categories && categories[0]) || '課題');
  const [newCatInput, setNewCatInput] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [priority, setPriority] = useState<Priority>(3);
  const [dueDate, setDueDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('予定を入力してください');
      return;
    }
    setError('');
    onAdd({ title, category, priority, dueDate });
    setTitle('');
  };

  const handleCreateCategory = () => {
    const trimmed = newCatInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      onAddCategory(trimmed);
      setCategory(trimmed);
      setNewCatInput('');
      setIsAddingCategory(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
      {error && <p className="text-red-500 text-sm mb-2 font-medium">{error}</p>}
      
      <div className="flex flex-col gap-4">
        {/* タイトル入力 */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="予定を入力..."
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          {/* カテゴリ選択 & 新規作成 */}
          <div className="flex flex-col gap-1">
            <span className="font-medium">カテゴリ:</span>
            {!isAddingCategory ? (
              <div className="flex gap-1">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded-md w-full bg-white"
                >
                  {(categories || ['課題', 'アルバイト', 'プライベート']).map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="p-1.5 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 shrink-0"
                  title="カテゴリを新規追加"
                >
                  <Plus size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="新カテゴリ名"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded-md w-full"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md"
                >
                  追加
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-md"
                >
                  取消
                </button>
              </div>
            )}
          </div>

          {/* 優先度（均等目盛りスライダー） */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-medium">
              <span>優先度:</span>
              <span className="text-blue-600 font-bold">{priority} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value) as Priority)}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 px-1">
              <span>1 (低)</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5 (高)</span>
            </div>
          </div>

          {/* 提出期限 */}
          <div className="flex flex-col gap-1">
            <span className="font-medium">提出期限:</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="p-1.5 border border-gray-300 rounded-md w-full bg-white"
            />
          </div>
        </div>
      </div>
    </form>
  );
};