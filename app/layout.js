import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "The Urban Forge",
  description: "Delicious meals delivered fast.",
  manifest: "/manifest.json",
  themeColor: "#1d1d1d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#1d1d1d] text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
