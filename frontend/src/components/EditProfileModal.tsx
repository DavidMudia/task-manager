import {
  ImagePlus,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api';

interface EditProfileModalProps {
  user: any;
  onClose: () => void;
  onUpdated: (user: any) => void;
}

export function EditProfileModal({
  user,
  onClose,
  onUpdated,
}: EditProfileModalProps) {
  const [name, setName] =
    useState(user.name || '');

  const [bio, setBio] =
    useState(user.bio || '');

  const [avatar, setAvatar] =
    useState<File | null>(null);

  const [saving, setSaving] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setSaving(true);

      const profileResponse =
        await api.patch(
          '/users/profile',
          {
            name,
            bio,
          }
        );

      let updatedUser =
        profileResponse.data;

      if (avatar) {
        const formData =
          new FormData();

        formData.append(
          'avatar',
          avatar
        );

        const avatarResponse =
          await api.post(
            '/users/profile/avatar',
            formData,
            {
              headers: {
                'Content-Type':
                  'multipart/form-data',
              },
            }
          );

        updatedUser =
          avatarResponse.data;
      }

      onUpdated(updatedUser);
    } catch (error) {
      console.error(
        'Failed to update profile:',
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#29293A] bg-[#11111A] shadow-2xl">

        <div className="flex items-center justify-between border-b border-[#242431] px-5 py-4">
          <h2 className="text-sm font-semibold text-white">
            Edit Profile
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#68677B] hover:bg-white/5 hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >
          <div>
            <label className="mb-2 block text-xs font-medium text-[#85859A]">
              Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={100}
              className="w-full rounded-xl border border-[#29293A] bg-[#15151F] px-3 py-2.5 text-sm text-white outline-none focus:border-purple-500/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-[#85859A]">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(event) =>
                setBio(event.target.value)
              }
              maxLength={500}
              rows={4}
              placeholder="Tell people a little about yourself..."
              className="w-full resize-none rounded-xl border border-[#29293A] bg-[#15151F] px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#5F5E72] focus:border-purple-500/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-[#85859A]">
              Profile picture
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#343348] bg-[#15151F] p-4 transition hover:border-purple-500/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                <ImagePlus size={18} />
              </div>

              <div>
                <p className="text-xs font-medium text-white">
                  Choose image
                </p>

                <p className="mt-1 text-[10px] text-[#68677B]">
                  Maximum 10MB
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  setAvatar(
                    event.target.files?.[0] ||
                      null
                  )
                }
              />
            </label>

            {avatar && (
              <p className="mt-2 text-[10px] text-purple-300">
                {avatar.name}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#343348] px-4 py-2.5 text-xs font-medium text-[#B4B1C1] hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}