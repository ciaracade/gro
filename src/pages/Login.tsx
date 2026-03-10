import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { signInWithOtp, signInAsFiller } = useAuth();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Supabase redirect errors (e.g. expired magic link)
  useEffect(() => {
    const hash = window.location.hash?.slice(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const err = params.get("error");
    const errCode = params.get("error_code");
    const errDesc = params.get("error_description");

    if (err || errCode || errDesc) {
      const msg =
        errCode === "otp_expired"
          ? "That sign-in link has expired. Please request a new one."
          : errDesc?.replace(/\+/g, " ") ||
            err ||
            "Sign-in failed. Please try again.";
      setError(msg);
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  async function handleSendLink() {
    setError("");
    setLoading(true);

    const normalized = email.trim().toLowerCase();

    const { error } = await signInWithOtp(normalized);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setEmail(normalized);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-teal flex flex-col items-center justify-center px-6 pb-24">
      {/* logo */}
      <div className="text-center mb-8">
        <h1 className="font-fredoka text-5xl font-bold text-white drop-shadow-sm">
          gro!
        </h1>
        <p className="text-white/80 text-sm mt-3 tracking-wide">
          Share food. Reduce waste. Grow community.
        </p>
      </div>

      {/* form card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-black/20 py-10 px-8 w-full max-w-sm">
        {!sent ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Enter your email to get started.
                <br />
                We'll send you a sign-in link.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-4 text-base bg-gray-50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center bg-red-50 rounded-xl py-2.5">
                {error}
              </p>
            )}

            <button
              onClick={handleSendLink}
              disabled={loading || !email.includes("@")}
              className="w-full bg-teal text-white font-semibold py-4 rounded-xl hover:bg-teal-dark transition-all disabled:opacity-40 shadow-md shadow-teal/20 active:scale-[0.98]"
            >
              {loading ? "Sending..." : "Send Sign-In Link"}
            </button>

            <button
              onClick={() => {
                signInAsFiller();
                navigate("/home");
              }}
              className="w-full text-gray-500 text-sm py-2 hover:text-gray-700 transition-colors"
            >
              Continue as demo user
            </button>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="text-5xl">📬</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Check your email
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We sent a sign-in link to
              <br />
              <span className="font-medium text-gray-700">{email}</span>
              <br />
              Click the link in your email to log in.
            </p>

            <button
              onClick={() => {
                setSent(false);
                setError("");
              }}
              className="w-full text-teal font-medium text-sm py-3 hover:text-teal-dark transition-colors"
            >
              Use a different email
            </button>

            <button
              onClick={() => {
                signInAsFiller();
                navigate("/home");
              }}
              className="w-full text-gray-500 text-sm py-2 hover:text-gray-700 transition-colors"
            >
              Continue as demo user
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
