// src/App.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Spinner from "./components/Spinner";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatBox from "./components/ChatBox";
import PageNotFound from "./components/PageNotFound";
import VerifyEmail from "./components/VerifyEmail";
import VerifySuccess from "./components/VerifySuccess";
import VerifyPending from "./components/VerifyPending";
import TaskForm from "./components/Tasks/TaskForm.jsx";
import Header from "./components/Header";
import TasksList from "./components/Tasks/TasksList.jsx";
import TaskEdit from "./components/Tasks/TaskEdit.jsx";

function ProtectedLayout() {
  const { token } = useContext(AuthContext);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  const { token, loading } = useContext(AuthContext);
  if (loading) return <Spinner />;

  return (
    <>
      <Header />
      <Routes>
        {/* 1) Redirect root (“/” or empty) to /login */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/chat" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/verify-pending" element={<VerifyPending />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-success" element={<VerifySuccess />} />

        <Route element={<ProtectedLayout />}>
          <Route
            path="/chat"
            element={
              <main className="h-full w-full">
                <ChatBox />
              </main>
            }
          />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks" element={<TasksList />} />
          <Route path="/tasks/:id/edit" element={<TaskEdit />} />
        </Route>

        {/* 4) 404 for anything else */}
        <Route path="*" element={<Navigate to="/pagenotfound" replace />} />

        {/* 5) Dedicated 404 page */}
        <Route path="/pagenotfound" element={<PageNotFound />} />
      </Routes>
    </>
  );
}
