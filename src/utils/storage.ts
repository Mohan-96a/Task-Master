import { Todo } from '../types/todo';

// Key for storing todos in localStorage
const TODOS_STORAGE_KEY = 'todos-app-data';
const THEME_STORAGE_KEY = 'todos-app-theme';

// Get todos from localStorage
export const getTodos = (): Todo[] => {
  try {
    const storedTodos = localStorage.getItem(TODOS_STORAGE_KEY);
    if (!storedTodos) return [];
    
    // Parse the stored JSON and convert string dates back to Date objects
    return JSON.parse(storedTodos, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return new Date(value);
      }
      if (key === 'dueDate' && value) {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error('Error retrieving todos from localStorage:', error);
    return [];
  }
};

// Save todos to localStorage
export const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

// Get theme preference from localStorage
export const getThemePreference = (): 'dark' | 'light' => {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (!storedTheme) {
      // Check for system preference if no stored preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return storedTheme as 'dark' | 'light';
  } catch (error) {
    console.error('Error retrieving theme from localStorage:', error);
    return 'light';
  }
};

// Save theme preference to localStorage
export const saveThemePreference = (theme: 'dark' | 'light'): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
  }
};