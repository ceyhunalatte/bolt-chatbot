import React from 'react';
import { useAuthApi } from '../auth/useAuthApi';

export const Dashboard = () => {
  const { logout } = useAuthApi();

  function handleLogout() {
    logout();
    window.location.reload();
  }
  return (
    <div>
      <h1>dashboard</h1>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};
