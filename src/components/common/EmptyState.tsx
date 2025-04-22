import React from 'react';
import { ClipboardList } from 'lucide-react';
import Button from '../ui/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks found',
  description = 'Get started by creating a new task',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
        <ClipboardList className="h-10 w-10 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {description}
      </p>
      {action && (
        <Button
          className="mt-4"
          variant="primary"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;