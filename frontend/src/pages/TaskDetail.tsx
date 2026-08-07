import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useCreateSubtask, useUpdateSubtask, useDeleteSubtask } from '../hooks/useSubtasks';
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from '../hooks/useComments';
import { useAttachments, useUploadAttachment, useDeleteAttachment } from '../hooks/useAttachments';
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, User, Paperclip, MessageSquare, CheckSquare, Plus, Trash2, Download } from 'lucide-react';
import type { Task } from '../Types';
import MDEditor from '@uiw/react-md-editor';

export function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const { data: task, isLoading } = useQuery({
    queryKey: ['tasks', taskId],
    queryFn: async () => {
      const { data } = await api.get<Task>(`/tasks/${taskId}`);
      return data;
    },
    enabled: !!taskId,
  });

  if (isLoading || !task) return <div className="flex-1 flex items-center justify-center">Loading task...</div>;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <TaskHeader task={task} />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TaskDescription task={task} />
            <TaskSubtasks taskId={task.id} />
            <TaskComments taskId={task.id} />
            <TaskAttachments taskId={task.id} />
          </div>
          <div className="space-y-6">
            <TaskActivity taskId={task.id} projectId={task.projectId} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Subcomponents ----

function TaskHeader({ task }: { task: Task }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
      <div className="flex flex-wrap items-center gap-4 mt-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
          task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
          task.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {task.priority}
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
          {task.status}
        </span>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar size={14} />
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </span>
        )}
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <User size={14} />
          {task.assignees.length > 0 ? task.assignees.map(u => u.name || u.email).join(', ') : 'Unassigned'}
        </div>
      </div>
    </div>
  );
}

function TaskDescription({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.description || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch(`/tasks/${task.id}`, { description });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update description', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Description</h3>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-sm text-indigo-600 hover:text-indigo-700">
            Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-3">
          <MDEditor value={description} onChange={setDescription as any} preview="edit" height={200} />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setIsEditing(false); setDescription(task.description || ''); }}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="prose prose-sm max-w-none">
          {task.description ? <MDEditor.Markdown source={task.description} /> : <p className="text-gray-400">No description yet.</p>}
        </div>
      )}
    </div>
  );
}

