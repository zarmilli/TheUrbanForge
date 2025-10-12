"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1️⃣ Create user in Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    // 2️⃣ Update the user's name in profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ name, rewards_member: false })
      .eq("id", user.id);

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    // 3️⃣ Add a new discount coupon for the user
    const { error: couponError } = await supabase.from("coupons").insert([
      {
        user_id: user.id,
        code: "NEW25",
        discount: 25,
        status: "active",
        usage_limit: 1
      },
    ]);

    if (couponError) {
      console.error("Coupon insert error:", couponError.message);
      setError("Failed to assign discount code");
      setLoading(false);
      return;
    }

    // 4️⃣ Redirect to home page
    setLoading(false);
    router.push("/home");
  };

  // Auto-hide error popup
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
        backgroundImage: "url('/signup-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#1d1d1d]/20" />

      <div className="relative p-6 bg-[#1d1d1d]/90 backdrop-blur-sm rounded-t-3xl overflow-hidden">
        <h2 className="text-2xl font-semibold mb-4">Create an Account</h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-[#1d1d1d]/50 border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-[#AA3A38]"
          />
          <input
            type="email"
            placeholder="Email Address"
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
              "Sign Up"
            )}
          </button>
        </form>

        <button
          onClick={() => router.push("/login")}
          className="mt-3 w-full text-center text-sm text-gray-300 hover:text-white transition"
        >
          Already have an account?{" "}
          <span className="text-[#ff4b1f]">Log In</span>
        </button>

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
