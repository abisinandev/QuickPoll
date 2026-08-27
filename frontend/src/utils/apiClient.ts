import axios, { AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types/api.types';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = async <T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.request<ApiResponse<T>>({
      url,
      ...options,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<T>;
    }

    console.error(`[API Error] Request to ${url} failed:`, error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
};
