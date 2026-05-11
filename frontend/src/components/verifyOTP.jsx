import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthPrompt } from "../context/AuthPromptContext";

export default function AuthPromptModal() {
  const { open, redirectTo, closeAuthPrompt } = useAuthPrompt();
  const navigate = useNavigate();

  if (!open) return null;

  const go = (path) => {
    closeAuthPrompt();
    navigate(path, redirectTo ? { state: { from: redirectTo } } : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-orange-100 w-full max-w-sm p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-extrabold text-gray-800 mb-1">Verify your account</h2>
        <p className="text-gray-400 text-sm mb-7">
         Please verify your email to continue.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => go("/signin")}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-md shadow-orange-200"
          >
            Sign In
          </button>
          <button
            onClick={() => go("/signup")}
            className="w-full border border-orange-300 text-orange-500 py-3 rounded-xl font-bold text-sm hover:bg-orange-50 transition-all"
          >
            Create Account
          </button>
          <button
            onClick={closeAuthPrompt}
            className="text-sm text-gray-400 hover:text-gray-600 mt-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
