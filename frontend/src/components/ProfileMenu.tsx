import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  LogOut,
  User,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  useAuth,
} from '../contexts/AuthContext';

export function ProfileMenu() {
  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const menuRef =
    useRef<HTMLDivElement | null>(null);

  // ============================================================
  // CLOSE WHEN CLICKING OUTSIDE
  // ============================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      const target =
        event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, [isOpen]);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    setIsOpen(false);

    logout();

    navigate('/login', {
      replace: true,
    });
  };

  // ============================================================
  // PROFILE
  // ============================================================
const handleProfile = () => {
  setIsOpen(false);

  if (user?.id) {
    navigate(`/users/${user.id}`);
  }
};

  // ============================================================
  // AVATAR
  // ============================================================

  const avatarLetter =
    user?.name?.[0] ||
    user?.email?.[0] ||
    'U';

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      ref={menuRef}
      className="relative"
    >

      {/* ======================================================
          AVATAR BUTTON
      ======================================================= */}

      <button
        type="button"
        onClick={() =>
          setIsOpen(
            previous => !previous
          )
        }
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold uppercase text-white ring-2 ring-white/10 transition hover:ring-purple-400/30"
        title="Account menu"
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {avatarLetter}
      </button>

      {/* ======================================================
          DROPDOWN
      ======================================================= */}

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[60] mt-2 w-56 overflow-hidden rounded-2xl border border-[#29293A] bg-[#11111A] shadow-2xl shadow-black/40"
        >

          {/* USER INFORMATION */}

          <div className="border-b border-[#242431] px-4 py-3">

            <p className="truncate text-sm font-semibold text-[#F5F3FF]">
              {user?.name || 'User'}
            </p>

            <p className="mt-0.5 truncate text-xs text-[#717184]">
              {user?.email || ''}
            </p>

          </div>

          {/* ACTIONS */}

          <div className="p-1.5">

            {/* Profile */}

            <button
              type="button"
              role="menuitem"
              onClick={handleProfile}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[#B7B5C6] transition hover:bg-white/5 hover:text-white"
            >
              <User size={17} />

              <span>
                Profile
              </span>
            </button>

            {/* Logout */}

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={17} />

              <span>
                Logout
              </span>
            </button>

          </div>

        </div>
      )}

    </div>
  );
}