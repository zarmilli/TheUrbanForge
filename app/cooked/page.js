"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  FiShoppingCart,
  FiArrowUpRight,
  FiArrowLeft,
} from "react-icons/fi";

export default function CookedPage() {
  const router = useRouter();
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
      title: "Meals",
      description: "Full-course dishes prepared for your cravings.",
      image: "/meals.jpg",
      link: "/cooked/meals",
    },
    {
      title: "Burgers",
      description: "Juicy handcrafted burgers made fresh daily.",
      image: "/burgers.jpg",
      link: "/cooked/burgers",
    },
    {
      title: "Extras",
      description: "Fries, wings, and more to complete your meal.",
      image: "/extras.jpg",
      link: "/cooked/extras",
    },
    {
      title: "Dessert",
      description: "Sweet treats to end your meal perfectly.",
      image: "/dessert.jpg",
      link: "/cooked/dessert",
    },
    {
      title: "Drinks",
      description: "Refreshing beverages to go with your order.",
      image: "/drinks.jpg",
      link: "/cooked/drinks",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <FiArrowLeft
            size={22}
            className="cursor-pointer hover:text-[#ff4b1f] transition"
            onClick={() => router.push("/")}
          />
          <h1 className="text-2xl font-semibold">Prepared</h1>
        </div>

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
      <div className="flex flex-col flex-1 gap-4 p-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative w-full rounded-2xl overflow-hidden group"
            style={{
              height: "240px",
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
