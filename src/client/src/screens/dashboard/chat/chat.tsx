import React, { useEffect, useState } from 'react';
import { Message, Session } from '../../../types';
import { useSessionWs } from './usSessionWs';
import { useSessionContext } from '../sessionContext';
import { useApi } from '../../../hooks/useApi';

export interface ChatProps {}

export const Chat: React.FC<ChatProps> = () => {
  const { session, messages, loading, sendMessage } = useSessionContext();
  const [value, setValue] = useState<string>('');
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
