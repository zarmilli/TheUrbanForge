"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // ✅ Only trigger on home page
    if (pathname !== "/home") return;

    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (isInstalled) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [pathname]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallPrompt(false);
    }
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed top-[10px] left-[10px] right-[10px] bg-[#1c1c1c]/95 border border-[#333] backdrop-blur-md text-white z-50 shadow-lg rounded-2xl animate-fadeSlideDown">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white">
            Install The Urban Forge
          </h3>
          <p className="text-sm text-gray-300">
            Get access to more deals
          </p>
        </div>

        <div className="flex items-center gap-3 ml-3">
          <button
            onClick={handleInstallClick}
            className="bg-[#ffb800] text-black px-4 py-2 rounded-xl font-medium hover:bg-[#ffd24d] transition-all"
          >
            Install
          </button>
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="text-gray-400 hover:text-white text-xl font-bold leading-none transition-all"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlideDown {
          animation: fadeSlideDown 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
