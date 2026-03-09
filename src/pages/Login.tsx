import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { signInWithOtp, verifyOtp } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp() {
    setError("");
    setLoading(true);

    let normalized = phone.replace(/\D/g, "");
    if (normalized.length === 10) normalized = "1" + normalized;
    if (!normalized.startsWith("+")) normalized = "+" + normalized;

    const { error } = await signInWithOtp(normalized);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setPhone(normalized);
    setStep("otp");
  }

  async function handleVerifyOtp() {
    setError("");
    setLoading(true);

    const { error, isNew } = await verifyOtp(phone, otp);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate(isNew ? "/onboarding" : "/home");
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* teal header */}
      <div className="bg-teal px-6 pt-16 pb-14 text-center rounded-b-[2rem]">
        <h1 className="font-fredoka text-5xl font-bold text-white drop-shadow-sm">
          gro!
        </h1>
        <p className="text-white/80 text-sm mt-3 tracking-wide">
          Share food. Reduce waste. Grow community.
        </p>
      </div>

      {/* form card */}
      <div className="flex-1 px-5 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {step === "phone" ? (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back
                </h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Enter your phone number to get started.
                  <br />
                  We'll send you a verification code.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(734) 555-0123"
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-lg bg-cream/50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center bg-red-50 rounded-xl py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleSendOtp}
                disabled={loading || phone.replace(/\D/g, "").length < 10}
                className="w-full bg-teal text-white font-semibold py-4 rounded-2xl hover:bg-teal-dark transition-all disabled:opacity-40 shadow-md shadow-teal/20 active:scale-[0.98]"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Enter your code
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  We sent a 6-digit code to
                  <br />
                  <span className="font-medium text-gray-700">{phone}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Verification code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-2xl text-center tracking-[0.5em] font-mono bg-cream/50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center bg-red-50 rounded-xl py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full bg-teal text-white font-semibold py-4 rounded-2xl hover:bg-teal-dark transition-all disabled:opacity-40 shadow-md shadow-teal/20 active:scale-[0.98]"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>

              <button
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-teal font-medium text-sm py-2 hover:text-teal-dark transition-colors"
              >
                Use a different number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
