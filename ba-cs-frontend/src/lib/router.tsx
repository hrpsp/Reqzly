import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layout components
import MainLayout from '@/components/layout/MainLayout';

// Auth route guards
import { ProtectedRoute, GuestRoute } from '@/components/auth';

// Pages – auth
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

// Pages – main
import Dashboard from '@/pages/Dashboard';

// Pages – credit card
import CreditCardRequestForm from '@/pages/credit-card/CreditCardRequestForm';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },

  // ── Guest-only routes ────────────────────────────────────────────────────
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <Login /> },
    ],
  },

  // ── Protected routes (all authenticated users) ───────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // Dashboard
          { path: '/dashboard', element: <Dashboard /> },

          // Credit Card Requests
          {
            path: '/credit-card/new',
            element: <CreditCardRequestForm mode="create" />,
          },
          {
            path: '/credit-card/:id/edit',
            element: <CreditCardRequestForm mode="edit" />,
          },
          // List + detail pages are placeholders until implemented
          { path: '/credit-card/list', element: <Navigate to="/credit-card/new" replace /> },
          { path: '/credit-card/:id',  element: <Navigate to="/credit-card/list" replace /> },

          // Loan Requests (stubs)
          { path: '/loan/new',  element: <Navigate to="/dashboard" replace /> },
          { path: '/loan/list', element: <Navigate to="/dashboard" replace /> },

          // Other stubs
          { path: '/reports',  element: <Navigate to="/dashboard" replace /> },
          { path: '/users',    element: <Navigate to="/dashboard" replace /> },
          { path: '/settings', element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },

  // ── Misc ─────────────────────────────────────────────────────────────────
  {
    path: '/unauthorized',
    element: (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">403</h1>
          <p className="mt-2 text-lg text-gray-600">Access Denied</p>
          <p className="mt-1 text-sm text-gray-500">
            You don&apos;t have permission to access this resource.
          </p>
        </div>
      </div>
    ),
  },
  { path: '*', element: <NotFound /> },
]);
