import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useCreateSubtask = (taskId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      const { data } = await api.post<Subtask>(`/tasks/${taskId}/subtasks`, { text });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
};

export const useUpdateSubtask = (taskId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ subtaskId, data }: { subtaskId: string; data: Partial<Subtask> }) => {
      const { data: result } = await api.patch<Subtask>(`/tasks/subtasks/${subtaskId}`, data);
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
};

export const useDeleteSubtask = (taskId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subtaskId: string) => {
      await api.delete(`/tasks/subtasks/${subtaskId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
};