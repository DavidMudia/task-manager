export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ColumnId = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: string;
  online: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  priority: Priority;
  assigneeId: string | null;
  tags: string[];
  createdAt: number;
  dueDate: string | null;
  subtasks: { id: string; text: string; done: boolean }[];
  comments: number;
  attachments: number;
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
  icon: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  taskTitle: string;
  timestamp: number;
  type: 'create' | 'move' | 'assign' | 'comment' | 'complete';
}
