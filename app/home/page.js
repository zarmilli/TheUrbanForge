"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  FiShoppingCart,
  FiArrowUpRight,
} from "react-icons/fi";

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [hasCartItems, setHasCartItems] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/intro");
        return;
      }

      // Get profile name
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (profile) setUserName(profile.name);

      // Check for cart items
      const { data: cartItems } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id);

      setHasCartItems(cartItems && cartItems.length > 0);
    };

    checkUser();
  }, [router]);

  const cards = [
    {
      title: "Prepared",
      description: "Freshly cooked meals made just for you.",
      image: "/prepared-bg.jpg",
      link: "/cooked",
    },
    {
      title: "Frozen",
      description: "Ready-to-cook frozen options.",
      image: "/frozen-bg.jpg",
      link: "/raw",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#000000] text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold">
          Hi, <span className="text-white">{userName || "User"}</span>
        </h1>
        <div className="relative">
          <FiShoppingCart
            size={26}
            className="cursor-pointer hover:text-[#ff4b1f] transition"
            onClick={() => router.push("/cart")}
          />
          {hasCartItems && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ff4b1f] rounded-full" />
          )}
        </div>
      </div>

      {/* Main body */}
      {/* 👇 Added pb-[88px] to make room for navbar (height + spacing) */}
      <div className="flex flex-col flex-1 gap-4 p-6 pb-[88px]">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative flex-1 rounded-2xl overflow-hidden group"
            style={{
              backgroundImage: `url(${card.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />

            {/* Text */}
            <div className="absolute top-4 left-4 z-10">
              <h2 className="text-2xl font-semibold">{card.title}</h2>
              <p className="text-sm opacity-80">{card.description}</p>
            </div>

            {/* Arrow button */}
            <button
              onClick={() => router.push(card.link)}
              className="absolute bottom-4 right-4 w-14 h-14 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
            >
              <FiArrowUpRight size={28} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
