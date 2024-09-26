import React, { useEffect, useState } from 'react';
import { Message, Session } from '../../../types';
import { useSessionWs } from './usSessionWs';
import { useSessionContext } from '../sessionContext';
import { useApi } from '../../../hooks/useApi';

export interface ChatProps {}

export const Chat: React.FC<ChatProps> = () => {
  const { session, loading } = useSessionContext();
  const { get } = useApi();
  const { connected, connect, sendMessage, addMessageListener } =
    useSessionWs(onMessage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    getMessages();
  }, [session]);

  function connectToSession() {
    if (!session) return;
    connect(session);
  }

  async function getMessages() {
    if (!session) return;

    const res = await get('/sessions/messages', { id: session._id });
    if (!res) return;

    setMessages(res);
    connectToSession();
  }

  function onMessage(message: Message) {
    setMessages((messages) => [...messages, message]);
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <React.Fragment>
          {messages.length && (
            <div>
              {messages?.map((m) => (
                <div key={m._id}>
                  <p>{m.message}</p>
                </div>
              ))}
            </div>
          )}

          <input
            disabled={!messages.length}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
          ></input>
          <button onClick={() => sendMessage(value)}>send message</button>
        </React.Fragment>
      )}
    </div>
  );
};
