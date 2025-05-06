// src/components/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../api";

export default function VerifyEmail() {
  const [status, setStatus] = useState("Verifying...");
  const [params] = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    api.get(`/auth/verify-email?token=${token}`)
      .then(() => setStatus("Email verified! You can now log in."))
      .catch(() => setStatus("Verification failed or expired."))
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg max-w-md text-center">
        <p className="mb-4">{status}</p>
        {status.includes("verified") && (
          <Link to="/login" className="btn">
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
}
