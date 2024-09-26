import React, { useEffect, useState } from 'react';
import { useAuthApi } from '../auth/useAuthApi';
import { Session } from '../../types';
import { useApi } from '../../hooks/useApi';
import { useSessionContext } from './sessionContext';

export const Chats = () => {
  const { session, getSession, createSession } = useSessionContext();
  const [sessions, setSessions] = useState<Session[]>([]);
  const { get, post } = useApi();
  const { logout } = useAuthApi();

  useEffect(() => {
    getSessions();

    async function getSessions() {
      const res = await get('/sessions/all');
      if (!res) return;
      setSessions(res);
    }
  }, []);

  function handleLogout() {
    logout();
    window.location.reload();
  }

  return (
    <div
      style={{ height: '100vh', width: '200px', borderRight: '1px solid #ccc' }}
    >
      <button onClick={createSession}>new session</button>
      {sessions.map((x) => (
        <div key={x._id}>
          <button onClick={() => getSession(x._id)}>
            <p key={x._id}>{x._id}</p>
          </button>
        </div>
      ))}
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};
