// src/components/VerifySuccess.jsx
import { Link } from "react-router-dom";

export default function VerifySuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl mb-4">Email Verified!</h2>
        <Link to="/login" className="btn">
          Log In
        </Link>
      </div>
    </div>
  );
}
