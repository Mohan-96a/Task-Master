import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTodoContext } from '../../contexts/TodoContext';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoFilters from './TodoFilters';
import { Todo } from '../../types/todo';
import Button from '../ui/Button';

const TodoContainer: React.FC = () => {
  const { addTodo, updateTodo } = useTodoContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleAddTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTodo(todoData);
    setShowAddForm(false);
  };

  const handleUpdateTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, todoData);
      setEditingTodo(null);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleToggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setEditingTodo(null);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Add Task Button */}
      {!showAddForm && !editingTodo && (
        <div className="mb-6 flex justify-center sm:justify-end">
          <Button
            variant="primary"
            onClick={handleToggleAddForm}
            icon={<PlusCircle className="h-5 w-5" />}
          >
            Add New Task
          </Button>
        </div>
      )}

      {/* Add Task Form */}
      {showAddForm && (
        <div className="mb-6 animate-slideDown">
          <h2 className="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">
            Add New Task
          </h2>
          <TodoForm 
            onSubmit={handleAddTodo} 
            onCancel={handleToggleAddForm}
          />
        </div>
      )}

      {/* Edit Task Form */}
      {editingTodo && (
        <div className="mb-6 animate-slideDown">
          <h2 className="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">
            Edit Task
          </h2>
          <TodoForm
            initialTodo={editingTodo}
            onSubmit={handleUpdateTodo}
            onCancel={handleCancelEdit}
            isEditing
          />
        </div>
      )}

      {/* Filters */}
      <TodoFilters />

      {/* Todo List */}
      <TodoList onEditTodo={handleEditTodo} />
    </div>
  );
};

export default TodoContainer;