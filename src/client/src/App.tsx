import './App.css';
import { Dashboard } from './screens/dashboard/page';
import { Auth } from './screens/auth/auth';
import { useAccessToken } from './hooks/useAccessToken';
import { useMemo } from 'react';

function App() {
  const { getToken } = useAccessToken();
  const token = useMemo(() => getToken(), []);

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {token ? <Dashboard /> : <Auth />}
    </div>
  );
}

export default App;
