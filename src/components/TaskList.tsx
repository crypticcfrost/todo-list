import React from 'react';
import { Task, TaskStatus, Priority } from '../types';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onSubtaskToggle,
}) => {
  console.log('TaskList received tasks:', tasks);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in_progress':
        return 'text-blue-500';
      case 'todo':
        return 'text-yellow-500';
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tasks found. Create a new task to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`card task-enter ${getPriorityColor(task.priority)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() =>
                    onTaskUpdate(task.id, {
                      status: task.status === 'completed' ? 'todo' : 'completed',
                      completedAt: task.status === 'completed' ? undefined : new Date(),
                    })
                  }
                  className="h-5 w-5 rounded border-gray-600"
                />
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <span className={`text-sm ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>

              {task.description && (
                <p className="mt-2 text-gray-400">{task.description}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              {task.subtasks.length > 0 && (
                <div className="mt-4 space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => onSubtaskToggle(task.id, subtask.id)}
                        className="h-4 w-4 rounded border-gray-600"
                      />
                      <span
                        className={`text-sm ${
                          subtask.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <span className="mt-1 text-sm text-gray-400">
                  {task.progress}% complete
                </span>
              </div>

              {task.dueDate && (
                <div className="mt-2 text-sm text-gray-400">
                  Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  onTaskUpdate(task.id, {
                    status:
                      task.status === 'todo'
                        ? 'in_progress'
                        : task.status === 'in_progress'
                        ? 'completed'
                        : 'todo',
                  })
                }
                className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
              >
                {task.status === 'todo'
                  ? 'Start'
                  : task.status === 'in_progress'
                  ? 'Complete'
                  : 'Reopen'}
              </button>
              <button
                onClick={() => onTaskDelete(task.id)}
                className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList; 