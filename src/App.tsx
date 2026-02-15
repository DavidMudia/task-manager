import { useState } from 'react';
import {
  LayoutDashboard, Search, Bell, Plus, ChevronRight, Settings, Zap,
  PanelRightOpen, PanelRightClose, Filter, Users, Activity
} from 'lucide-react';
import type { ColumnId, Column as ColumnType } from './Types';
import { useTaskStore } from './hooks/useTaskStore';
import { Column } from './Components/Column';
import { TaskModal } from './Components/TaskModal';
import { TeamSidebar } from './Components/TeamSidebar';
import { ActivityFeed } from './Components/ActivityFeed';

const COLUMNS: ColumnType[] = [
  { id: 'backlog', title: 'Backlog', color: '#94a3b8', icon: '📋' },
  { id: 'todo', title: 'To Do', color: '#6366f1', icon: '📌' },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b', icon: '🔨' },
  { id: 'review', title: 'Review', color: '#8b5cf6', icon: '🔍' },
  { id: 'done', title: 'Done', color: '#10b981', icon: '✅' },
];

export function App() {
  const store = useTaskStore();
  const [showModal, setShowModal] = useState(false);
  const [modalColumnId, setModalColumnId] = useState<ColumnId>('todo');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'team' | 'activity'>('team');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleAddTask = (columnId: ColumnId) => {
    setModalColumnId(columnId);
    setShowModal(true);
  };

  const filteredTasks = store.tasks.filter(task => {
    const matchesSearch = searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getFilteredTasksByColumn = (columnId: ColumnId) => {
    return filteredTasks.filter(t => t.columnId === columnId);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar - Navigation */}
      <aside className="w-16 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center py-5 gap-6 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Zap className="text-white" size={22} />
        </div>
        <nav className="flex flex-col items-center gap-2 mt-4">
          <button className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all" title="Dashboard">
            <LayoutDashboard size={20} />
          </button>
          <button className="w-10 h-10 rounded-xl text-slate-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all" title="Team">
            <Users size={20} />
          </button>
          <button className="w-10 h-10 rounded-xl text-slate-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all" title="Activity">
            <Activity size={20} />
          </button>
          <button className="w-10 h-10 rounded-xl text-slate-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all" title="Settings">
            <Settings size={20} />
          </button>
        </nav>
        <div className="mt-auto">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/20">
            SC
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900">TaskFlow</h1>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-sm text-gray-500 font-medium">Sprint 24</span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Active</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-9 pr-4 py-2 w-56 rounded-xl bg-gray-50 border border-gray-100 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl border transition-all ${filterPriority !== 'all'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    : 'border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                  }`}
              >
                <Filter size={18} />
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-40">
                  <p className="px-3 py-1 text-xs font-bold text-gray-400 uppercase">Priority</p>
                  {['all', 'urgent', 'high', 'medium', 'low'].map(p => (
                    <button
                      key={p}
                      onClick={() => { setFilterPriority(p); setShowFilters(false); }}
                      className={`w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 transition-colors ${filterPriority === p ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-gray-600'
                        }`}
                    >
                      {p === 'all' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                <Bell size={18} />
              </button>
              {store.notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">
                  {store.notifications.length}
                </span>
              )}
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => handleAddTask('todo')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>

            {/* Toggle Right Panel */}
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all"
            >
              {showRightPanel ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
            </button>
          </div>
        </header>

        {/* Board & Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Kanban Board */}
          <div className="flex-1 overflow-x-auto p-6">
            <div className="flex gap-4 h-full">
              {COLUMNS.map(col => (
                <Column
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  color={col.color}
                  icon={col.icon}
                  tasks={getFilteredTasksByColumn(col.id)}
                  getMember={store.getMember}
                  onMoveTask={store.moveTask}
                  onToggleSubtask={store.toggleSubtask}
                  onDeleteTask={store.deleteTask}
                  onAddTask={handleAddTask}
                />
              ))}
            </div>
          </div>

          {/* Right Panel */}
          {showRightPanel && (
            <aside className="w-80 bg-white border-l border-gray-100 flex flex-col flex-shrink-0 overflow-hidden">
              {/* Panel Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setRightPanelTab('team')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${rightPanelTab === 'team'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  <Users size={16} />
                  Team
                </button>
                <button
                  onClick={() => setRightPanelTab('activity')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 relative ${rightPanelTab === 'activity'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  <Activity size={16} />
                  Activity
                  {store.activities.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  )}
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {rightPanelTab === 'team' ? (
                  <TeamSidebar teamMembers={store.teamMembers} tasks={store.tasks} />
                ) : (
                  <ActivityFeed activities={store.activities} getMember={store.getMember} />
                )}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Notifications Toast */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {store.notifications.map((msg, i) => (
          <div
            key={`${msg}-${i}`}
            className="px-4 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium shadow-2xl animate-slide-up max-w-xs"
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          columnId={modalColumnId}
          teamMembers={store.teamMembers}
          onClose={() => setShowModal(false)}
          onSubmit={store.addTask}
        />
      )}
    </div>
  );
}