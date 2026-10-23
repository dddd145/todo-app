import React from 'react';
import dayjs from 'dayjs';
import { Trash2, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const isExpired = !todo.completed && dayjs(todo.dueDate).isBefore(dayjs(), 'day');

  const priorityBadge = {
    高: 'bg-red-100 text-red-700 border-red-200',
    中: 'bg-amber-100 text-amber-800 border-amber-200',
    低: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }[todo.priority];

  return (
    <div className={`flex items-center justify-between p-3.5 mb-2.5 rounded-xl border bg-white shadow-xs transition-all ${todo.completed ? 'opacity-50 bg-gray-50 border-gray-200' : 'border-gray-200 hover:border-gray-300'}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button onClick={() => onToggle(todo.id)} className="text-gray-400 hover:text-blue-600 shrink-0 cursor-pointer">
          {todo.completed ? <CheckCircle2 className="text-emerald-500" size={22} /> : <Circle size={22} />}
        </button>
        <div className="min-w-0 flex-1">
          <span className={`block truncate text-gray-800 ${todo.completed ? 'line-through text-gray-400' : 'font-medium'}`}>
            {todo.title}
          </span>
          <div className="flex flex-wrap gap-2 mt-1 text-xs">
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{todo.category}</span>
            <span className={`px-2 py-0.5 rounded-md border font-medium ${priorityBadge}`}>{todo.priority}</span>
            <span className={`flex items-center gap-1 font-medium ${isExpired ? 'text-red-600' : 'text-gray-500'}`}>
              {isExpired && <AlertTriangle size={13} className="animate-bounce" />} 期限: {todo.dueDate}
            </span>
          </div>
        </div>
      </div>
      <button onClick={() => onDelete(todo.id)} className="text-gray-400 hover:text-red-500 p-1.5 shrink-0 ml-2 cursor-pointer transition-colors">
        <Trash2 size={18} />
      </button>
    </div>
  );
};