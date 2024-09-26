import { useEffect, useState } from 'react';
import { ISessionStatus, Message, Session } from '../../../types';
import { io, Socket } from 'socket.io-client';
import { useAccessToken } from '../../../hooks/useAccessToken';

export interface IuseSessionWs {
  ws: Socket | null;
  connect: (session: Session) => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  connected: boolean;
}

export const useSessionWs = (
  onMessage: (payload: ISessionStatus) => void,
): IuseSessionWs => {
  const [session, setSession] = useState<Session | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [ws, setWs] = useState<Socket | null>(null);
  const { getToken } = useAccessToken();

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  function connect(session: Session) {
    if (ws) disconnect();
    setSession(session);
    setWs(() => {
      const ws = io('http://localhost:3000/session', {
        auth: {
          token: getToken(),
        },
      });

      ws.on('connect', () => {
        ws.emit('joinSession', { sessionId: session!._id });
        setConnected(true);
        console.log('connected');
      });

      ws.on('newMessage', (payload: ISessionStatus) => {
        onMessage(payload);
      });

      ws.on('error', (error) => {
        console.log('connected', error);
      });

      ws.on('disconnect', (reason) => {
        console.log('disconnected', reason);
      });

      return ws;
    });
  }

  function sendMessage(message: string) {
    if (!ws) return;
    ws.emit('newMessage', { message, sessionId: session!._id });
  }

  function disconnect() {
    if (!ws) return;
    ws.disconnect();
    setWs(null);
    setSession(null);
    setConnected(false);
  }

  return {
    ws,
    connect,
    disconnect,
    sendMessage,
    connected,
  };
};
