import React, { useState } from 'react';
import { IuseAuthApi, useAuthApi } from './useAuthApi';
import { Button, Input, Flex, Typography } from 'antd';

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
    <Flex>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '400px',
          alignSelf: 'center',
          alignItems: 'center',
        }}
      >
        <Typography.Title style={{ marginTop: 0 }} level={3}>
          Welcome to CatBot
        </Typography.Title>

        <Input
          placeholder="Username"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          style={{ marginTop: '8px' }}
        />

        <Button
          htmlType="submit"
          type="primary"
          style={{ marginTop: '8px', width: '100%' }}
        >
          Log in
        </Button>

        <Flex style={{ width: '80%' }}>
          <Typography.Text
            type="secondary"
            style={{ marginTop: '8px', lineHeight: '16px' }}
          >
            This step will create an account for you if the username doesn't
            exists.
          </Typography.Text>
        </Flex>
      </form>
    </Flex>
  );
};
