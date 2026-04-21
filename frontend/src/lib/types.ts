export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  _id: string;
  user: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string | null;
  position: number;
  isOverdue?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardData {
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    overdue: number;
    highPriority: number;
  };
  recentTasks: Task[];
}

export interface TaskFormValues {
  title: string;
  description: string;
  priority: Task['priority'];
  status: Task['status'];
  dueDate: string;
}

export interface TaskReorderInput {
  id: string;
  status: Task['status'];
  position: number;
}
