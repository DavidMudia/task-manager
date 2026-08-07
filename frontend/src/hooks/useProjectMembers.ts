import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface ProjectMember {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    username?: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
}

export function useProjectMembers(
  projectId?: string
) {
  return useQuery({
    queryKey: ['members', projectId],

    queryFn: async () => {
      const { data } =
        await api.get<ProjectMember[]>(
          `/projects/${projectId}/members`
        );

      return data;
    },

    enabled: !!projectId,
  });
}