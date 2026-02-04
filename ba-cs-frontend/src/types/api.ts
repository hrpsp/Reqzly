export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export type UserRole = 'admin' | 'supervisor' | 'staff';

export interface UserSupervisor {
  id: number;
  employee_code: string;
  employee_name: string;
  designation: string;
  email: string;
}

export interface User {
  id: number;
  employee_code: string;
  employee_name: string;
  designation: string;
  department: string;
  region: string;
  mobile_number: string;
  email: string;
  role: UserRole;
  role_label: string;
  picture: string | null;
  is_active: boolean;
  email_verified_at: string | null;
  supervisor: UserSupervisor | null;
  created_at: string;
  updated_at: string;
}
