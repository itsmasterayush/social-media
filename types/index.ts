export * from './auth';
export * from './post';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}
