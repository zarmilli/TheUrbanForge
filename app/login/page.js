"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/home");
    }
  };

  // Auto-hide error after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div
      className="relative flex flex-col justify-end h-screen text-white animate-fadeIn"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay with blur */}
      <div className="absolute inset-0 bg-[#1d1d1d]/20" />

      {/* Form section */}
      <div className="relative p-6 bg-[#1d1d1d]/90 backdrop-blur-sm rounded-t-3xl overflow-hidden">
        <h2 className="text-2xl font-semibold mb-4">Welcome Back</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-[#1d1d1d]/50 border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-[#AA3A38]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-[#1d1d1d]/50 border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-[#AA3A38]"
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
              loading
                ? "bg-[#AA3A38]/70 cursor-not-allowed"
                : "bg-[#AA3A38] hover:bg-[#ff4b1f]"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <button
          onClick={() => router.push("/signup")}
          className="mt-3 w-full text-center text-sm text-gray-300 hover:text-white transition"
        >
          Don’t have an account?{" "}
          <span className="text-[#ff4b1f]">Sign Up</span>
        </button>

        {/* Animated error popup */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
            error
              ? "bottom-6 opacity-100 translate-y-0"
              : "-bottom-10 opacity-0 translate-y-5"
          }`}
        >
          <div className="px-4 py-2 bg-[#ff4b1f]/20 text-[#ff4b1f] border border-[#ff4b1f] rounded-lg text-sm shadow-md">
            {error}
          </div>
        </div>
      </div>
    </div>
  );
}
