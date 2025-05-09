export type Priority = 'high' | 'medium' | 'low';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  category?: string;
  tags: string[];
  subtasks: Subtask[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  progress: number; // 0-100
  notes?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  category?: string;
  tags?: string[];
  search?: string;
  dueDate?: Date;
  showCompleted?: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byCategory: Record<string, number>;
  completionRate: number;
} 