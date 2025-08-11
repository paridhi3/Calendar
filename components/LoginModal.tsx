"use client";
import React from "react";
import ReactDOM from "react-dom";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center relative mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl font-bold cursor-pointer"
          aria-label="Close login modal"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">Login</h2>

        {/* Google Login Button */}
        <div className="flex items-center justify-center">
          <button
            className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150 cursor-pointer"
            onClick={() => {
              onClose();
              signIn("google", { callbackUrl: "/" });
            }}
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google logo"
              width={24}
              height={24}
              className="w-6 h-6"
              priority
            />
            <span>Login with Google</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}