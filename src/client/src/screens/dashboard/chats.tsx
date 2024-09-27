import { useEffect, useState } from 'react';
import { useAuthApi } from '../auth/useAuthApi';
import { Session } from '../../types';
import { useApi } from '../../hooks/useApi';
import { useSessionContext } from './sessionContext';
import { Button, List } from 'antd';

export const Chats = () => {
  const { getSession, createSession } = useSessionContext();
  const [sessions, setSessions] = useState<Session[]>([]);
  const { get } = useApi();
  const { logout } = useAuthApi();

  useEffect(() => {
    getSessions();

    async function getSessions() {
      const res = await get('/sessions/all');
      if (!res) return;
      setSessions(res);

      if (!res.length) return handleCreateSession();
      getSession(res[0]._id);
    }
  }, []);

  function handleLogout() {
    logout();
    window.location.reload();
  }

  async function handleCreateSession() {
    const res = await createSession();
    if (!res) return;
    setSessions((sessions) => [res, ...sessions]);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        height: '100vh',
        width: '220px',
        minWidth: '220px',
        borderRight: '1px solid #ccc',
        overflowX: 'scroll',
      }}
    >
      <Button onClick={handleCreateSession}>New session</Button>
      <List
        style={{}}
        itemLayout="horizontal"
        dataSource={sessions}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={<a onClick={() => getSession(item._id)}>{item._id}</a>}
            />
          </List.Item>
        )}
      />
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};
