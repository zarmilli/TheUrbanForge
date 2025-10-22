"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/intro");
    }, 2000); // auto-navigate after 2 seconds
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#1d1d1d] animate-fadeIn">
      <img
        src="/logo.png" // <-- make sure your logo is in /public/logo.png
        alt="The Urban Forge Logo"
        className="w-40 h-40 object-contain"
      />
    </div>
  );
}
