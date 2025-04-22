export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high';
  category: string | null;
}

export type TodoFilter = {
  status: 'all' | 'active' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  search: string;
  category: string | null;
};

export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface TodoContextType {
  todos: Todo[];
  filter: TodoFilter;
  sort: { by: SortOption; direction: SortDirection };
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  setFilter: (filter: Partial<TodoFilter>) => void;
  setSort: (sort: Partial<{ by: SortOption; direction: SortDirection }>) => void;
  categories: string[];
  filteredTodos: Todo[];
  clearCompleted: () => void;
}