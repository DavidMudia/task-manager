import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '../services/api';

export interface ProjectMember {
  id: string;
  role: string;
  joinedAt?: string;
  user: {
    id: string;
    username: string;
    email: string;
    name?: string | null;
    avatarUrl?: string | null;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  color?: string | null;
  coverImage?: string | null;

  visibility:
    | 'private'
    | 'invite-only'
    | 'public';

  maxMembers: number;

  ownerId: string;

  owner?: {
    id: string;
    username: string;
    email: string;
    name?: string | null;
  };

  tasks?: unknown[];
  members?: ProjectMember[];

  createdAt: string;
  updatedAt: string;
}

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } =
        await api.get<Project[]>('/projects');

      return data;
    },
  });
};

export const useCreateProject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (
      newProject: {
        name: string;
        description?: string;
        category?: string;
        color?: string;
        coverImage?: string;
        visibility?:
          | 'private'
          | 'invite-only'
          | 'public';
        maxMembers?: number;
      }
    ) => {
      const { data } =
        await api.post<Project>(
          '/projects',
          newProject
        );

      return data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['projects'],
      });
    },
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Project>;
    }) => {
      const { data } =
        await api.patch<Project>(
          `/projects/${id}`,
          updates
        );

      return data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['projects'],
      });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`);
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['projects'],
      });
    },
  });
};