import React from 'react';
import { useTodoContext } from '../../contexts/TodoContext';
import TodoItem from './TodoItem';
import EmptyState from '../common/EmptyState';

interface TodoListProps {
  onEditTodo: (todo: any) => void;
}

const TodoList: React.FC<TodoListProps> = ({ onEditTodo }) => {
  const { filteredTodos, toggleComplete, deleteTodo } = useTodoContext();

  if (filteredTodos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={toggleComplete}
          onDelete={deleteTodo}
          onEdit={onEditTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;