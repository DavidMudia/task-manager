import {
  Mail,
  User,
  Shield,
  ArrowLeft,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  useAuth,
} from '../contexts/AuthContext';

export function Profile() {
  const {
    user,
  } = useAuth();

  const navigate =
    useNavigate();

  const avatarLetter =
    user?.name?.[0] ||
    user?.email?.[0] ||
    'U';

  return (
    <div className="min-h-full bg-[#09090F] p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-3xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#242431] bg-[#11111A] text-[#77768A] transition hover:bg-[#171720] hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft
              size={17}
            />
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Profile
            </h1>

            <p className="mt-1 text-sm text-[#717184]">
              Manage your account information
            </p>
          </div>

        </div>

        {/* =====================================================
            PROFILE CARD
        ====================================================== */}

        <section className="overflow-hidden rounded-2xl border border-[#242431] bg-[#11111A]">

          {/* Profile banner */}

          <div className="h-28 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-fuchsia-500/10" />

          {/* Profile information */}

          <div className="px-5 pb-6 sm:px-7">

            {/* Avatar */}

            <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#11111A] bg-gradient-to-br from-indigo-400 to-purple-500 text-2xl font-bold uppercase text-white shadow-xl">
              {avatarLetter}
            </div>

            {/* Name */}

            <div className="mt-4">

              <h2 className="text-xl font-semibold text-white">
                {user?.name ||
                  'User'}
              </h2>

              <p className="mt-1 text-sm text-[#717184]">
                {user?.email}
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            ACCOUNT INFORMATION
        ====================================================== */}

        <section className="mt-4 overflow-hidden rounded-2xl border border-[#242431] bg-[#11111A]">

          <div className="border-b border-[#242431] px-5 py-4 sm:px-6">

            <h2 className="text-sm font-semibold text-white">
              Account information
            </h2>

            <p className="mt-1 text-xs text-[#717184]">
              Information associated with your TaskFlow account
            </p>

          </div>

          <div className="divide-y divide-[#242431]">

            {/* Name */}

            <div className="flex items-center gap-4 px-5 py-4 sm:px-6">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <User
                  size={18}
                />
              </div>

              <div className="min-w-0">

                <p className="text-xs text-[#626276]">
                  Name
                </p>

                <p className="mt-0.5 truncate text-sm text-[#E9E7F2]">
                  {user?.name ||
                    'Not provided'}
                </p>

              </div>

            </div>

            {/* Email */}

            <div className="flex items-center gap-4 px-5 py-4 sm:px-6">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Mail
                  size={18}
                />
              </div>

              <div className="min-w-0">

                <p className="text-xs text-[#626276]">
                  Email
                </p>

                <p className="mt-0.5 truncate text-sm text-[#E9E7F2]">
                  {user?.email ||
                    'Not provided'}
                </p>

              </div>

            </div>

            {/* Account status */}

            <div className="flex items-center gap-4 px-5 py-4 sm:px-6">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <Shield
                  size={18}
                />
              </div>

              <div className="min-w-0">

                <p className="text-xs text-[#626276]">
                  Account status
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-green-400" />

                  <p className="text-sm text-[#E9E7F2]">
                    Active
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}