// src/components/Signup.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [username, setUsername]   = useState("");
  const [email, setEmail]         = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [password, setPassword]   = useState("");
  const { signup }                = useContext(AuthContext);
  const navigate                  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(username, email, firstName, lastName, password);
      navigate("/chat");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Sign up failed. Username or email may already be taken.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-zinc-900 to-blue-800 p-4">
      <div className="bg-zinc-800 text-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* First Name */}
          <div>
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Your last name"
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full btn bg-blue hover:bg-transparent hover:text-blue transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
