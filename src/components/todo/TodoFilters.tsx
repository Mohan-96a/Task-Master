import React from 'react';
import { Filter, Search, SortAsc, SortDesc } from 'lucide-react';
import { useTodoContext } from '../../contexts/TodoContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const TodoFilters: React.FC = () => {
  const { 
    filter, 
    setFilter, 
    categories,
    sort,
    setSort,
    clearCompleted
  } = useTodoContext();

  return (
    <div className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center">
        <Filter className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Search */}
        <div>
          <Input
            placeholder="Search tasks..."
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            icon={<Search className="h-4 w-4" />}
            fullWidth
          />
        </div>
        
        {/* Status filter */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={filter.status === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter({ status: 'all' })}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filter.status === 'active' ? 'primary' : 'outline'}
              onClick={() => setFilter({ status: 'active' })}
            >
              Active
            </Button>
            <Button
              size="sm"
              variant={filter.status === 'completed' ? 'primary' : 'outline'}
              onClick={() => setFilter({ status: 'completed' })}
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Priority filter */}
        <div>
          <label
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="priority-filter"
          >
            Priority
          </label>
          <select
            id="priority-filter"
            value={filter.priority}
            onChange={(e) => setFilter({ priority: e.target.value as any })}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        {/* Category filter */}
        <div>
          <label
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="category-filter"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={filter.category || ''}
            onChange={(e) => setFilter({ category: e.target.value || null })}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort options */}
      <div>
        <div className="flex items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Sort by:
          </label>
          
          <select
            value={sort.by}
            onChange={(e) => setSort({ by: e.target.value as any })}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 mr-2"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
          
          <Button
            variant="ghost"
            size="sm"
            aria-label={sort.direction === 'asc' ? "Sort descending" : "Sort ascending"}
            onClick={() => setSort({ direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
            icon={sort.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Clear completed */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={clearCompleted}
        >
          Clear Completed
        </Button>
      </div>
    </div>
  );
};

export default TodoFilters;