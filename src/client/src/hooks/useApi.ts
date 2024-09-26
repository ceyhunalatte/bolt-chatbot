import React, { useMemo } from 'react';
import axios, { AxiosInstance } from 'axios';
import { useAccessToken } from './useAccessToken';

export interface IuseApi {
  get: (endpoint: string, params?: Record<string, any>) => Promise<any>;
  post: (endpoint: string, body?: Record<string, any>) => Promise<any>;
}

export const useApi = (): IuseApi => {
  const { getToken } = useAccessToken();

  function buildClient(): AxiosInstance {
    const headers = getToken() ? { Authorization: `Bearer ${getToken()}` } : {};
    return axios.create({ baseURL: process.env.REACT_APP_API_URL, headers });
  }

  async function get(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<any> {
    try {
      const httpClient = buildClient();
      const response = await httpClient.get(
        endpoint + buildQueryParams(params),
      );

      return response.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response?.data));
    }
  }

  async function post(
    endpoint: string,
    body?: Record<string, any>,
  ): Promise<any> {
    try {
      const httpClient = buildClient();
      const response = await httpClient.post(endpoint, body);
      return response.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }

  function buildQueryParams(params: Record<string, any> = {}) {
    if (!params || !Object.keys(params).length) return '';
    return '?' + new URLSearchParams(params).toString();
  }

  return {
    get,
    post,
  };
};
