export type Priority = 1 | 2 | 3 | 4 | 5;
export interface Todo {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}