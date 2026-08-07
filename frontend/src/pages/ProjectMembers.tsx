import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { UserPlus, X, Users } from 'lucide-react';

interface Member {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export function ProjectMembers() {
  const { projectId } = useParams<{ projectId: string }>();
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  const { data: members = [], refetch } = useQuery({
    queryKey: ['members', projectId],
    queryFn: async () => {
      const { data } = await api.get<Member[]>(`/projects/${projectId}/members`);
      return data;
    },
    enabled: !!projectId,
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${projectId}/invitations`, { email, role });
      setEmail('');
      setRole('member');
      setShowInvite(false);
      refetch();
    } catch (error) {
      console.error('Failed to send invitation', error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#09090F] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
              <span className="text-xs font-medium uppercase tracking-widest text-purple-400">
                Team
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#F5F3FF]">Members</h2>
            <p className="text-sm text-[#8E8EA3] mt-1">
              {members.length} {members.length === 1 ? 'member' : 'members'} in this project
            </p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm border border-purple-400/20"
          >
            <UserPlus size={18} />
            Invite Member
          </button>
        </div>

        {/* Members List – Dark */}
        <div className="rounded-2xl border border-[#242431] bg-[#11111A] shadow-lg overflow-hidden">
          {members.length === 0 ? (
            <div className="p-8 text-center">
              <Users size={40} className="mx-auto mb-3 text-[#2B2B3B]" />
              <p className="text-[#B7B5C4] font-medium">No members yet</p>
              <p className="text-sm text-[#717184] mt-1">
                Invite your team to collaborate on this project.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#242431]">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 hover:bg-[#171720] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {member.user.name?.[0] || member.user.email[0] || 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-[#E9E7F2] truncate">
                        {member.user.name || member.user.email}
                      </div>
                      <div className="text-sm text-[#8E8EA3] truncate">{member.user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.role === 'owner'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/10'
                        : member.role === 'admin'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/10'
                          : 'bg-[#242431] text-[#8E8EA3] border border-[#2B2B3B]'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite Modal – Dark */}
        {showInvite && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#11111A] rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#242431]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#F5F3FF]">Invite Member</h3>
                <button
                  onClick={() => setShowInvite(false)}
                  className="p-1 rounded-lg text-[#8E8EA3] hover:text-[#F5F3FF] hover:bg-[#242431] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#E9E7F2] mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1A1A25] border border-[#242431] rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none text-[#F5F3FF] placeholder-[#626276] text-sm transition-all"
                    required
                    placeholder="colleague@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#E9E7F2] mb-1">Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1A1A25] border border-[#242431] rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none text-[#F5F3FF] text-sm transition-all"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm font-medium"
                >
                  Send Invitation
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}