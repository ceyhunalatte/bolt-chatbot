import React, { createContext, useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Message, Session } from '../../types';
import { useSessionWs } from './chat/usSessionWs';

const SessionContext = createContext<{
  session: Session | null;
  loading: boolean;
  messages: Message[];
  sendMessage: (message: string) => void;
  getSession: (id: string) => Promise<Session | null>;
  createSession: () => Promise<Session | null>;
}>({
  session: null,
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { connected, connect, sendMessage } = useSessionWs(onMessage);
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

  function onMessage(message: Message) {
    setMessages((messages) => [...messages, message]);
  }

  return (
    <SessionContext.Provider
      value={{
        session,
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
