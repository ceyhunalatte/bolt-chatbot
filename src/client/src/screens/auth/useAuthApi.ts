import { useApi } from '../../hooks/useApi';
import { JWTPayload, User } from '../../types';
import { useAccessToken } from '../../hooks/useAccessToken';

export type UserLoginResponse = {
  user: User;
  access: JWTPayload;
};

export interface IuseAuthApi {
  login: (data: { username: string; password: string }) => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuthApi = (): IuseAuthApi => {
  const { post } = useApi();
  const { removeToken, setToken } = useAccessToken();

  async function login(data: {
    username: string;
    password: string;
  }): Promise<User | null> {
    try {
      const res: UserLoginResponse = await post('/users/login', data);
      setToken(res.access.token);
      return res.user;
    } catch (error: any) {
      return null;
    }
  }

  async function logout() {
    removeToken();
  }

  return {
    login,
    logout,
  };
};
