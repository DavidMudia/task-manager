import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { NotificationBell } from '../components/NotificationBell';

import {
  Zap,
  House,
  LayoutDashboard,
  Users,
  MessageCircle,
  LogOut,
  Search,
  UserPlus,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import { api } from '../services/api';

export function MainLayout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  const [
    unreadMessages,
    setUnreadMessages,
  ] = useState(0);

  // ============================================================
  // LOAD UNREAD CHAT MESSAGES
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadUnreadMessages = async () => {
      try {
        const response =
          await api.get(
            '/chat/conversations'
          );

        const conversations =
          response.data || [];

        const totalUnread =
          conversations.reduce(
            (
              total: number,
              conversation: any
            ) =>
              total +
              (conversation.unreadCount ||
                0),
            0
          );

        if (mounted) {
          setUnreadMessages(
            totalUnread
          );
        }
      } catch (error) {
        console.error(
          'Failed to load unread messages:',
          error
        );
      }
    };

    loadUnreadMessages();

    const interval =
      window.setInterval(
        loadUnreadMessages,
        10000
      );

    return () => {
      mounted = false;

      window.clearInterval(
        interval
      );
    };
  }, []);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    logout();

    navigate('/', {
      replace: true,
    });
  };

  // ============================================================
  // ROUTE HELPERS
  // ============================================================

  const isActive = (
    path: string
  ) => {
    return (
      location.pathname === path ||
      location.pathname === `${path}/`
    );
  };

  const isProjectPage =
    location.pathname.startsWith(
      '/project/'
    );

  const isUsersPage =
    location.pathname.startsWith(
      '/users'
    ) ||
    location.pathname.startsWith(
      '/user/'
    );

  const isInboxPage =
    location.pathname.startsWith(
      '/inbox'
    ) ||
    location.pathname.startsWith(
      '/conversation/'
    );

  const isInvitationsPage =
    location.pathname.startsWith(
      '/invitations'
    );

  const isDashboard =
    isActive('/dashboard') ||
    isProjectPage;

  const isHome =
    isActive('/home');

  // ============================================================
  // NAVIGATION
  // ============================================================

  const navigationItems = [
    {
      label: 'Home',
      path: '/home',
      icon: House,
      active: isHome,
      badge: 0,
    },

    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      active: isDashboard,
      badge: 0,
    },

    {
      label: 'Users',
      path: '/users',
      icon: Users,
      active: isUsersPage,
      badge: 0,
    },

    {
      label: 'Inbox',
      path: '/inbox',
      icon: MessageCircle,
      active: isInboxPage,
      badge: unreadMessages,
    },

    {
      label: 'Invitations',
      path: '/invitations',
      icon: UserPlus,
      active: isInvitationsPage,
      badge: 0,
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090F]">

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside className="hidden w-16 flex-shrink-0 flex-col items-center border-r border-[#242431] bg-[#0E0E16] py-5 lg:flex">

        {/* Logo */}

        <Link
          to="/home"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-900/30 transition hover:scale-105"
          title="TaskFlow Home"
        >
          <Zap
            className="text-white"
            size={21}
          />
        </Link>

        {/* Navigation */}

        <nav className="mt-8 flex flex-col items-center gap-2">

          {navigationItems.map(
            item => {
              const Icon =
                item.icon;

              return (
                <Link
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    item.active
                      ? 'bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/20'
                      : 'text-[#77768A] hover:bg-white/5 hover:text-white'
                  }`}
                  title={
                    item.label
                  }
                >

                  <div className="relative">

                    <Icon
                      size={19}
                    />

                    {item.badge >
                      0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-600 px-1 text-[9px] font-bold text-white">
                        {item.badge >
                        99
                          ? '99+'
                          : item.badge}
                      </span>
                    )}

                  </div>

                </Link>
              );
            }
          )}

        </nav>

        {/* Bottom */}

        <div className="mt-auto flex flex-col items-center gap-4">

          {/* Logout */}

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#77768A] transition hover:bg-red-500/10 hover:text-red-400"
            title="Logout"
          >
            <LogOut
              size={19}
            />
          </button>

          {/* Avatar */}

          <button
            type="button"
            onClick={() =>
              navigate(
                '/dashboard'
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white ring-2 ring-white/10 transition hover:ring-purple-400/30"
            title={
              user?.name ||
              user?.email ||
              'User'
            }
          >
            {user?.name?.[0] ||
              user?.email?.[0] ||
              'U'}
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN APPLICATION
      ====================================================== */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-[#242431] bg-[#11111A]/90 px-4 backdrop-blur-xl md:px-6">

          {/* Brand */}

          <div className="flex items-center">

            <Link
              to="/home"
              className="flex items-center gap-2"
            >

              <Zap
                className="h-5 w-5 text-purple-400"
              />

              <h1 className="text-lg font-bold tracking-tight text-[#F5F3FF]">

                <span className="hidden sm:inline">
                  TaskFlow
                </span>

                <span className="sm:hidden">
                  TF
                </span>

              </h1>

            </Link>

          </div>

          {/* Right Header */}

          <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">

            {/* Search */}

            <div className="relative hidden max-w-xs sm:block">

              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717184]"
                size={17}
              />

              <input
                type="text"
                value={
                  searchQuery
                }
                onChange={event =>
                  setSearchQuery(
                    event.target
                      .value
                  )
                }
                placeholder="Search..."
                className="w-48 rounded-xl border border-[#242431] bg-[#1A1A25] py-2 pl-10 pr-4 text-sm text-[#E9E7F2] outline-none transition placeholder:text-[#626276] focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/10 md:w-64"
              />

            </div>

            {/* Notifications */}

            <NotificationBell />

            {/* Mobile Avatar */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/dashboard'
                )
              }
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white ring-2 ring-white/10 transition hover:ring-purple-400/30"
              title="Open dashboard"
            >
              {user?.name?.[0] ||
                user?.email?.[0] ||
                'U'}
            </button>

          </div>

        </header>

        {/* ===================================================
            CONTENT
        ==================================================== */}

        <main className="min-h-0 flex-1 overflow-y-auto pb-20 lg:pb-0">
          <Outlet />
        </main>

      </div>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#29293A] bg-[#0E0E16]/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden">

        <div className="mx-auto flex h-16 max-w-md items-center justify-around">

          {navigationItems.map(
            item => {
              const Icon =
                item.icon;

              return (
                <Link
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                  className={`flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition ${
                    item.active
                      ? 'text-purple-300'
                      : 'text-[#68677B] hover:text-white'
                  }`}
                >

                  {/* Active indicator */}

                  <div
                    className={`relative flex h-8 w-10 items-center justify-center rounded-xl transition ${
                      item.active
                        ? 'bg-purple-500/15'
                        : ''
                    }`}
                  >

                    <Icon
                      size={19}
                      strokeWidth={
                        item.active
                          ? 2.3
                          : 1.8
                      }
                    />

                    {item.badge >
                      0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-600 px-1 text-[9px] font-bold text-white ring-2 ring-[#0E0E16]">
                        {item.badge >
                        99
                          ? '99+'
                          : item.badge}
                      </span>
                    )}

                  </div>

                  <span
                    className={`text-[10px] font-medium ${
                      item.active
                        ? 'text-purple-300'
                        : 'text-[#68677B]'
                    }`}
                  >
                    {
                      item.label
                    }
                  </span>

                </Link>
              );
            }
          )}

        </div>

      </nav>

    </div>
  );
}