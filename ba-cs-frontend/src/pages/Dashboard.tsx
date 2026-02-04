import { Card, CardContent, CardHeader } from '@/components/ui';
import { Users, FileText, TrendingUp, Clock } from 'lucide-react';

const stats = [
  { name: 'Total Users', value: '2,543', icon: Users, change: '+12%' },
  { name: 'Open Tickets', value: '45', icon: FileText, change: '-8%' },
  { name: 'Resolution Rate', value: '94.5%', icon: TrendingUp, change: '+2.1%' },
  { name: 'Avg. Response Time', value: '2.4h', icon: Clock, change: '-15%' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your customer service metrics
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                <span
                  className={
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">No recent activity to display.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Quick action buttons will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
