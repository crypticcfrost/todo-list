'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskFilters as TaskFiltersType } from '../../types';
import TaskList from '../../components/TaskList';
import TaskFilters from '../../components/TaskFilters';
import { toast } from 'react-toastify';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFiltersType>({ showCompleted: true });
  const [loaded, setLoaded] = useState(false); // NEW

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    console.log('Loading tasks from localStorage:', savedTasks);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        console.log('Parsed tasks:', parsedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing tasks:', error);
        toast.error('Error loading tasks');
      }
    }
    setLoaded(true); // NEW
  }, []);

  useEffect(() => {
    if (loaded) { // Only save if loaded
      console.log('Saving tasks to localStorage:', tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: new Date(),
              progress: updates.subtasks
                ? calculateProgress(updates.subtasks)
                : task.progress,
            }
          : task
      )
    );
    toast.info('Task updated successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    toast.error('Task deleted successfully!');
  };

  const handleSubtaskToggle = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, completed: !subtask.completed }
              : subtask
          );
          return {
            ...task,
            subtasks: updatedSubtasks,
            progress: calculateProgress(updatedSubtasks),
            updatedAt: new Date(),
          };
        }
        return task;
      })
    );
  };

  const calculateProgress = (subtasks: Task['subtasks']) => {
    if (subtasks.length === 0) return 0;
    const completed = subtasks.filter((subtask) => subtask.completed).length;
    return Math.round((completed / subtasks.length) * 100);
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    tasks.forEach((task) => {
      if (task.category) categories.add(task.category);
    });
    return Array.from(categories);
  };

  const getUniqueTags = () => {
    const tags = new Set<string>();
    tasks.forEach((task) => {
      task.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  };

  const filteredTasks = tasks.filter((task) => {
    if (!filters.showCompleted && task.status === 'completed') return false;
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.category && task.category !== filters.category) return false;
    if (filters.tags && filters.tags.length > 0) {
      if (!task.tags.some((tag) => filters.tags?.includes(tag))) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }
    if (filters.dueDate) {
      const taskDate = new Date(task.dueDate || '').toDateString();
      const filterDate = new Date(filters.dueDate).toDateString();
      return taskDate === filterDate;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Tasks</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <TaskFilters
            filters={filters}
            onFilterChange={setFilters}
            categories={getUniqueCategories()}
            tags={getUniqueTags()}
          />
        </div>

        <div className="lg:col-span-3">
          <TaskList
            tasks={filteredTasks}
            onTaskUpdate={handleUpdateTask}
            onTaskDelete={handleDeleteTask}
            onSubtaskToggle={handleSubtaskToggle}
          />
        </div>
      </div>
    </div>
  );
} 