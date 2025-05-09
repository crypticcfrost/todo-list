import React from 'react';
import { TaskFilters as TaskFiltersType, TaskStatus, Priority } from '../types';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFilterChange: (filters: TaskFiltersType) => void;
  categories: string[];
  tags: string[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  categories,
  tags,
}) => {
  const handleChange = (
    key: keyof TaskFiltersType,
    value: string | boolean | string[] | undefined
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Filters</h2>

      <div>
        <label className="mb-1 block text-sm font-medium">Search</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="Search tasks..."
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
          >
            <option value="">All</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Priority</label>
          <select
            value={filters.priority || ''}
            onChange={(e) => handleChange('priority', e.target.value as Priority)}
          >
            <option value="">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label key={tag} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={filters.tags?.includes(tag)}
                onChange={(e) => {
                  const newTags = e.target.checked
                    ? [...(filters.tags || []), tag]
                    : (filters.tags || []).filter((t) => t !== tag);
                  handleChange('tags', newTags.length ? newTags : undefined);
                }}
                className="h-4 w-4 rounded border-gray-600"
              />
              <span className="text-sm">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Due Date</label>
        <input
          type="date"
          value={filters.dueDate ? new Date(filters.dueDate).toISOString().split('T')[0] : ''}
          onChange={(e) =>
            handleChange('dueDate', e.target.value ? new Date(e.target.value) : undefined)
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showCompleted"
          checked={filters.showCompleted}
          onChange={(e) => handleChange('showCompleted', e.target.checked)}
          className="h-4 w-4 rounded border-gray-600"
        />
        <label htmlFor="showCompleted" className="text-sm">
          Show completed tasks
        </label>
      </div>

      <button
        onClick={() =>
          onFilterChange({
            status: undefined,
            priority: undefined,
            category: undefined,
            tags: undefined,
            search: undefined,
            dueDate: undefined,
            showCompleted: true,
          })
        }
        className="w-full rounded bg-gray-600 px-4 py-2 font-medium hover:bg-gray-700"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default TaskFilters; 