"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { FiArrowLeft, FiShoppingCart } from "react-icons/fi";

export default function MealsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [hasCartItems, setHasCartItems] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/intro");
        return;
      }

      const { data: cartItems } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id);
      setHasCartItems(cartItems && cartItems.length > 0);

      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, price, prep_time, image, tag")
        .eq("category", "Dessert")
        .eq("type", "Prepared");

      if (!error) setProducts(data || []);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/home")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold">Dessert</h1>
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

      {/* Product List */}
      <div className="flex flex-col gap-6 p-6 pb-10">
        {loading ? (
          // ✅ Skeleton Loader
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse w-full rounded-2xl overflow-hidden bg-white/10"
            >
              <div className="w-full h-56 bg-white/10" />
              <div className="p-4">
                <div className="h-6 bg-white/10 rounded mb-2 w-1/2" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
            </div>
          ))
        ) : (
          products.map((item) => (
            <div
              key={item.id}
              className="relative w-full rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm"
            >
              {/* Image */}
              <div
                className="relative w-full h-56 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                {item.tag && (
                  <span className="absolute top-3 left-3 bg-[#ff4b1f] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                    {item.tag}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex justify-between items-start p-4">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-400">
                    {item.description && item.description.length > 20
                      ? item.description.substring(0, 20) + "..."
                      : item.description}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-[#ff4b1f]">
                    R{item.price}
                  </p>
                  {item.prep_time && (
                    <p className="text-xs text-gray-400">{item.prep_time} min</p>
                  )}
                </div>
              </div>

              {/* Clickable area */}
              <button
                onClick={() => router.push(`/cooked/${item.id}`)}
                className="absolute inset-0"
                aria-label={`View ${item.name}`}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
