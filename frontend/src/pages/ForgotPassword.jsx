import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword } from "../helpers/apiRequest";
import { FiMail } from "react-icons/fi";

const schema = z.object({ email: z.string().email("Enter a valid email") });

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: forgotPassword,
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-10 w-full max-w-md text-center">
          <div className="text-5xl mb-4">📨</div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">Check your inbox</h2>
          <p className="text-gray-400 text-sm mb-6">
            We've sent a password reset link to your email. It expires in 1 hour.
          </p>
          <Link to="/signin" className="text-orange-500 font-semibold hover:underline text-sm">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-10 w-full max-w-md">
        <div className="text-5xl mb-4 text-center">🔑</div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-1 text-center">Forgot password?</h2>
        <p className="text-gray-400 text-sm mb-7 text-center">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit((data) => mutate(data))} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-md shadow-orange-200 disabled:opacity-60"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : "Send Reset Link →"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link to="/signin" className="text-sm text-orange-500 font-semibold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
