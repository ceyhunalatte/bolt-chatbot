import React, { useState } from 'react';
import { IuseAuthApi, useAuthApi } from './useAuthApi';

export const Auth: React.FC = () => {
  const { login }: IuseAuthApi = useAuthApi();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  async function handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    const res = await login({ username, password });
    if (!res) return;
    window.location.reload();
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '400px',
        alignSelf: 'center',
      }}
    >
      <h1>Auth</h1>
      <input
        placeholder="username"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUsername(e.target.value)
        }
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />

      <button type="submit">login</button>
    </form>
  );
};