function TaskSubtasks({ taskId }: { taskId: string }) {
  const { data: subtasks = [] } = useQuery({
    queryKey: ['subtasks', taskId],
    queryFn: async () => {
      const { data } = await api.get(`/tasks/${taskId}/subtasks`);
      return data;
    },
    enabled: !!taskId,
  });
  const createSubtask = useCreateSubtask(taskId);
  const updateSubtask = useUpdateSubtask(taskId);
  const deleteSubtask = useDeleteSubtask(taskId);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const handleAdd = async () => {
    if (!newSubtaskText.trim()) return;
    await createSubtask.mutateAsync(newSubtaskText.trim());
    setNewSubtaskText('');
  };

  const toggleDone = (subtaskId: string, done: boolean) => {
    updateSubtask.mutate({ subtaskId, data: { done: !done } });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <CheckSquare size={18} />
        Subtasks
        <span className="text-sm font-normal text-gray-400 ml-2">
          {subtasks.filter((s: any) => s.done).length} / {subtasks.length} done
        </span>
      </h3>
      <div className="mt-4 space-y-2">
        {subtasks.map((sub: any) => (
          <div key={sub.id} className="flex items-center gap-2 group">
            <button
              onClick={() => toggleDone(sub.id, sub.done)}
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                sub.done ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {sub.done && <CheckSquare size={12} className="text-white" />}
            </button>
            <span className={`text-sm flex-1 ${sub.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {sub.text}
            </span>
            <button
              onClick={() => deleteSubtask.mutate(sub.id)}
              className="text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={newSubtaskText}
            onChange={e => setNewSubtaskText(e.target.value)}
            placeholder="Add subtask..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskComments({ taskId }: { taskId: string }) {
  const { data: comments = [] } = useComments(taskId);
  const createComment = useCreateComment(taskId);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleAddComment = async (parentId?: string) => {
    if (!newComment.trim()) return;
    await createComment.mutateAsync({ content: newComment.trim(), parentId });
    setNewComment('');
    setReplyTo(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <MessageSquare size={18} />
        Comments ({comments.length})
      </h3>
      <div className="mt-4 space-y-4">
        {comments.map((comment: any) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            taskId={taskId}
            onReply={(parentId: string) => { setReplyTo(parentId); }}
            replyingTo={replyTo}
            newComment={newComment}
            setNewComment={setNewComment}
            onAddComment={handleAddComment}
          />
        ))}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            onKeyDown={e => e.key === 'Enter' && handleAddComment()}
          />
          <button
            onClick={() => handleAddComment()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment, taskId, onReply, replyingTo, newComment, setNewComment, onAddComment }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { mutate: updateComment } = useUpdateComment(taskId);
  const { mutate: deleteComment } = useDeleteComment(taskId);

  const handleUpdate = async () => {
    await updateComment({ commentId: comment.id, content: editContent });
    setIsEditing(false);
  };

  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
          {comment.user.name?.[0] || comment.user.email[0] || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-900">{comment.user.name || comment.user.email}</span>
            <span className="text-xs text-gray-400">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
          </div>
          {isEditing ? (
            <div className="mt-1 space-y-2">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={2}
              />
              <div className="flex gap-2">
                <button onClick={handleUpdate} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="px-3 py-1 border border-gray-300 rounded-lg text-xs font-medium">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
          )}
          <div className="flex items-center gap-3 mt-1">
            <button onClick={() => onReply(comment.id)} className="text-xs text-gray-400 hover:text-indigo-600 transition-all">
              Reply
            </button>
            <button onClick={() => setIsEditing(true)} className="text-xs text-gray-400 hover:text-indigo-600 transition-all">
              Edit
            </button>
            <button onClick={() => deleteComment(comment.id)} className="text-xs text-red-400 hover:text-red-600 transition-all">
              Delete
            </button>
          </div>
          {replyingTo === comment.id && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                onKeyDown={e => e.key === 'Enter' && onAddComment(comment.id)}
              />
              <button onClick={() => onAddComment(comment.id)} className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm">
                Reply
              </button>
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-8 mt-3 space-y-3">
              {comment.replies.map((reply: any) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  taskId={taskId}
                  onReply={onReply}
                  replyingTo={replyingTo}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  onAddComment={onAddComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskAttachments({ taskId }: { taskId: string }) {
  const { data: attachments = [] } = useAttachments(taskId);
  const uploadAttachment = useUploadAttachment(taskId);
  const deleteAttachment = useDeleteAttachment(taskId);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAttachment.mutateAsync(file);
    e.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Paperclip size={18} />
        Attachments ({attachments.length})
      </h3>
      <div className="mt-4 space-y-2">
        {attachments.map((att: any) => (
          <div key={att.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-3">
              <div className="text-gray-400">
                <Paperclip size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{att.filename}</div>
                <div className="text-xs text-gray-400">{formatFileSize(att.fileSize)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                <Download size={16} />
              </a>
              <button onClick={() => deleteAttachment.mutate(att.id)} className="text-gray-300 hover:text-red-500 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        <div className="mt-2">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all cursor-pointer text-sm font-medium">
            <Plus size={16} />
            Upload File
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}

function TaskActivity({ taskId, projectId }: { taskId: string; projectId: string }) {
  const { data: activities = [] } = useQuery({
    queryKey: ['activities', projectId],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${projectId}/activities`);
      return data;
    },
    enabled: !!projectId,
  });
  const taskActivities = activities.filter((a: any) => a.taskId === taskId);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
      <div className="mt-4 space-y-3">
        {taskActivities.length === 0 ? (
          <p className="text-sm text-gray-400">No activity yet</p>
        ) : (
          taskActivities.map((activity: any) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0">
                {activity.user.name?.[0] || activity.user.email[0] || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-700">{activity.message}</p>
                <p className="text-[10px] text-gray-400">{format(new Date(activity.createdAt), 'MMM d, h:mm a')}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}