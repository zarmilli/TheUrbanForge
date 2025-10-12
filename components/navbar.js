"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPackage, FiUser, FiHome } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    { name: "Home", icon: FiHome, path: "/home" },
    { name: "Orders", icon: FiPackage, path: "/orders" },
    { name: "Profile", icon: FiUser, path: "/settings" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="
            fixed bottom-5 inset-x-0
            mx-auto flex justify-around items-center
            w-[92%] max-w-[420px] py-3
            rounded-2xl bg-white/10 backdrop-blur-md
            border border-white/20
            text-gray-300 z-[9999]
            shadow-lg
          "
        >
          {navItems.map(({ name, icon: Icon, path }) => {
            const active = pathname === path;

            return (
              <motion.button
                key={path}
                onClick={() => router.push(path)}
                className="relative flex flex-col items-center justify-center w-1/3"
              >
                <motion.div
                  animate={{
                    y: active ? -6 : 0,
                    color: active ? "#fff" : "#aaa",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Icon size={22} />
                </motion.div>

                <AnimatePresence>
                  {active && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] text-white mt-1"
                    >
                      {name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* ✅ Bottom underline indicator (moved from top) */}
                {active && (
                  <motion.div
                    layoutId="active-underline"
                    className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
