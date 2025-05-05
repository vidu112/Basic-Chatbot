// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login  from './components/Login';
import Signup from './components/Signup';
import ChatBox from './components/ChatBox';
import PageNotFound from './components/PageNotFound';
import Spinner from './components/Spinner';

function ProtectedLayout() {
  const { token, loading } = useContext(AuthContext);
  if (loading) return null;
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  const { token, loading } = useContext(AuthContext);

  // While we’re checking refresh-token, don’t show routes yet
  if (loading) {
    return null // or a <Spinner /> if you like
  }

  return (
    <Routes>
      <Route path="/login"  element={<Login />}  />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pagenotfound" element={<PageNotFound />} />

      {/* all these share the same protection logic */}
      <Route element={<ProtectedLayout />}>
        <Route path="/chat"     element={<ChatBox />} />
      </Route>
      <Route path="*" element={<Navigate to="/pagenotfound" replace />} />
    </Routes>
    
  );
}

