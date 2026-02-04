import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Landmark,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/api';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
  children?: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Credit Card Requests',
    icon: CreditCard,
    children: [
      { name: 'New Request', href: '/credit-card/new', icon: Plus },
      { name: 'All Requests', href: '/credit-card/list', icon: List },
    ],
  },
  {
    name: 'Loan Requests',
    icon: Landmark,
    children: [
      { name: 'New Request', href: '/loan/new', icon: Plus },
      { name: 'All Requests', href: '/loan/list', icon: List },
    ],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    roles: ['admin', 'supervisor'],
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Credit Card Requests', 'Loan Requests']);

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const hasAccess = (roles?: UserRole[]) => {
    if (!roles || roles.length === 0) return true;
    return user?.role && roles.includes(user.role);
  };

  const isActiveLink = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const isParentActive = (children?: { href: string }[]) => {
    if (!children) return false;
    return children.some((child) => isActiveLink(child.href));
  };

  const filteredNavigation = navigation.filter((item) => hasAccess(item.roles));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600/75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0D5C73] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between border-b border-teal-600 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
              <span className="text-lg font-bold text-[#0D5C73]">BA</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">HRPSP</h1>
              <p className="text-xs text-teal-200">Bank Alfalah</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-teal-200 hover:bg-teal-600 hover:text-white lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {filteredNavigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedItems.includes(item.name);
              const isActive = isParentActive(item.children);

              return (
                <div key={item.name}>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.name)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-600 text-white'
                        : 'text-teal-100 hover:bg-teal-600/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-teal-500 pl-4">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                              isActive
                                ? 'bg-teal-500 text-white'
                                : 'text-teal-200 hover:bg-teal-600/50 hover:text-white'
                            }`
                          }
                        >
                          <child.icon className="h-4 w-4" />
                          <span>{child.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.href!}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-teal-100 hover:bg-teal-600/50 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User info at bottom */}
        {user && (
          <div className="border-t border-teal-600 p-4">
            <div className="flex items-center gap-3">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.employee_name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-400"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-sm font-medium text-white ring-2 ring-teal-400">
                  {user.employee_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {user.employee_name}
                </p>
                <p className="truncate text-xs text-teal-200">{user.designation}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
