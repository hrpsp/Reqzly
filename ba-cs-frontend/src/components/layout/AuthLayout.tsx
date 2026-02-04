import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">BA CS Portal</h1>
          <p className="mt-2 text-sm text-gray-600">
            Business Analytics Customer Service Portal
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
