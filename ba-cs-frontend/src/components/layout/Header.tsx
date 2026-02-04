import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bell, ChevronDown, ChevronRight, LogOut, User, KeyRound, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface HeaderProps {
  onMenuClick: () => void;
}

// Breadcrumb mapping
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  'credit-card': 'Credit Card Requests',
  loan: 'Loan Requests',
  new: 'New Request',
  list: 'All Requests',
  reports: 'Reports',
  users: 'Users',
  settings: 'Settings',
  profile: 'Profile',
};

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to logout');
    }
  };

  // Generate breadcrumb items
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { path, label };
  });

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      {/* Left side - Menu button and breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          onClick={onMenuClick}
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden items-center gap-1 text-sm sm:flex">
          <Link
            to="/dashboard"
            className="text-gray-500 hover:text-[#0D5C73] transition-colors"
          >
            Home
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-gray-900">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-gray-500 hover:text-[#0D5C73] transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right side - Notifications and User menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User dropdown */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-gray-100 transition-colors sm:px-3 sm:py-2">
            {/* Avatar */}
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.employee_name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D5C73] text-xs font-medium text-white">
                {user ? getInitials(user.employee_name) : <User className="h-4 w-4" />}
              </div>
            )}
            {/* User info - hidden on mobile */}
            <div className="hidden text-left sm:block">
              <p className="font-medium text-gray-900">{user?.employee_name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.designation || ''}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </MenuButton>

          <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            {/* User info section */}
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-900">{user?.employee_name}</p>
              <p className="text-xs text-gray-500">{user?.designation}</p>
              <p className="mt-1 text-xs text-[#0D5C73]">{user?.employee_code}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => navigate('/profile')}
                    className={`${
                      focus ? 'bg-gray-50' : ''
                    } flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors`}
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    My Profile
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => navigate('/change-password')}
                    className={`${
                      focus ? 'bg-gray-50' : ''
                    } flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors`}
                  >
                    <KeyRound className="h-4 w-4 text-gray-400" />
                    Change Password
                  </button>
                )}
              </MenuItem>
            </div>

            {/* Logout */}
            <div className="py-1">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      focus ? 'bg-red-50' : ''
                    } flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors`}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </header>
  );
}
