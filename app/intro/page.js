"use client";
import { useRouter } from "next/navigation";

export default function IntroPage() {
  const router = useRouter();

  return (
    <div 
      className="relative flex flex-col justify-between h-screen text-white animate-fadeIn"
      style={{
        backgroundImage: "url('/intro-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay with dark tint + blur */}
      <div className="absolute inset-0 bg-[#1d1d1d]/30 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative flex flex-col justify-between h-full px-6 py-8">
        
        {/* Heading */}
        <h1 className="text-3xl font-semibold max-w-[250px]">
          Delicious meals delivered fast.
        </h1>

        {/* Buttons */}
        <div className="flex justify-between gap-4 mb-8">
          <button
            onClick={() => router.push("/login")}
            className="flex-1 bg-[#AA3A38] text-white py-3 rounded-xl font-medium hover:bg-[#ff4b1f] transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="flex-1 border border-white text-white py-3 rounded-xl font-medium hover:bg-white hover:text-[#1d1d1d] transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
