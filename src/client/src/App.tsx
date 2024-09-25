import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { io } from 'socket.io-client';

function App() {
  // const socket = io('localhost:3000/session', { auth: { token: '123' } });
  // useEffect(() => {
  //   connect();
  // }, []);

  // function connect() {
  //   socket.on('connect', () => {
  //     console.log('connected');
  //   });

  //   socket.on('error', (error) => {
  //     console.log('error', error);
  //   });

  //   socket.on('joinedToSession', (m: any) => console.log(m));
  // }

  // function joinSession() {
  //   socket.emit('joinSession', { sessionId: '123' });
  // }

  return (
    <div className="App">
      <h1>Hello, world!</h1>
    </div>
  );
}

export default App;
