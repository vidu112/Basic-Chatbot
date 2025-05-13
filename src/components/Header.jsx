// src/components/Header.jsx
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-zinc-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Title */}
          <Link to="/" className="text-2xl font-bold">
            ProManage Demo
          </Link>

          {/* Nav Links */}
          <nav className="space-x-4 flex items-center">
            {!token && (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md hover:bg-zinc-800 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-md hover:bg-zinc-800 transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {token && (
              <>
                <Link
                  to="/chat"
                  className="px-3 py-2 rounded-md hover:bg-zinc-800 transition"
                >
                  Chat
                </Link>
                <Link
                  to="/tasks/new"
                  className="px-3 py-2 rounded-md hover:bg-zinc-800 transition"
                >
                  New Task
                </Link>
                <Link
                  to="/tasks"
                  className="px-3 py-2 rounded-md hover:bg-zinc-800 transition"
                >
                  My Tasks
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md hover:bg-red-700 transition text-red-400"
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
