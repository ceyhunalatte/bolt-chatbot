import { useEffect, useState } from 'react';

export interface IuseAccesstoken {
  token: string | null;
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

export const useAccessToken = (): IuseAccesstoken => {
  const [token, changeToken] = useState<string | null>(null);

  function getToken(): string | null {
    const token = localStorage.getItem('token');
    changeToken(token);
    return token;
  }

  function setToken(token: string) {
    localStorage.setItem('token', token);
    changeToken(token);
  }

  function removeToken() {
    localStorage.removeItem('token');
    changeToken(null);
  }

  return {
    token,
    getToken,
    setToken,
    removeToken,
  };
};
