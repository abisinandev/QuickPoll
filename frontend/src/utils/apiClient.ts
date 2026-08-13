import { ApiResponse } from '../types/api.types';

export const apiClient = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (error) {
    console.error(`[API Error] Request to ${url} failed:`, error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
};
