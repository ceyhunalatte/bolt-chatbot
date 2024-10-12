import { useEffect, useState } from 'react';
import { IChatStatus, Message, Chat } from '../../../types';
import { io, Socket } from 'socket.io-client';
import { useAccessToken } from '../../../hooks/useAccessToken';

export interface IuseChatWs {
  ws: Socket | null;
  connect: (chat: Chat) => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  connected: boolean;
}

export const useChatWs = (
  onMessage: (payload: IChatStatus) => void,
): IuseChatWs => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [ws, setWs] = useState<Socket | null>(null);
  const { getToken } = useAccessToken();

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  function connect(chat: Chat) {
    if (ws) disconnect();
    setChat(chat);
    setWs(() => {
      const ws = io('http://localhost:3000/chat', {
        auth: {
          token: getToken(),
        },
      });

      ws.on('connect', () => {
        ws.emit('joinChat', { chatId: chat!._id });
        setConnected(true);
        console.log('connected');
      });

      ws.on('newMessage', (payload: IChatStatus) => {
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
    ws.emit('newMessage', { message, chatId: chat!._id });
  }

  function disconnect() {
    if (!ws) return;
    ws.disconnect();
    setWs(null);
    setChat(null);
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
