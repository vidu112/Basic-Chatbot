// src/App.jsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Spinner       from './components/Spinner';
import Login         from './components/Login';
import Signup        from './components/Signup';
import ChatBox       from './components/ChatBox';
import PageNotFound  from './components/PageNotFound';

function ProtectedLayout() {
  const { token } = useContext(AuthContext);
  return token
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

export default function App() {
  const {token, loading } = useContext(AuthContext);
  if (loading) return <Spinner />;

  return (
    <Routes>
      {/* 1) Redirect root (“/” or empty) to /login */}
      <Route path="/" element={token
          ? <Navigate to="/chat" replace />
          : <Navigate to="/login" replace />} />

      {/* 2) Public pages */}
      <Route path="/login"        element={<Login />}      />
      <Route path="/signup"       element={<Signup />}     />

      {/* 3) Protected pages */}
      <Route element={<ProtectedLayout />}>
        <Route path="/chat" element={<main className="h-full w-full">
      <ChatBox/>
    </main>} />
      </Route>

      {/* 4) 404 for anything else */}
      <Route path="*" element={<Navigate to="/pagenotfound" replace />} />

      {/* 5) Dedicated 404 page */}
      <Route path="/pagenotfound" element={<PageNotFound />} />
    </Routes>
  );
}
