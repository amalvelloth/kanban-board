import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { Lock, Eye, EyeOff } from 'lucide-react';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      return handleError("All fields are required");
    }
    if (newPassword !== confirmPassword) {
      return handleError("Passwords do not match");
    }
    if (newPassword.length < 4) {
      return handleError("Password must be at least 4 characters long");
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const result = await response.json();
      setLoading(false);

      if (result.success) {
        handleSuccess(result.message || "Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        handleError(result.message || "Failed to reset password");
      }
    } catch (err) {
      setLoading(false);
      handleError("Server connection error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0d14] text-white">
      <div className="w-full max-w-md p-8 glass-effect-1 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-sm text-center text-neutral-400 mb-6">
          Enter a new password for <span className="text-blue-400">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative flex items-center">
            <Lock className="absolute left-3 text-neutral-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-2.5 pl-10 pr-10 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-neutral-400 hover:text-white"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div className="relative flex items-center">
            <Lock className="absolute left-3 text-neutral-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-2.5 pl-10 pr-10 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
