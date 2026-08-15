import React, { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  Zap,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

export function Register() {
  const [username, setUsername] =
    useState('');

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const { register, isLoading } =
    useAuth();

  const navigate = useNavigate();

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');

    // ----------------------------------------------------------
    // Username validation
    // ----------------------------------------------------------

    const trimmedUsername =
      username.trim();

    if (trimmedUsername.length < 3) {
      setError(
        'Username must be at least 3 characters.'
      );

      return;
    }

    if (trimmedUsername.length > 30) {
      setError(
        'Username must not exceed 30 characters.'
      );

      return;
    }

    if (
      !/^[a-zA-Z0-9_]+$/.test(
        trimmedUsername
      )
    ) {
      setError(
        'Username can only contain letters, numbers, and underscores.'
      );

      return;
    }

    // ----------------------------------------------------------
    // Password confirmation
    // ----------------------------------------------------------

    if (password !== confirmPassword) {
      setError(
        'Passwords do not match.'
      );

      return;
    }

    // ----------------------------------------------------------
    // Submit registration
    // ----------------------------------------------------------

    try {
      await register(
        trimmedUsername,
        email.trim(),
        password,
        name.trim()
      );

      navigate('/');
    } catch (error: any) {
      console.error(
        'Registration failed:',
        error
      );

      const backendError =
        error?.response?.data?.error;

      if (backendError) {
        setError(
          extractErrorMessage(
            backendError
          )
        );
      } else {
        setError(
          'Unable to create your account. Please try again.'
        );
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070D] p-4">

      {/* ======================================================
          BACKGROUND GLOW
      ======================================================= */}

      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[150px]" />

        <div className="absolute left-[-250px] top-[35%] h-[500px] w-[500px] rounded-full bg-purple-700/5 blur-[140px]" />

        <div className="absolute right-[-250px] top-[65%] h-[500px] w-[500px] rounded-full bg-indigo-700/5 blur-[140px]" />
      </div>

      <div className="w-full max-w-md">

        {/* ====================================================
            LOGO
        ===================================================== */}

        <div className="mb-8 text-center">

          <Link
            to="/"
            className="group inline-flex items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 transition-all group-hover:border-violet-400/40 group-hover:bg-violet-500/15">
              <Zap className="h-5 w-5 text-violet-400" />
            </div>

            <span className="text-xl font-semibold tracking-tight text-white">
              TaskFlow
            </span>
          </Link>

        </div>

        {/* ====================================================
            REGISTER CARD
        ===================================================== */}

        <div className="rounded-2xl border border-[#242431] bg-[#11111A] p-6 shadow-2xl sm:p-8">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-[#F5F3FF]">
              Create your account
            </h2>

            <p className="mt-1 text-sm text-[#8E8EA3]">
              Start your free workspace today
            </p>

          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

              <AlertCircle
                size={18}
                className="mt-0.5 flex-shrink-0 text-red-400"
              />

              <p className="text-sm leading-5 text-red-300">
                {error}
              </p>

            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================================
                USERNAME
            ================================================== */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-[#E9E7F2]">
                Username
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-[#626276]" />
                </div>

                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                  minLength={3}
                  maxLength={30}
                  autoComplete="username"
                  className="w-full rounded-xl border border-[#242431] bg-[#1A1A25] py-2.5 pl-10 pr-4 text-[#F5F3FF] outline-none transition-all placeholder:text-[#626276] focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/30"
                  placeholder="john_doe"
                />

              </div>

              <p className="mt-1.5 text-xs text-[#626276]">
                Letters, numbers, and underscores only.
              </p>

            </div>

            {/* =================================================
                FULL NAME
            ================================================== */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-[#E9E7F2]">
                Full Name
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-[#626276]" />
                </div>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  autoComplete="name"
                  className="w-full rounded-xl border border-[#242431] bg-[#1A1A25] py-2.5 pl-10 pr-4 text-[#F5F3FF] outline-none transition-all placeholder:text-[#626276] focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/30"
                  placeholder="John Doe"
                />

              </div>

            </div>

            {/* =================================================
                EMAIL
            ================================================== */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-[#E9E7F2]">
                Email
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-[#626276]" />
                </div>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#242431] bg-[#1A1A25] py-2.5 pl-10 pr-4 text-[#F5F3FF] outline-none transition-all placeholder:text-[#626276] focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/30"
                  placeholder="you@example.com"
                />

              </div>

            </div>

            {/* =================================================
                PASSWORD
            ================================================== */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-[#E9E7F2]">
                Password
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-[#626276]" />
                </div>

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#242431] bg-[#1A1A25] py-2.5 pl-10 pr-11 text-[#F5F3FF] outline-none transition-all placeholder:text-[#626276] focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/30"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-[#626276] transition hover:text-white"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>

            {/* =================================================
                CONFIRM PASSWORD
            ================================================== */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-[#E9E7F2]">
                Confirm Password
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-[#626276]" />
                </div>

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#242431] bg-[#1A1A25] py-2.5 pl-10 pr-11 text-[#F5F3FF] outline-none transition-all placeholder:text-[#626276] focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/30"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-[#626276] transition hover:text-white"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirmation password'
                      : 'Show confirmation password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>

            {/* =================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-purple-900/30 transition-all hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Creating account...
                </>
              ) : (
                <>
                  Create account

                  <ArrowRight className="h-4 w-4" />
                </>
              )}

            </button>

          </form>

          {/* ==================================================
              LOGIN LINK
          ================================================== */}

          <div className="mt-6 text-center text-sm text-[#8E8EA3]">

            Already have an account?{' '}

            <Link
              to="/login"
              className="font-medium text-purple-400 transition-colors hover:text-purple-300"
            >
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

// ============================================================
// BACKEND ERROR PARSER
// ============================================================

function extractErrorMessage(
  error: unknown
): string {
  if (typeof error === 'string') {
    try {
      const parsed =
        JSON.parse(error);

      if (Array.isArray(parsed)) {
        return parsed
          .map(
            (item) =>
              item.message
          )
          .filter(Boolean)
          .join('. ');
      }

      return error;
    } catch {
      return error;
    }
  }

  return 'Registration failed. Please try again.';
}