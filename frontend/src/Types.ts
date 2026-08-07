export type Priority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type ColumnId =
  | 'backlog'
  | 'todo'
  | 'in-progress'
  | 'review'
  | 'done';

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: ColumnId;
  priority: Priority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt?: string;
  projectId: string;
  assignees: User[];
  tags?: string[];
  subtasks?: Subtask[];
  comments?: number;
  attachments?: number;
}

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
  icon: string;
}

export interface TeamMember extends User {}

export interface Activity {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  user: User;
  task?: Task;
}