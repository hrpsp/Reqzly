import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layout components
import MainLayout from '@/components/layout/MainLayout';

// Auth route guards
import { ProtectedRoute, GuestRoute } from '@/components/auth';

// Pages
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  // Guest routes (accessible only when not authenticated)
  {
    element: <GuestRoute />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
  // Protected routes (require authentication)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  // Unauthorized page
  {
    path: '/unauthorized',
    element: (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">403</h1>
          <p className="mt-2 text-lg text-gray-600">Access Denied</p>
          <p className="mt-1 text-sm text-gray-500">
            You don't have permission to access this resource.
          </p>
        </div>
      </div>
    ),
  },
  // 404 page
  {
    path: '*',
    element: <NotFound />,
  },
]);
