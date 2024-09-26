import { Chat } from './chat/chat';
import { Chats } from './chats';
import { SessionProvider } from './sessionContext';

export const Dashboard = () => {
  return (
    <SessionProvider>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100vw' }}>
        <Chats />
        <Chat />
      </div>
    </SessionProvider>
  );
};
