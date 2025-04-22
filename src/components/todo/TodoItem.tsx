import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Edit, Star, Tag, Trash } from 'lucide-react';
import { Todo } from '../../types/todo';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/dateUtils';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get priority colors
  const getPriorityColor = (): { variant: 'primary' | 'warning' | 'danger'; text: string } => {
    switch (todo.priority) {
      case 'high':
        return { variant: 'danger', text: 'High' };
      case 'medium':
        return { variant: 'warning', text: 'Medium' };
      case 'low':
        return { variant: 'primary', text: 'Low' };
      default:
        return { variant: 'primary', text: 'Low' };
    }
  };

  const priorityInfo = getPriorityColor();

  // Format the due date
  const dueDateText = todo.dueDate ? formatDate(todo.dueDate) : null;

  // Format the creation date
  const createdDateText = formatDate(todo.createdAt, true);

  return (
    <div
      className={`group relative mb-2 rounded-lg border ${
        todo.completed
          ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
          : 'border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'
      } transition-all duration-200 hover:shadow-md dark:hover:shadow-none`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleComplete(todo.id)}
            className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
            aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {todo.completed ? (
              <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="flex-grow min-w-0">
            <div 
              className="cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <h3
                className={`text-base font-medium ${
                  todo.completed
                    ? 'text-gray-500 line-through dark:text-gray-400'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {todo.title}
              </h3>

              {/* Always visible metadata */}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant={priorityInfo.variant} size="sm">
                  <Star className="mr-1 h-3 w-3" />
                  {priorityInfo.text}
                </Badge>

                {todo.category && (
                  <Badge variant="secondary" size="sm">
                    <Tag className="mr-1 h-3 w-3" />
                    {todo.category}
                  </Badge>
                )}

                {todo.dueDate && (
                  <Badge 
                    variant={
                      todo.completed
                        ? 'default'
                        : new Date(todo.dueDate) < new Date()
                        ? 'danger'
                        : 'default'
                    } 
                    size="sm"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {dueDateText}
                  </Badge>
                )}
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className={`mt-3 animate-fadeIn text-sm ${todo.completed ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {todo.description ? (
                  <p className="whitespace-pre-line">{todo.description}</p>
                ) : (
                  <p className="italic text-gray-400 dark:text-gray-500">No description provided</p>
                )}
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Created: {createdDateText}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex-shrink-0 ml-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Edit todo"
              onClick={() => onEdit(todo)}
              icon={<Edit className="h-4 w-4" />}
            />
            <Button
              variant="ghost"
              size="sm"
              aria-label="Delete todo"
              onClick={() => onDelete(todo.id)}
              icon={<Trash className="h-4 w-4 text-red-500" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;