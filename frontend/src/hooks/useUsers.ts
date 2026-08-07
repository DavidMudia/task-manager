import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<User[]>('/users');
      return data;
    },
  });
};