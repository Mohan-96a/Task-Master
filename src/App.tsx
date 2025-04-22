import React, { useState, useEffect } from 'react';
import { Check, Circle, Moon, PlusCircle, Search, Sun, User as UserIcon, X, LogOut, Clock } from 'lucide-react';

interface Todo {
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

interface AppState {
  userName: string;
  todos: Todo[];
  filter: {
    status: 'all' | 'active' | 'completed';
    priority: 'all' | 'low' | 'medium' | 'high';
    search: string;
    category: string | null;
  };
  showFilters: boolean;
  showAddForm: boolean;
  theme: 'light' | 'dark';
}

const STORAGE_KEY = 'task-master';

const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) throw new Error('No saved state');
    
    return JSON.parse(saved, (key, value) => {
      if (['createdAt', 'updatedAt', 'dueDate'].includes(key) && value) return new Date(value);
      return value;
    });
  } catch {
    return {
      userName: '',
      todos: [],
      filter: {
        status: 'all',
        priority: 'all',
        search: '',
        category: null,
      },
      showFilters: false,
      showAddForm: false,
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    };
  }
};

const NameForm = ({ onSubmit }: { onSubmit: (name: string) => void }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full animate-slideDown">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Welcome to Task Master</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started
          </button>
        </div>
      </form>
    </div>
  );
};

const AddTodoForm = ({ onSubmit, onCancel, initialTodo }: { 
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialTodo?: Todo;
}) => {
  const [title, setTitle] = useState(initialTodo?.title || '');
  const [description, setDescription] = useState(initialTodo?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialTodo?.priority || 'medium');
  const [dueDate, setDueDate] = useState(
    initialTodo?.dueDate 
      ? new Date(initialTodo.dueDate.getTime() - initialTodo.dueDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        completed: initialTodo?.completed || false,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        category: null,
      });
      if (!initialTodo) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 animate-slideDown">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          required
        />
        
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          rows={3}
        />
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date & Time (optional)
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {initialTodo ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </div>
    </form>
  );
};

function App() {
  const [state, setState] = useState(loadState);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(loadState());
  };

  if (!state.userName) {
    return <NameForm onSubmit={name => setState(s => ({ ...s, userName: name }))} />;
  }

  const now = new Date();
  const overdueTodos = state.todos.filter(todo => 
    !todo.completed && 
    todo.dueDate && 
    todo.dueDate < now
  );

  const regularTodos = state.todos.filter(todo => 
    !overdueTodos.includes(todo)
  );

  const filteredTodos = (todos: Todo[]) =>
    todos.filter(todo => {
      if (state.filter.status === 'active' && todo.completed) return false;
      if (state.filter.status === 'completed' && !todo.completed) return false;
      if (state.filter.priority !== 'all' && todo.priority !== state.filter.priority) return false;
      if (state.filter.category && todo.category !== state.filter.category) return false;
      if (state.filter.search) {
        const search = state.filter.search.toLowerCase();
        return (
          todo.title.toLowerCase().includes(search) ||
          todo.description.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    setState(s => ({
      ...s,
      todos: [{
        ...todoData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      }, ...s.todos],
      showAddForm: false,
    }));
    setEditingTodo(null);
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Check className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold">Task Master</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setState(s => ({ ...s, showFilters: !s.showFilters }))}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200"
              >
                {state.showFilters ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </button>
              
              <button
                onClick={() => setState(s => ({ 
                  ...s, 
                  theme: s.theme === 'light' ? 'dark' : 'light' 
                }))}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200"
              >
                {state.theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{state.userName}</span>
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-8">
        {state.showFilters && (
          <div className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 animate-slideDown">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Search tasks..."
                value={state.filter.search}
                onChange={e => setState(s => ({
                  ...s,
                  filter: { ...s.filter, search: e.target.value }
                }))}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
              
              <select
                value={state.filter.status}
                onChange={e => setState(s => ({
                  ...s,
                  filter: { ...s.filter, status: e.target.value as any }
                }))}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={state.filter.priority}
                onChange={e => setState(s => ({
                  ...s,
                  filter: { ...s.filter, priority: e.target.value as any }
                }))}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        )}

        {(state.showAddForm || editingTodo) && (
          <AddTodoForm 
            onSubmit={addTodo}
            onCancel={() => {
              setState(s => ({ ...s, showAddForm: false }));
              setEditingTodo(null);
            }}
            initialTodo={editingTodo}
          />
        )}

        {/* Overdue Tasks */}
        {filteredTodos(overdueTodos).length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Overdue Tasks
            </h2>
            <div className="space-y-4">
              {filteredTodos(overdueTodos).map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={() => setState(s => ({
                    ...s,
                    todos: s.todos.map(t =>
                      t.id === todo.id
                        ? { ...t, completed: !t.completed, updatedAt: new Date() }
                        : t
                    )
                  }))}
                  onDelete={() => setState(s => ({
                    ...s,
                    todos: s.todos.filter(t => t.id !== todo.id)
                  }))}
                  onEdit={() => setEditingTodo(todo)}
                  formatDateTime={formatDateTime}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Tasks */}
        <div className="space-y-4">
          {filteredTodos(regularTodos).map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => setState(s => ({
                ...s,
                todos: s.todos.map(t =>
                  t.id === todo.id
                    ? { ...t, completed: !t.completed, updatedAt: new Date() }
                    : t
                )
              }))}
              onDelete={() => setState(s => ({
                ...s,
                todos: s.todos.filter(t => t.id !== todo.id)
              }))}
              onEdit={() => setEditingTodo(todo)}
              formatDateTime={formatDateTime}
            />
          ))}

          {filteredTodos(regularTodos).length === 0 && filteredTodos(overdueTodos).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setState(s => ({ ...s, showAddForm: true }))}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors duration-200 animate-bounce"
        >
          <PlusCircle className="h-6 w-6" />
        </button>
      </main>
    </div>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  formatDateTime: (date: Date) => string;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  formatDateTime
}) => (
  <div
    className={`group rounded-lg border ${
      todo.completed
        ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
        : 'border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'
    } transition-all duration-200 hover:shadow-md dark:hover:shadow-none animate-fadeIn`}
  >
    <div className="p-4">
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
        >
          {todo.completed ? (
            <Check className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        <div className="flex-grow min-w-0">
          <h3 className={`text-base font-medium ${
            todo.completed
              ? 'text-gray-500 line-through dark:text-gray-400'
              : 'text-gray-900 dark:text-gray-100'
          }`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {todo.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className={`rounded-full px-2 py-1 ${
              todo.priority === 'high'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : todo.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {todo.priority}
            </span>
            
            {todo.dueDate && (
              <span className={`rounded-full px-2 py-1 flex items-center ${
                todo.completed
                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  : todo.dueDate < new Date()
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                <Clock className="h-3 w-3 mr-1" />
                {formatDateTime(todo.dueDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-shrink-0 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
          >
            <Check className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="flex-shrink-0 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default App;