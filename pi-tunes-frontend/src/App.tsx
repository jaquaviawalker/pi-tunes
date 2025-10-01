import { useState, useEffect } from 'react';
import Login from './components/Login';
import axios from 'axios';

function App() {
  // Create axios instance with base URL
  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true, // Important if using cookies/auth
  });
  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      const response = await api.get('/callback');
      const data = await response.data;
      setToken(data.access_token);
    }

    getToken();
  }, []);

  return <Login />;
}

export default App;
