import React, { createContext, useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { ISessionStatus, Message, Session } from '../../types';
import { useSessionWs } from './chat/usSessionWs';

const SessionContext = createContext<{
  session: Session | null;
  status: string | null;
  loading: boolean;
  messages: Message[];
  sendMessage: (message: string) => void;
  getSession: (id: string) => Promise<Session | null>;
  createSession: () => Promise<Session | null>;
}>({
  session: null,
  status: '',
  loading: true,
  messages: [],
  sendMessage: (message: string) => null,
  getSession: async (id: string) => null,
  createSession: async () => null,
});

/**
 * Controls which session is selected within view.
 */
const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<string | null>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { connect, sendMessage } = useSessionWs(onMessage);
  const { post, get } = useApi();

  useEffect(() => {
    getMessages();
  }, [session]);

  async function createSession() {
    setLoading(true);
    const res = await post('/sessions/create');
    if (!res) return setLoading(false);
    setSession(res);
    setLoading(false);

    return res;
  }

  async function getSession(id: string) {
    setLoading(true);
    const res = await get('/sessions', { id });
    if (!res) return setLoading(false);
    setSession(res);
    setStatus(res.status);
    await getMessages();
    setLoading(false);

    return res;
  }

  async function getMessages() {
    if (!session) return;

    const res = await get('/sessions/messages', { id: session._id });
    if (!res) return;

    setMessages(res);
    connect(session);
  }

  function onMessage(payload: ISessionStatus) {
    const { status, message, error } = payload;
    if (error) return alert(error);

    if (message) setMessages((messages) => [...messages, message]);
    if (status) setStatus(status);
  }

  return (
    <SessionContext.Provider
      value={{
        session,
        status,
        sendMessage,
        messages,
        loading,
        getSession,
        createSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

const useSessionContext = () => React.useContext(SessionContext);

export { SessionProvider, useSessionContext };
