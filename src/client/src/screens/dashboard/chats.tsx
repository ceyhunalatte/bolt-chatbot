import { useEffect, useState } from 'react';
import { useAuthApi } from '../auth/useAuthApi';
import { Chat } from '../../types';
import { useApi } from '../../hooks/useApi';
import { useChatContext } from './chatContext';
import { Button, List } from 'antd';

export const Chats = () => {
  const { getChat, createChat } = useChatContext();
  const [chats, setChats] = useState<Chat[]>([]);
  const { get } = useApi();
  const { logout } = useAuthApi();

  useEffect(() => {
    getChats();

    async function getChats() {
      const res = await get('/chats/all');
      if (!res) return;
      setChats(res);

      if (!res.length) return handleCreateChat();
      getChat(res[0]._id);
    }
  }, []);

  function handleLogout() {
    logout();
    window.location.reload();
  }

  async function handleCreateChat() {
    const res = await createChat();
    if (!res) return;
    setChats((chats) => [res, ...chats]);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        height: '100vh',
        width: '220px',
        minWidth: '220px',
        borderRight: '1px solid #ccc',
        overflowX: 'scroll',
      }}
    >
      <Button onClick={handleCreateChat}>New chat</Button>
      <List
        style={{}}
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={<a onClick={() => getChat(item._id)}>{item._id}</a>}
            />
          </List.Item>
        )}
      />
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};
