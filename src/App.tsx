import './App.scss';
import { observer } from 'mobx-react-lite';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import ChatPage from './pages/Chat';
import UserStore from './stores/UserStore.ts';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!UserStore.credentials) navigate('/');
  }, [UserStore.credentials]);

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="*" element={<AuthPage />} />
    </Routes>
  );
}

export default observer(App);
