import { useState, useCallback, useRef, useEffect } from 'react';
import type { Task, TeamMember, Activity, ColumnId } from '../types';

const TEAM_MEMBERS: TeamMember[] = [
  { id: 'u1', name: 'Sarah Chen', avatar: 'SC', color: '#6366f1', role: 'Project Lead', online: true },
  { id: 'u2', name: 'Alex Rivera', avatar: 'AR', color: '#ec4899', role: 'Frontend Dev', online: true },
  { id: 'u3', name: 'Jordan Park', avatar: 'JP', color: '#f59e0b', role: 'Backend Dev', online: false },
  { id: 'u4', name: 'Morgan Lee', avatar: 'ML', color: '#10b981', role: 'Designer', online: true },
  { id: 'u5', name: 'Casey Kim', avatar: 'CK', color: '#8b5cf6', role: 'QA Engineer', online: false },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't1', title: 'Design new onboarding flow', description: 'Create wireframes and high-fidelity mockups for the new user onboarding experience.',
    columnId: 'in-progress', priority: 'high', assigneeId: 'u4', tags: ['design', 'ux'],
    createdAt: Date.now() - 86400000 * 2, dueDate: '2025-02-15',
    subtasks: [{ id: 's1', text: 'Research competitors', done: true }, { id: 's2', text: 'Wireframes', done: true }, { id: 's3', text: 'Hi-fi mockups', done: false }],
    comments: 5, attachments: 3,
  },
  {
    id: 't2', title: 'Implement user authentication', description: 'Set up OAuth 2.0 authentication with Google and GitHub providers.',
    columnId: 'todo', priority: 'urgent', assigneeId: 'u3', tags: ['backend', 'security'],
    createdAt: Date.now() - 86400000, dueDate: '2025-02-10',
    subtasks: [{ id: 's4', text: 'Google OAuth', done: false }, { id: 's5', text: 'GitHub OAuth', done: false }],
    comments: 2, attachments: 1,
  },
  {
    id: 't3', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment.',
    columnId: 'review', priority: 'medium', assigneeId: 'u2', tags: ['devops'],
    createdAt: Date.now() - 86400000 * 3, dueDate: '2025-02-12',
    subtasks: [{ id: 's6', text: 'Configure Actions', done: true }, { id: 's7', text: 'Add tests', done: true }, { id: 's8', text: 'Deploy script', done: false }],
    comments: 8, attachments: 0,
  },
  {
    id: 't4', title: 'Write API documentation', description: 'Document all REST API endpoints with request/response examples.',
    columnId: 'backlog', priority: 'low', assigneeId: null, tags: ['docs'],
    createdAt: Date.now() - 86400000 * 5, dueDate: null,
    subtasks: [], comments: 1, attachments: 2,
  },
  {
    id: 't5', title: 'Optimize database queries', description: 'Review and optimize slow-running SQL queries identified in monitoring.',
    columnId: 'todo', priority: 'high', assigneeId: 'u3', tags: ['backend', 'performance'],
    createdAt: Date.now() - 86400000 * 1, dueDate: '2025-02-14',
    subtasks: [{ id: 's9', text: 'Identify slow queries', done: true }, { id: 's10', text: 'Add indexes', done: false }],
    comments: 3, attachments: 1,
  },
  {
    id: 't6', title: 'Create component library', description: 'Build a reusable React component library with Storybook documentation.',
    columnId: 'in-progress', priority: 'medium', assigneeId: 'u2', tags: ['frontend', 'design-system'],
    createdAt: Date.now() - 86400000 * 4, dueDate: '2025-02-20',
    subtasks: [{ id: 's11', text: 'Button components', done: true }, { id: 's12', text: 'Form components', done: false }, { id: 's13', text: 'Layout components', done: false }],
    comments: 6, attachments: 4,
  },
  {
    id: 't7', title: 'User feedback survey', description: 'Create and distribute a user satisfaction survey to gather product insights.',
    columnId: 'done', priority: 'low', assigneeId: 'u1', tags: ['research'],
    createdAt: Date.now() - 86400000 * 7, dueDate: '2025-02-05',
    subtasks: [{ id: 's14', text: 'Draft questions', done: true }, { id: 's15', text: 'Send survey', done: true }],
    comments: 4, attachments: 1,
  },
  {
    id: 't8', title: 'Fix mobile responsive issues', description: 'Address layout breaks on screens smaller than 768px.',
    columnId: 'backlog', priority: 'medium', assigneeId: 'u2', tags: ['frontend', 'bug'],
    createdAt: Date.now() - 86400000 * 2, dueDate: null,
    subtasks: [], comments: 2, attachments: 2,
  },
  {
    id: 't9', title: 'Security audit', description: 'Perform a comprehensive security review of the application.',
    columnId: 'todo', priority: 'urgent', assigneeId: 'u5', tags: ['security'],
    createdAt: Date.now() - 86400000, dueDate: '2025-02-08',
    subtasks: [{ id: 's16', text: 'Dependency scan', done: false }, { id: 's17', text: 'Penetration testing', done: false }],
    comments: 0, attachments: 0,
  },
  {
    id: 't10', title: 'Dashboard analytics widgets', description: 'Build interactive chart widgets for the admin dashboard.',
    columnId: 'backlog', priority: 'medium', assigneeId: null, tags: ['frontend', 'analytics'],
    createdAt: Date.now() - 86400000 * 6, dueDate: null,
    subtasks: [], comments: 1, attachments: 0,
  },
];

