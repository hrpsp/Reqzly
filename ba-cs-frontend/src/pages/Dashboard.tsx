import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, Spinner } from '@/components/ui';
import { dashboardApi } from '@/api';
import { useAuth } from '@/hooks/useAuth';
import {
  FileText,
  Clock,
  CheckCircle,
  CalendarDays,
  CreditCard,
  Landmark,
  Plus,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import type { RecentActivity, RequestStatus } from '@/types/api';

const statusColors: Record<RequestStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const typeColors: Record<string, string> = {
  credit_card: 'bg-purple-100 text-purple-800',
  loan: 'bg-indigo-100 text-indigo-800',
};

export default function Dashboard() {
  const { user } = useAuth();

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboardApi.getStats();
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load dashboard</h3>
          <p className="mt-1 text-sm text-gray-500">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const recentActivity = dashboardData?.recent_activity || [];

  const statCards = [
    {
      name: "Today's Requests",
      value: stats?.today_requests || 0,
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      description: 'Credit Card + Loan requests',
    },
    {
      name: 'Pending Verifications',
      value: stats?.pending_verifications || 0,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
      description: 'Awaiting biometric verification',
    },
    {
      name: 'Completed Today',
      value: stats?.completed_today || 0,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      description: 'Successfully processed',
    },
    {
      name: 'Monthly Total',
      value: stats?.monthly_total || 0,
      icon: CalendarDays,
      color: 'bg-purple-50 text-purple-600',
      description: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.employee_name}. Here's your overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-400">{stat.description}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Type Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              to="/credit-card/new"
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-[#0D5C73] hover:bg-teal-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New Credit Card Request</p>
                  <p className="text-sm text-gray-500">Create a new service request</p>
                </div>
              </div>
              <Plus className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              to="/loan/new"
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-[#0D5C73] hover:bg-teal-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2">
                  <Landmark className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New Loan Request</p>
                  <p className="text-sm text-gray-500">Create a new loan service request</p>
                </div>
              </div>
              <Plus className="h-5 w-5 text-gray-400" />
            </Link>
          </CardContent>
        </Card>

        {/* Credit Card Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Credit Card Requests</h3>
            <Link
              to="/credit-card/list"
              className="text-sm font-medium text-[#0D5C73] hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total</span>
                <span className="font-semibold text-gray-900">
                  {stats?.credit_card_stats.total || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Pending</span>
                <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                  {stats?.credit_card_stats.pending || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Verified</span>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                  {stats?.credit_card_stats.verified || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Completed</span>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                  {stats?.credit_card_stats.completed || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Loan Requests</h3>
            <Link to="/loan/list" className="text-sm font-medium text-[#0D5C73] hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total</span>
                <span className="font-semibold text-gray-900">
                  {stats?.loan_stats.total || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Pending</span>
                <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                  {stats?.loan_stats.pending || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Verified</span>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                  {stats?.loan_stats.verified || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Completed</span>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                  {stats?.loan_stats.completed || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <span className="text-sm text-gray-500">Last 10 requests</span>
        </CardHeader>
        <CardContent className="p-0">
          {recentActivity.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No recent activity to display.</p>
              <p className="text-xs text-gray-400">New requests will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Request #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentActivity.map((activity: RecentActivity) => (
                    <tr key={`${activity.type}-${activity.id}`} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-medium text-gray-900">{activity.request_number}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            typeColors[activity.type]
                          }`}
                        >
                          {activity.type_label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {activity.customer_name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusColors[activity.status]
                          }`}
                        >
                          {activity.status_label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {activity.created_at_human}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Link
                          to={`/${activity.type === 'credit_card' ? 'credit-card' : 'loan'}/${activity.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#0D5C73] hover:underline"
                        >
                          View
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
