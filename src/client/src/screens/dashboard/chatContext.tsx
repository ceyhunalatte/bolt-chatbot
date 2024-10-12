import React, { createContext, useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { IChatStatus, Message, Chat } from '../../types';
import { useChatWs } from './chat/useChatWs';

const ChatContext = createContext<{
  chat: Chat | null;
  status: string | null;
  loading: boolean;
  messages: Message[];
  sendMessage: (message: string) => void;
  getChat: (id: string) => Promise<Chat | null>;
  createChat: () => Promise<Chat | null>;
}>({
  chat: null,
  status: '',
  loading: true,
  messages: [],
  sendMessage: (message: string) => null,
  getChat: async (id: string) => null,
  createChat: async () => null,
});

/**
 * Controls which chat is selected within view.
 */
const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [status, setStatus] = useState<string | null>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { connect, sendMessage } = useChatWs(onMessage);
  const { post, get } = useApi();

  useEffect(() => {
    getMessages();
  }, [chat]);

  async function createChat() {
    setLoading(true);
    const res = await post('/chats/create');
    if (!res) return setLoading(false);
    setChat(res);
    setLoading(false);

    return res;
  }

  async function getChat(_id: string) {
    setLoading(true);
    console.log(
      '---------------------------------------------------------------------------------',
    );
    console.log('performing get chat');
    console.log(
      '---------------------------------------------------------------------------------',
    );
    const res = await get('/chats', { _id });
    if (!res) return setLoading(false);
    setChat(res);
    setStatus(res.status);
    await getMessages();
    setLoading(false);

    return res;
  }

  async function getMessages() {
    if (!chat) return;

    console.log(
      '---------------------------------------------------------------------------------',
    );
    console.log('performing get messages');
    console.log(
      '---------------------------------------------------------------------------------',
    );
    const res = await get('/chats/messages', { chatId: chat._id });
    console.log(
      '---------------------------------------------------------------------------------',
    );
    console.log(res);
    console.log(
      '---------------------------------------------------------------------------------',
    );
    if (!res) return;

    setMessages(res);
    connect(chat);
  }

  function onMessage(payload: IChatStatus) {
    const { status, message, error } = payload;
    if (error) return alert(error);

    if (message) setMessages((messages) => [...messages, message]);
    if (status) setStatus(status);
  }

  return (
    <ChatContext.Provider
      value={{
        chat,
        status,
        sendMessage,
        messages,
        loading,
        getChat,
        createChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => React.useContext(ChatContext);

export { ChatProvider, useChatContext };
