"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Task, TaskFilters as TaskFiltersType } from '../types';
import TaskList from '../components/TaskList';
import AddTask from '../components/AddTask';
import TaskStats from '../components/TaskStats';
import TaskFilters from '../components/TaskFilters';
import Link from 'next/link';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFiltersType>({ showCompleted: true });
  const [loaded, setLoaded] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        setTasks([]);
      }
    }
    setLoaded(true);
  }, []);

  // Listen for localStorage changes (e.g., from add-task page)
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'tasks') {
        const updatedTasks = event.newValue ? JSON.parse(event.newValue) : [];
        setTasks(updatedTasks);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Optionally, update localStorage when tasks change (if you allow editing on dashboard)
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    toast.success('Task added successfully!');
  };

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

  const getRecentTasks = () => {
    return [...tasks]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
  };

  const getUpcomingTasks = () => {
    const now = new Date();
    return tasks
      .filter((task) => task.dueDate && new Date(task.dueDate) > now)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          href="/add-task"
          className="rounded bg-[var(--primary)] px-4 py-2 font-medium hover:bg-[var(--primary-hover)]"
        >
          Add New Task
        </Link>
      </div>

      <TaskStats tasks={tasks} />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <Link
              href="/tasks"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {getRecentTasks().map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-[var(--card-hover)] p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{task.title}</h3>
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      task.status === 'completed'
                        ? 'bg-green-500/20 text-green-500'
                        : task.status === 'in_progress'
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                {task.dueDate && (
                  <p className="mt-2 text-sm text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
            {getRecentTasks().length === 0 && (
              <p className="text-center text-gray-400">No recent tasks</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
            <Link
              href="/tasks"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {getUpcomingTasks().map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-[var(--card-hover)] p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{task.title}</h3>
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      task.priority === 'high'
                        ? 'bg-red-500/20 text-red-500'
                        : task.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-green-500/20 text-green-500'
                    }`}
                  >
                    {task.priority} priority
                  </span>
                </div>
                {task.dueDate && (
                  <p className="mt-2 text-sm text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
            {getUpcomingTasks().length === 0 && (
              <p className="text-center text-gray-400">No upcoming tasks</p>
            )}
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}