import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export interface Attachment {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  userId: string;
  user: { id: string; email: string; name?: string };
}

export const useAttachments = (taskId: string) => {
  return useQuery({
    queryKey: ['attachments', taskId],
    queryFn: async () => {
      const { data } = await api.get<Attachment[]>(`/tasks/${taskId}/attachments`);
      return data;
    },
    enabled: !!taskId,
  });
};

export const useUploadAttachment = (taskId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<Attachment>(`/tasks/${taskId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attachments', taskId] });
    },
  });
};

export const useDeleteAttachment = (taskId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (attachmentId: string) => {
      await api.delete(`/tasks/attachments/${attachmentId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attachments', taskId] });
    },
  });
};