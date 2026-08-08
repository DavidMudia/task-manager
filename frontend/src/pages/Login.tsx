import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  Mail,
  Lock,
  ArrowRight,
  UserRound,
} from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await login(email, password);

      navigate('/home', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08070D] p-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute left-[-250px] top-[35%] h-[500px] w-[500px] rounded-full bg-purple-700/5 blur-[140px]" />
        <div className="absolute right-[-250px] top-[65%] h-[500px] w-[500px] rounded-full bg-indigo-700/5 blur-[140px]" />
      </div>

      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 transition-all group-hover:border-violet-400/40 group-hover:bg-violet-500/15">
              <Zap className="h-5 w-5 text-violet-400" />
            </div>

            <span className="text-xl font-semibold tracking-tight text-white">
              TaskFlow
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-[#11111A] rounded-2xl border border-[#242431] p-6 sm:p-8 shadow-2xl">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#F5F3FF]">
              Welcome back
            </h2>

            <p className="text-sm text-[#8E8EA3] mt-1">
              Sign in to continue to your workspace
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#E9E7F2] mb-1.5">
                Email
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#626276]" />
                </div>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A25] border border-[#242431] rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none text-[#F5F3FF] placeholder-[#626276] transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#E9E7F2] mb-1.5">
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#626276]" />
                </div>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A25] border border-[#242431] rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none text-[#F5F3FF] placeholder-[#626276] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-900/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>

          {/* Demo Account */}
          <div className="mt-5 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">

            <div className="flex items-center gap-2 mb-3">
              <UserRound className="h-4 w-4 text-purple-400 shrink-0" />

              <span className="text-sm font-medium text-[#E9E7F2]">
                Demo Visitor Account
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-[#8E8EA3]">
                  Email
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setEmail('visitor@example.com')
                  }
                  className="text-left sm:text-right text-purple-400 hover:text-purple-300 break-all transition-colors"
                >
                  visitor@example.com
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-[#8E8EA3]">
                  Password
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPassword('visitor123')
                  }
                  className="text-left sm:text-right text-purple-400 hover:text-purple-300 transition-colors"
                >
                  visitor123
                </button>
              </div>

            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-[#626276]">
              Click the credentials to automatically fill the login form.
            </p>
          </div>

          {/* Register */}
          <div className="mt-6 text-center text-sm text-[#8E8EA3]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Create one now
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}