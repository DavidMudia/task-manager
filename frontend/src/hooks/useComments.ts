import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: { id: string; email: string; name?: string };
  parentId: string | null;
  replies: Comment[];
}

export const useComments = (taskId: string) => {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const { data } = await api.get<Comment[]>(`/tasks/${taskId}/comments`);
      return data;
    },
    enabled: !!taskId,
  });
};

export const useCreateComment = (taskId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      const { data } = await api.post<Comment>(`/tasks/${taskId}/comments`, { content, parentId });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });
};

export const useUpdateComment = (taskId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const { data } = await api.patch<Comment>(`/tasks/comments/${commentId}`, { content });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });
};

export const useDeleteComment = (taskId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      await api.delete(`/tasks/comments/${commentId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });
};