let idCounter = 100;
const genId = () => `t${++idCounter}`;
const genActivityId = () => `a${++idCounter}`;

const SIMULATED_ACTIONS: { action: string; type: Activity['type'] }[] = [
  { action: 'commented on', type: 'comment' },
  { action: 'updated priority on', type: 'move' },
  { action: 'attached a file to', type: 'comment' },
  { action: 'mentioned you in', type: 'comment' },
];

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [teamMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [notifications, setNotifications] = useState<string[]>([]);
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const addActivity = useCallback((userId: string, action: string, taskTitle: string, type: Activity['type']) => {
    const activity: Activity = {
      id: genActivityId(),
      userId,
      action,
      taskTitle,
      timestamp: Date.now(),
      type,
    };
    setActivities(prev => [activity, ...prev].slice(0, 50));
  }, []);

  const addNotification = useCallback((msg: string) => {
    setNotifications(prev => [msg, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(0, -1));
    }, 4000);
  }, []);

  // Simulate real-time updates from team members
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTasks = tasksRef.current;
      if (currentTasks.length === 0) return;
      const randomMember = TEAM_MEMBERS[Math.floor(Math.random() * TEAM_MEMBERS.length)];
      const randomTask = currentTasks[Math.floor(Math.random() * currentTasks.length)];
      const randomAction = SIMULATED_ACTIONS[Math.floor(Math.random() * SIMULATED_ACTIONS.length)];

      addActivity(randomMember.id, randomAction.action, randomTask.title, randomAction.type);
    }, 8000);
    return () => clearInterval(interval);
  }, [addActivity]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'comments' | 'attachments'>) => {
    const newTask: Task = {
      ...task,
      id: genId(),
      createdAt: Date.now(),
      comments: 0,
      attachments: 0,
    };
    setTasks(prev => [...prev, newTask]);
    addActivity('u1', 'created', newTask.title, 'create');
    addNotification(`Task "${newTask.title}" created`);
    return newTask;
  }, [addActivity, addNotification]);

  const moveTask = useCallback((taskId: string, targetColumn: ColumnId) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (!task || task.columnId === targetColumn) return prev;
      addActivity('u1', `moved to ${targetColumn}`, task.title, 'move');
      if (targetColumn === 'done') {
        addNotification(`🎉 Task "${task.title}" completed!`);
      }
      return prev.map(t => t.id === taskId ? { ...t, columnId: targetColumn } : t);
    });
  }, [addActivity, addNotification]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task) {
        addActivity('u1', 'deleted', task.title, 'move');
        addNotification(`Task "${task.title}" deleted`);
      }
      return prev.filter(t => t.id !== taskId);
    });
  }, [addActivity, addNotification]);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, done: !s.done } : s),
      };
    }));
  }, []);

  const getTasksByColumn = useCallback((columnId: ColumnId) => {
    return tasks.filter(t => t.columnId === columnId);
  }, [tasks]);

  const getMember = useCallback((id: string | null) => {
    return teamMembers.find(m => m.id === id) || null;
  }, [teamMembers]);

  return {
    tasks, activities, teamMembers, notifications,
    addTask, moveTask, updateTask, deleteTask, toggleSubtask,
    getTasksByColumn, getMember,
  };
}