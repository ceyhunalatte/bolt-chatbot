import React, { useEffect, useRef, useState } from 'react';
import { useSessionContext } from '../sessionContext';
import { Button, Flex, Input } from 'antd';

export interface ChatProps {}

export const Chat: React.FC<ChatProps> = () => {
  const { status, messages, loading, sendMessage } = useSessionContext();
  const [value, setValue] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo(
      0,
      scrollContainerRef.current.scrollHeight,
    );
  }, [messages]);

  function handleSendMessage(e: any) {
    e.preventDefault();
    if (!value?.length) return;
    sendMessage(value);
    setValue('');
  }

  return (
    <Flex
      align="center"
      justify="center"
      vertical
      style={{
        width: 'calc(100vw - 222px)',
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <Flex
        ref={scrollContainerRef}
        vertical
        align="center"
        justify="space-between"
        style={{ height: '100vh', width: '80%', overflow: 'scroll' }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <React.Fragment>
            <Flex align="center" style={{ width: '100%', padding: '16px 0' }}>
              {messages.length && (
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {messages?.map((m) => (
                    <div
                      style={{
                        maxWidth: '60%',
                        alignSelf:
                          m.role === 'USER' ? 'flex-end' : 'flex-start',
                      }}
                      key={m._id}
                    >
                      <p
                        style={{
                          border: '1px solid gray',
                          padding: '8px',
                          borderRadius: '8px',
                          textAlign: m.role === 'USER' ? 'right' : 'left',
                        }}
                      >
                        {m.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Flex>
          </React.Fragment>
        )}
      </Flex>

      <Flex style={{ width: '80%' }}>
        <form
          onSubmit={handleSendMessage}
          style={{ width: '100%', paddingBottom: '16px' }}
        >
          {status && status !== 'active' && <p>...{status}</p>}
          <Flex>
            <Input
              disabled={!messages.length}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(e.target.value)
              }
            />
            <Button htmlType="submit" style={{ marginLeft: '4px' }}>
              send
            </Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
};
