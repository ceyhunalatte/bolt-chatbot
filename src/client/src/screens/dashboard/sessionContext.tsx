import React, { createContext, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Session } from '../../types';

const SessionContext = createContext<{
  session: Session | null;
  loading: boolean;
  getSession: (id: string) => void;
  createSession: () => void;
}>({
  session: null,
  loading: true,
  getSession: (id: string) => {},
  createSession: () => {},
});

/**
 * Controls which session is selected within view.
 */
const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { post, get } = useApi();

  async function createSession() {
    setLoading(true);
    const res = await post('/sessions/create');
    if (!res) return setLoading(false);
    setSession(res);
    setLoading(false);
  }

  async function getSession(id: string) {
    setLoading(true);
    const res = await get('/sessions', { id });
    if (!res) return setLoading(false);
    setSession(res);
    setLoading(false);
  }

  return (
    <SessionContext.Provider
      value={{ session, loading, getSession, createSession }}
    >
      {children}
    </SessionContext.Provider>
  );
};

const useSessionContext = () => React.useContext(SessionContext);

export { SessionProvider, useSessionContext };
