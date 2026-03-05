import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  CreditCardRequest,
  CreditCardRequestFormData,
  CreditCardRequestListResponse,
  CreditCardRequestFilters,
} from '@/types/creditCard';

// Strip empty strings so the server doesn't receive empty filter values
function buildParams(filters: CreditCardRequestFilters): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== '' && value !== undefined && value !== null) {
      params[key] = value as string | number | boolean;
    }
  }
  return params;
}

export const creditCardRequestsApi = {
  /**
   * GET /api/v1/credit-card-requests
   */
  list: async (
    filters: CreditCardRequestFilters = {}
  ): Promise<ApiResponse<CreditCardRequestListResponse>> => {
    const response = await apiClient.get<ApiResponse<CreditCardRequestListResponse>>(
      '/credit-card-requests',
      { params: buildParams(filters) }
    );
    return response.data;
  },

  /**
   * POST /api/v1/credit-card-requests
   */
  create: async (
    data: CreditCardRequestFormData
  ): Promise<ApiResponse<CreditCardRequest>> => {
    const response = await apiClient.post<ApiResponse<CreditCardRequest>>(
      '/credit-card-requests',
      data
    );
    return response.data;
  },

  /**
   * GET /api/v1/credit-card-requests/:id
   */
  get: async (id: number): Promise<ApiResponse<CreditCardRequest>> => {
    const response = await apiClient.get<ApiResponse<CreditCardRequest>>(
      `/credit-card-requests/${id}`
    );
    return response.data;
  },

  /**
   * PUT /api/v1/credit-card-requests/:id
   */
  update: async (
    id: number,
    data: Partial<CreditCardRequestFormData>
  ): Promise<ApiResponse<CreditCardRequest>> => {
    const response = await apiClient.put<ApiResponse<CreditCardRequest>>(
      `/credit-card-requests/${id}`,
      data
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/credit-card-requests/:id
   */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/credit-card-requests/${id}`
    );
    return response.data;
  },

  /**
   * GET /api/v1/credit-card-requests/export  (triggers CSV download)
   */
  export: async (filters: CreditCardRequestFilters = {}): Promise<void> => {
    const response = await apiClient.get('/credit-card-requests/export', {
      params: buildParams(filters),
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
    const link = document.createElement('a');
    link.href = url;
    const disposition = response.headers['content-disposition'] as string | undefined;
    const filename = disposition
      ? disposition.split('filename=')[1]?.replace(/"/g, '')
      : `credit-card-requests-${new Date().toISOString().slice(0, 10)}.csv`;

    link.setAttribute('download', filename ?? 'export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
