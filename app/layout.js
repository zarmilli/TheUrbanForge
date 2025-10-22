import "./globals.css";
import ClientLayout from "./ClientLayout";
import PWAInstallPrompt from "./PWAInstallPrompt";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "The Urban Forge",
  description: "Delicious meals delivered fast.",
  manifest: "/manifest.json",
  themeColor: "#1d1d1d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#1d1d1d] text-white relative">
        <ClientLayout>{children}</ClientLayout>
        <PWAInstallPrompt />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
