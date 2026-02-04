import apiClient from '@/lib/axios';
import type { ApiResponse, DashboardData } from '@/types/api';

export const dashboardApi = {
  /**
   * Get dashboard statistics and recent activity
   */
  getStats: async (): Promise<ApiResponse<DashboardData>> => {
    const response = await apiClient.get<ApiResponse<DashboardData>>('/dashboard/stats');
    return response.data;
  },
};
