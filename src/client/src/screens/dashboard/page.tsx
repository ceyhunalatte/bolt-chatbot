import { Chat } from './chat/chat';
import { Chats } from './chats';
import { ChatProvider } from './chatContext';

export const Dashboard = () => {
  return (
    <ChatProvider>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100vw' }}>
        <Chats />
        <Chat />
      </div>
    </ChatProvider>
  );
};
