import React, { useState, useEffect } from 'react';
import { Calendar, Tag, X } from 'lucide-react';
import { Todo } from '../../types/todo';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialTodo?: Todo;
  onCancel?: () => void;
  isEditing?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  initialTodo,
  onCancel,
  isEditing = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');
  const [titleError, setTitleError] = useState('');

  // Set initial values when editing
  useEffect(() => {
    if (initialTodo) {
      setTitle(initialTodo.title);
      setDescription(initialTodo.description);
      setDueDate(
        initialTodo.dueDate
          ? initialTodo.dueDate.toISOString().split('T')[0]
          : ''
      );
      setPriority(initialTodo.priority);
      setCategory(initialTodo.category || '');
    }
  }, [initialTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      completed: initialTodo ? initialTodo.completed : false,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      category: category.trim() || null,
    });

    // Reset form if not editing
    if (!isEditing) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setCategory('');
    }

    // Call onCancel if provided (for editing mode)
    if (isEditing && onCancel) {
      onCancel();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="space-y-4">
        <Input
          label="Title"
          id="title"
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setTitleError('');
          }}
          error={titleError}
          fullWidth
          required
        />

        <div>
          <label
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Task details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="flex items-center">
              <label
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="due-date"
              >
                <Calendar className="mr-1 inline h-4 w-4" />
                Due Date
              </label>
            </div>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              fullWidth
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="priority"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <label
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="category"
            >
              <Tag className="mr-1 inline h-4 w-4" />
              Category
            </label>
          </div>
          <Input
            id="category"
            type="text"
            placeholder="Work, Personal, Study, etc."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          />
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              icon={<X className="h-4 w-4" />}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary">
            {isEditing ? 'Update Task' : 'Add Task'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;