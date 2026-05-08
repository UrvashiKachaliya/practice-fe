import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerUser } from "../helpers/apiRequest";
import { useAuth } from "../context/AuthContext";
import { signupSchema } from "../schemas/signupSchema";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (res) => {
      login(res.data);
      toast.success("Welcome to Khakhra Co.! 🌾");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data) => {
    const { confirm, ...payload } = data;
    mutate(payload);
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50 transition";
  const errorClass = "text-red-500 text-xs mt-1.5";

  return (
    <div className="min-h-screen flex">
      {/* Left - Brand Panel */}
      <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-60px] left-[-60px] w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-80px] right-[-40px] w-80 h-80 bg-white/10 rounded-full" />

        <div className="relative z-10 text-center text-white">
          <div className="text-7xl mb-6">🌾</div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Khakhra Co.</h1>
          <p className="text-orange-100 text-lg font-medium mb-8">Join our crispy community!</p>
          <div className="flex flex-col gap-3 text-sm text-orange-100">
            <div className="flex items-center gap-3 bg-white/15 rounded-xl px-5 py-3">
              <span className="text-xl">🎁</span> Exclusive member offers
            </div>
            <div className="flex items-center gap-3 bg-white/15 rounded-xl px-5 py-3">
              <span className="text-xl">📦</span> Track your orders easily
            </div>
            <div className="flex items-center gap-3 bg-white/15 rounded-xl px-5 py-3">
              <span className="text-xl">❤️</span> Save your favourites
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-amber-50 px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="lg:hidden text-center mb-8">
            <span className="text-5xl">🌾</span>
            {/* <h1 className="text-2xl font-extrabold text-orange-500 mt-2">Khakhra Co.</h1> */}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Create your account</h2>
            <p className="text-gray-400 text-sm mb-7">Start your crispy journey today 🥗</p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" {...register("name")} placeholder="John Doe" className={inputClass} />
                  </div>
                  {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="email" {...register("email")} placeholder="you@example.com" className={inputClass} />
                  </div>
                  {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>
              </div>

              {/* Row 2: Mobile + Address */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="tel" {...register("contact")} placeholder="9876543210" className={inputClass} />
                  </div>
                  {errors.contact && <p className={errorClass}>{errors.contact.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" {...register("address")} placeholder="City, State" className={inputClass} />
                  </div>
                  {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                </div>
              </div>

              {/* Row 3: Password + Confirm */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type={showConfirm ? "text" : "password"} {...register("confirm")} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.confirm && <p className={errorClass}>{errors.confirm.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-md shadow-orange-200 disabled:opacity-60 mt-1"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : "Create Account →"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/signin" className="text-orange-500 font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
