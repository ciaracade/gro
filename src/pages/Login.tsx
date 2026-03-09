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

    // normalize phone: add +1 if no country code
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

    if (isNew) {
      navigate("/onboarding");
    } else {
      navigate("/home");
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* header */}
      <div className="bg-teal px-4 pt-16 pb-12 text-center">
        <h1 className="font-fredoka text-5xl font-bold text-white">gro!</h1>
        <p className="text-white/90 text-sm mt-2">
          Share food. Reduce waste. Grow community.
        </p>
      </div>

      {/* form */}
      <div className="flex-1 px-6 pt-8">
        {step === "phone" ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Welcome to gro!
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your phone number to get started. We'll send you a
                verification code.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(734) 555-0123"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-teal"
                autoFocus
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handleSendOtp}
              disabled={loading || phone.replace(/\D/g, "").length < 10}
              className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Enter your code
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                We sent a 6-digit code to {phone}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-2xl text-center tracking-[0.5em] font-mono focus:outline-none focus:border-teal"
                autoFocus
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
              className="w-full text-teal font-medium text-sm py-2"
            >
              Use a different number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
