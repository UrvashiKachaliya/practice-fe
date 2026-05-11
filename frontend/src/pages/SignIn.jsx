import React, { useState } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginUser } from "../helpers/apiRequest";
import { useAuth } from "../context/AuthContext";
import { signinSchema } from "../schemas/signinSchema";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
  });
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      login(res.data);
      toast.success("Welcome back! 🌾");
      navigate(from, { replace: true });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  // Already logged in — redirect away
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex">
      {/* Left - Brand Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute top-[-60px] left-[-60px] w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-80px] right-[-40px] w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 right-[-30px] w-40 h-40 bg-white/10 rounded-full" />

        <div className="relative z-10 text-center text-white">
          <div className="text-7xl mb-6">🌾</div>
          {/* <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Khakhra Co.</h1> */}
          <p className="text-orange-100 text-lg font-medium mb-8">
            Crispy. Healthy. Delicious.
          </p>
          <div className="flex flex-col gap-3 text-sm text-orange-100">
            <div className="flex items-center gap-3 bg-white/15 rounded-xl px-5 py-3">
              <span className="text-xl">🥗</span> 100% Natural Ingredients
            </div>
            <div className="flex items-center gap-3 bg-white/15 rounded-xl px-5 py-3">
              <span className="text-xl">🚚</span> Free Delivery on ₹499+
            </div>
            <div className="flex items-center gap-3 bg-white/15 rounded-xl px-5 py-3">
              <span className="text-xl">⭐</span> 10,000+ Happy Customers
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-amber-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-5xl">🌾</span>
            {/* <h1 className="text-2xl font-extrabold text-orange-500 mt-2">Khakhra Co.</h1> */}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
              Welcome back!
            </h2>
            <p className="text-gray-400 text-sm mb-7">
              Sign in to your account to continue
            </p>

            <form
              onSubmit={handleSubmit((data) => mutate(data))}
              className="flex flex-col gap-5"
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={17}
                  />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50 transition"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={17}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <FiEyeOff size={17} />
                    ) : (
                      <FiEye size={17} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end text-sm font-semibold text-gray-700">
                <Link
                  to="/forgot-password"
                  className="text-orange-500 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-md shadow-orange-200 disabled:opacity-60 mt-1"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {/* New to Khakhra Co.?{" "} */}
                <Link
                  to="/signup"
                  className="text-orange-500 font-semibold hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
