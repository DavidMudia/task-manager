import {
  ArrowLeft,
  Calendar,
  Edit3,
  MessageCircle,
  Save,
  User,
} from 'lucide-react';
import {
  useEffect,
  useState,
} from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CompletedProject {
  id: string;
  name: string;
  updatedAt?: string;
  completedAt?: string;
}

interface UserProfileData {
  id: string;
  username: string;
  name?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  completedProjects: CompletedProject[];
  completedProjectsCount: number;
}

export function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] =
    useState<UserProfileData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [name, setName] =
    useState('');

  const [bio, setBio] =
    useState('');

  useEffect(() => {
    if (!id) return;

    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        `/users/${id}`
      );

      const data =
        response.data as UserProfileData;

      setProfile(data);
      setName(data.name || '');
      setBio(data.bio || '');
    } catch (err) {
      console.error(
        'Failed to load user profile:',
        err
      );

      setError(
        'Unable to load this profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;

    try {
      setSaving(true);

      const response =
        await api.patch(
          '/users/profile',
          {
            name,
            bio,
          }
        );

      setProfile((current) =>
        current
          ? {
              ...current,
              ...response.data,
            }
          : current
      );

      setEditing(false);
    } catch (err) {
      console.error(
        'Failed to update profile:',
        err
      );

      setError(
        'Unable to update your profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (
    profileUser: UserProfileData
  ) => {
    return (
      profileUser.name?.[0] ||
      profileUser.username?.[0] ||
      'U'
    ).toUpperCase();
  };

  const isOwnProfile =
    currentUser?.id === profile?.id;

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#09090F] px-6 text-white">
        <div className="text-sm text-[#68677B]">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-[#09090F] px-6 text-center text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <User size={24} />
        </div>

        <h1 className="mt-4 text-lg font-semibold">
          Profile not found
        </h1>

        <p className="mt-2 max-w-sm text-sm text-[#68677B]">
          {error ||
            'This user may no longer exist.'}
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 rounded-xl border border-[#29293A] bg-[#15151F] px-4 py-2.5 text-sm text-white transition hover:bg-white/5"
        >
          <ArrowLeft size={16} />
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#09090F] text-white">

      {/* Header */}

      <header className="sticky top-0 z-20 flex h-16 items-center border-b border-[#242431] bg-[#11111A]/95 px-4 backdrop-blur-xl md:px-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#77768A] transition hover:bg-white/5 hover:text-white"
          title="Go back"
        >
          <ArrowLeft size={19} />
        </button>

        <h1 className="ml-3 text-sm font-semibold text-white">
          Profile
        </h1>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-10">

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Profile Card */}

        <section className="overflow-hidden rounded-2xl border border-[#242431] bg-[#11111A]">

          {/* Banner */}

          <div className="h-28 bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-fuchsia-600/20 md:h-36" />

          {/* Profile Info */}

          <div className="px-5 pb-6 md:px-7">

            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">

              {/* Avatar + identity */}

              <div className="flex items-end gap-4">

                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-[#11111A] bg-gradient-to-br from-indigo-400 to-purple-500 text-2xl font-bold text-white shadow-xl sm:h-28 sm:w-28">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={
                        profile.name ||
                        profile.username
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(profile)
                  )}
                </div>

                <div className="min-w-0 pb-1">

                  <h2 className="truncate text-xl font-bold text-white md:text-2xl">
                    {profile.name ||
                      profile.username}
                  </h2>

                  <p className="truncate text-sm text-[#77768A]">
                    @{profile.username}
                  </p>

                </div>

              </div>

              {/* Actions */}

              <div className="flex gap-2">

                {isOwnProfile ? (
                  editing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setName(
                            profile.name || ''
                          );
                          setBio(
                            profile.bio || ''
                          );
                        }}
                        className="flex items-center gap-2 rounded-xl border border-[#29293A] bg-[#15151F] px-4 py-2.5 text-sm font-medium text-[#C7C4D5] transition hover:bg-white/5"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={saveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Save size={16} />

                        {saving
                          ? 'Saving...'
                          : 'Save'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setEditing(true)
                      }
                      className="flex items-center gap-2 rounded-xl border border-[#29293A] bg-[#15151F] px-4 py-2.5 text-sm font-medium text-[#D8D5E4] transition hover:bg-white/5 hover:text-white"
                    >
                      <Edit3 size={16} />
                      Edit profile
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const response =
                          await api.post(
                            '/chat/conversations',
                            {
                              userId:
                                profile.id,
                            }
                          );

                        navigate(
                          `/inbox/${response.data.id}`
                        );
                      } catch (err) {
                        console.error(
                          'Failed to start conversation:',
                          err
                        );

                        setError(
                          'Unable to start conversation.'
                        );
                      }
                    }}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
                  >
                    <MessageCircle size={16} />
                    Message
                  </button>
                )}

              </div>
            </div>

            {/* Bio */}

            <div className="mt-7">

              {editing ? (
                <div className="space-y-4">

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#88869A]">
                      Name
                    </label>

                    <input
                      value={name}
                      onChange={(event) =>
                        setName(
                          event.target.value
                        )
                      }
                      maxLength={100}
                      className="w-full rounded-xl border border-[#29293A] bg-[#15151F] px-4 py-3 text-sm text-white outline-none placeholder:text-[#5F5E72] focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/10"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#88869A]">
                      Bio
                    </label>

                    <textarea
                      value={bio}
                      onChange={(event) =>
                        setBio(
                          event.target.value
                        )
                      }
                      maxLength={500}
                      rows={4}
                      className="w-full resize-none rounded-xl border border-[#29293A] bg-[#15151F] px-4 py-3 text-sm text-white outline-none placeholder:text-[#5F5E72] focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/10"
                      placeholder="Tell people a little about yourself..."
                    />
                  </div>

                </div>
              ) : (
                <p className="max-w-2xl whitespace-pre-wrap text-sm leading-6 text-[#A09DAF]">
                  {profile.bio ||
                    'No bio yet.'}
                </p>
              )}

            </div>

            {/* Joined */}

            <div className="mt-5 flex items-center gap-2 text-xs text-[#68677B]">
              <Calendar size={14} />

              Joined{' '}
              {new Date(
                profile.createdAt
              ).toLocaleDateString(
                undefined,
                {
                  month: 'long',
                  year: 'numeric',
                }
              )}
            </div>

          </div>
        </section>

        {/* Completed Projects */}

        <section className="mt-6 rounded-2xl border border-[#242431] bg-[#11111A] p-5 md:p-7">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-base font-semibold text-white">
                Completed projects
              </h2>

              <p className="mt-1 text-xs text-[#68677B]">
                Projects completed by this user
              </p>
            </div>

            <div className="rounded-xl bg-purple-500/10 px-3 py-2 text-sm font-semibold text-purple-300">
              {profile.completedProjectsCount}
            </div>

          </div>

          {profile.completedProjects.length ===
          0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-[#29293A] px-5 py-10 text-center">
              <p className="text-sm text-[#77768A]">
                No completed projects yet.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">

              {profile.completedProjects.map(
                (project) => (
                  <Link
                    key={project.id}
                    to={`/project/${project.id}`}
                    className="group rounded-xl border border-[#29293A] bg-[#15151F] p-4 transition hover:border-purple-500/30 hover:bg-purple-500/[0.04]"
                  >
                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-semibold text-white transition group-hover:text-purple-300">
                          {project.name}
                        </h3>

                        <p className="mt-2 text-xs text-[#68677B]">
                          Completed{' '}
                          {new Date(
                            project.completedAt ||
                              project.updatedAt ||
                              ''
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-300">
                        <Calendar size={15} />
                      </div>

                    </div>
                  </Link>
                )
              )}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}