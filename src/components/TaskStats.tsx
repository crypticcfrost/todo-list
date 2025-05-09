import React from 'react';
import { Task, TaskStats as TaskStatsType } from '../types';

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const calculateStats = (): TaskStatsType => {
    const stats: TaskStatsType = {
      total: tasks.length,
      completed: 0,
      inProgress: 0,
      todo: 0,
      byPriority: {
        high: 0,
        medium: 0,
        low: 0,
      },
      byCategory: {},
      completionRate: 0,
    };

    tasks.forEach((task) => {
      // Count by status
      switch (task.status) {
        case 'completed':
          stats.completed++;
          break;
        case 'in_progress':
          stats.inProgress++;
          break;
        case 'todo':
          stats.todo++;
          break;
      }

      // Count by priority
      stats.byPriority[task.priority]++;

      // Count by category
      if (task.category) {
        stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
      }
    });

    // Calculate completion rate
    stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="card">
        <h3 className="text-lg font-semibold">Task Overview</h3>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span>Total Tasks</span>
            <span className="font-medium">{stats.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Completed</span>
            <span className="font-medium text-green-500">{stats.completed}</span>
          </div>
          <div className="flex justify-between">
            <span>In Progress</span>
            <span className="font-medium text-blue-500">{stats.inProgress}</span>
          </div>
          <div className="flex justify-between">
            <span>To Do</span>
            <span className="font-medium text-yellow-500">{stats.todo}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold">Completion Rate</h3>
        <div className="mt-4">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <div className="mt-2 text-center text-2xl font-bold">
            {stats.completionRate.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold">Priority Distribution</h3>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span>High Priority</span>
            <span className="font-medium text-red-500">{stats.byPriority.high}</span>
          </div>
          <div className="flex justify-between">
            <span>Medium Priority</span>
            <span className="font-medium text-yellow-500">{stats.byPriority.medium}</span>
          </div>
          <div className="flex justify-between">
            <span>Low Priority</span>
            <span className="font-medium text-green-500">{stats.byPriority.low}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold">Categories</h3>
        <div className="mt-4 space-y-2">
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div key={category} className="flex justify-between">
              <span>{category}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
          {Object.keys(stats.byCategory).length === 0 && (
            <p className="text-gray-400">No categories yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskStats; 