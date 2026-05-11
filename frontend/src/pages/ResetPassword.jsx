import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPassword } from "../helpers/apiRequest";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { resetPasswordSchema } from "../schemas/resetpasswordSchema";


function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset! Please sign in.");
      navigate("/signin", { replace: true });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-10 w-full max-w-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">Invalid reset link</h2>
          <p className="text-gray-400 text-sm mb-6">This link is invalid or has expired.</p>
          <Link to="/forgot-password" className="text-orange-500 font-semibold hover:underline text-sm">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-10 w-full max-w-md">
        <div className="text-5xl mb-4 text-center">🔒</div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-1 text-center">Set new password</h2>
        <p className="text-gray-400 text-sm mb-7 text-center">Choose a strong password for your account.</p>

        <form onSubmit={handleSubmit((data) => mutate({ token, password: data.password }))} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="••••••••" className={inputClass} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type={showConfirm ? "text" : "password"} {...register("confirm")} placeholder="••••••••" className={inputClass} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.confirm && <p className="text-red-500 text-xs mt-1.5">{errors.confirm.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-md shadow-orange-200 disabled:opacity-60 mt-1"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resetting...
              </span>
            ) : "Reset Password →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
