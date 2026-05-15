import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPhone, FiMapPin, FiArrowLeft, FiMail } from "react-icons/fi";
import { updateProfile } from "../helpers/apiRequest";
import { editProfileSchema } from "../schemas/editprofileSchema";


function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || "",
      contact: user?.contact || "",
      address: user?.address || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      updateUser(res.data.user);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    },
  });

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50 transition";

  return (
    <div className="min-h-screen bg-amber-50 py-10 px-4">
      <div className="max-w-lg mx-auto">

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 mb-6 font-medium transition"
        >
          <FiArrowLeft /> Back to Profile
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-8 py-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-extrabold shrink-0">
              {initials}
            </div>
            <div className="text-white">
              <h2 className="text-xl font-extrabold">Edit Profile</h2>
              <p className="text-orange-100 text-sm">Update your personal information</p>
            </div>
          </div>

          {/* Read-only Email */}
          <div className="px-8 pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit((data) => mutate(data))} className="px-8 pb-8 pt-4 flex flex-col gap-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input {...register("name")} placeholder="Your full name" className={inputClass} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input {...register("contact")} placeholder="10-digit mobile number" className={inputClass} />
              </div>
              {errors.contact && <p className="text-red-500 text-xs mt-1.5">{errors.contact.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input {...register("address")} placeholder="Your address" className={inputClass} />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 disabled:opacity-60 transition-all"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
