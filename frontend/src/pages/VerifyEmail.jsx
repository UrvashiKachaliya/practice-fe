import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyEmail, resendOTP } from "../helpers/apiRequest";

function VerifyEmail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const inputs = useRef([]);

  useEffect(() => {
    if (!email) navigate("/signup", { replace: true });
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const { mutate: verify, isPending } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      toast.success("Email verified! Please sign in.");
      navigate("/signin", { replace: true });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Invalid OTP"),
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: resendOTP,
    onSuccess: () => {
      toast.success("New OTP sent!");
      setCooldown(60);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to resend"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return toast.error("Enter the 6-digit code");
    verify({ email, otp: code });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-10 w-full max-w-md text-center">
        {/* <div className="text-5xl mb-4">📬</div> */}
        <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Verify your email</h2>
        <p className="text-gray-400 text-sm mb-2">
          We sent a 6-digit code to
        </p>
        <p className="text-orange-500 font-semibold text-sm mb-7">{email}</p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-7" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50 transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-md shadow-orange-200 disabled:opacity-60"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </span>
            ) : "Verify Email →"}
          </button>
        </form>

        <div className="mt-5 text-sm text-gray-400">
          Didn't receive it?{" "}
          {cooldown > 0 ? (
            <span className="text-gray-400">Resend in {cooldown}s</span>
          ) : (
            <button
              onClick={() => resend({ email })}
              disabled={isResending}
              className="text-orange-500 font-semibold hover:underline disabled:opacity-60"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
