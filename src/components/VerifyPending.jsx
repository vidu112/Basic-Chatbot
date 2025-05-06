import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext }    from "../context/AuthContext";
import { api }            from "../api";

export default function VerifyPending() {
  const { token, refresh } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      // 1) Bootstrap a new access token from the refresh cookie
      await refresh();  
      if (!token) {
        // still no token
        alert("Session expired. Please log in.");
        return navigate("/login");
      }

      // 2) Call the protected endpoint
      const { data } = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.user.isVerified) {
        navigate("/login");
      } else {
        alert("Email not verified yet. Check your inbox.");
      }
    } catch (err) {
      console.error("Verification check error:", err);
      alert("Unable to verify right now. Try again later.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="bg-zinc-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
        <p className="mb-6">
          A verification link has been sent to your email address. Click it to verify your account.
        </p>
        <button
          onClick={handleCheckVerification}
          disabled={loading}
          className="btn bg-blue hover:bg-transparent hover:text-blue transition px-6 py-2 rounded-full"
        >
          {loading ? "Checking..." : "I Have Verified"}
        </button>
      </div>
    </div>
  );
}
