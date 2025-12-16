import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  ArrowLeft,
  KeyRound,
  Timer,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  forgotPasswordRequest,
  verifyOtpRequest,
  resetPasswordRequest,
} from "../api/auth";

type Step = "EMAIL" | "OTP" | "RESET";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("EMAIL");
  const [loading, setLoading] = useState(false);

  // Form Data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      if (step === "OTP") setCanResend(true);
    }
  }, [timeLeft, step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- Handlers ---

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter email");

    setLoading(true);
    setCanResend(false); // Disable resend
    try {
      await forgotPasswordRequest(email);
      // Differs from initial send vs resend? User sees same toast "OTP sent"
      // could differentiate toast message if needed
      toast.success(
        step === "OTP"
          ? "New OTP sent successfully"
          : "OTP sent to registered email"
      );

      setStep("OTP");
      setOtp(""); // Clear OTP on new send
      setTimeLeft(180); // Start 3 min timer
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
      setCanResend(true); // Allow retry if send failed?
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter OTP");

    setLoading(true);
    try {
      await verifyOtpRequest(email, otp);
      toast.success("OTP verified successfully");
      setStep("RESET");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid OTP";

      // Handle special errors
      if (
        msg.toLowerCase().includes("too many attempts") ||
        msg.toLowerCase().includes("expired")
      ) {
        toast.error(msg);
        setCanResend(true); // Enable resend logic
        setOtp("");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword)
      return toast.error("All fields required");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 chars");

    setLoading(true);
    try {
      await resetPasswordRequest(email, newPassword);
      toast.success("Password reset successful. Please log in.");
      navigate("/auth");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Render Steps ---

  return (
    <div className="min-h-full w-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden h-screen">
      {/* Background Decor (Matching RightsPage) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full bg-white rounded-[24px] shadow-xl p-8 md:p-10 text-center relative z-10 border border-white/50 backdrop-blur-sm transition-all duration-300">
        {/* Step 1: Email */}
        {step === "EMAIL" && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="w-16 h-16 bg-[#EFF6FF] text-[#258CF4] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <KeyRound size={32} />
            </div>
            <h1 className="font-archivo font-bold text-2xl text-[#171A1F]">
              Forgot Password?
            </h1>
            <p className="text-[#565D6D] text-sm mb-4">
              Enter your registered email ID to receive a verification code.
            </p>

            <div className="relative text-left">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            <button
              disabled={loading}
              className="w-full h-11 bg-[#258CF4] hover:bg-[#197DCA] text-white rounded-lg font-semibold transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === "OTP" && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div className="w-16 h-16 bg-[#FFF4E5] text-[#FF9C2E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Timer size={32} />
            </div>
            <h1 className="font-archivo font-bold text-2xl text-[#171A1F]">
              Verify OTP
            </h1>
            <p className="text-[#565D6D] text-sm mb-2">
              Enter the 6-digit code sent to <br />{" "}
              <span className="font-semibold text-gray-900">{email}</span>
            </p>

            <div className="bg-orange-50 text-orange-600 text-xs font-medium py-1 px-3 rounded-full mx-auto mb-4 inline-block">
              {canResend
                ? "OTP Expired or Invalid"
                : `Expires in ${formatTime(timeLeft)}`}
            </div>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full h-12 text-center text-xl tracking-widest border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-mono"
            />

            <button
              disabled={loading || canResend}
              className={`w-full h-11 text-white rounded-lg font-semibold transition-all shadow-sm mt-2 ${
                canResend
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#258CF4] hover:bg-[#197DCA]"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={!canResend || loading}
              className={`text-sm mt-2 ${
                !canResend
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:underline"
              }`}
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === "RESET" && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="w-16 h-16 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Lock size={32} />
            </div>
            <h1 className="font-archivo font-bold text-2xl text-[#171A1F]">
              Set New Password
            </h1>
            <p className="text-[#565D6D] text-sm mb-4">
              Your identity has been verified. Set your new password.
            </p>

            {/* Email Readonly */}
            <div className="relative text-left opacity-60">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg bg-gray-50 text-sm"
              />
            </div>

            {/* New Password */}
            <div className="relative text-left">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 z-10"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password (min 8 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative text-left">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 z-10"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
              />
            </div>

            <button
              disabled={loading}
              className="w-full h-11 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold transition-all shadow-sm mt-2"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back Button */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors w-full"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-sm font-medium">
        LawGuide India © 2025
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
