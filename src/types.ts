export type Priority = '高' | '中' | '低';
export type Category = '大学課題' | '就活' | 'アルバイト' | 'プライベート';

export interface Todo {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string;
}