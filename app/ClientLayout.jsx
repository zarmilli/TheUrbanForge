"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const showNavbar = ["/home", "/orders", "/settings", "/cooked", "/cooked/meals"].includes(pathname);

  return (
    <div className="relative min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      {showNavbar && <Navbar />}
    </div>
  );
}
