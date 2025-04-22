import React, { createContext, useContext, useEffect, useState } from 'react';
import { Todo, TodoContextType, TodoFilter, SortOption, SortDirection } from '../types/todo';
import { getTodos, saveTodos } from '../utils/storage';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: React.ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilterState] = useState<TodoFilter>({
    status: 'all',
    priority: 'all',
    search: '',
    category: null,
  });
  const [sort, setSortState] = useState<{ by: SortOption; direction: SortDirection }>({
    by: 'createdAt',
    direction: 'desc',
  });

  // Load todos from localStorage on initial render
  useEffect(() => {
    setTodos(getTodos());
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // Add a new todo
  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): void => {
    const now = new Date();
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  };

  // Update an existing todo
  const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>): void => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date() }
          : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = (id: string): void => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // Toggle the completed status of a todo
  const toggleComplete = (id: string): void => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  };

  // Set filter
  const setFilter = (newFilter: Partial<TodoFilter>): void => {
    setFilterState((prevFilter) => ({ ...prevFilter, ...newFilter }));
  };

  // Set sort
  const setSort = (newSort: Partial<{ by: SortOption; direction: SortDirection }>): void => {
    setSortState((prevSort) => ({ ...prevSort, ...newSort }));
  };

  // Clear all completed todos
  const clearCompleted = (): void => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
  };

  // Extract all unique categories
  const categories = Array.from(
    new Set(todos.filter((todo) => todo.category).map((todo) => todo.category))
  ).filter((category): category is string => category !== null);

  // Get filtered and sorted todos
  const filteredTodos = todos
    .filter((todo) => {
      // Filter by status
      if (filter.status === 'active' && todo.completed) return false;
      if (filter.status === 'completed' && !todo.completed) return false;
      
      // Filter by priority
      if (filter.priority !== 'all' && todo.priority !== filter.priority) return false;
      
      // Filter by category
      if (filter.category && todo.category !== filter.category) return false;
      
      // Filter by search term
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          todo.title.toLowerCase().includes(searchLower) ||
          (todo.description && todo.description.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by the selected field
      if (sort.by === 'title') {
        const comparison = a.title.localeCompare(b.title);
        return sort.direction === 'asc' ? comparison : -comparison;
      } else if (sort.by === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityA = priorityOrder[a.priority];
        const priorityB = priorityOrder[b.priority];
        const comparison = priorityB - priorityA;
        return sort.direction === 'asc' ? -comparison : comparison;
      } else if (sort.by === 'dueDate') {
        // Handle null due dates
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return sort.direction === 'asc' ? -1 : 1;
        if (!b.dueDate) return sort.direction === 'asc' ? 1 : -1;
        
        const comparison = a.dueDate.getTime() - b.dueDate.getTime();
        return sort.direction === 'asc' ? comparison : -comparison;
      } else {
        // Default sort by createdAt
        const comparison = b.createdAt.getTime() - a.createdAt.getTime();
        return sort.direction === 'asc' ? -comparison : comparison;
      }
    });

  const value: TodoContextType = {
    todos,
    filter,
    sort,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    setFilter,
    setSort,
    categories,
    filteredTodos,
    clearCompleted,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};