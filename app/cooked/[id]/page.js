"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { FiArrowLeft } from "react-icons/fi";
import Image from "next/image";

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      // ✅ Check if user is signed in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/intro");
        return;
      }
      setUserId(user.id);

      // ✅ Fetch product details
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id, router]);

  const handleAddToCart = async () => {
    if (!userId || !product) return;
    setAdding(true);

    try {
      // ✅ Check if product already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from("carts")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("product_id", product.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingItem) {
        // ✅ Update quantity
        const { error: updateError } = await supabase
          .from("carts")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);

        if (updateError) throw updateError;
      } else {
        // ✅ Insert new row
        const { error: insertError } = await supabase.from("carts").insert([
          {
            user_id: userId,
            product_id: product.id,
            quantity: 1,
          },
        ]);

        if (insertError) throw insertError;
      }

      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Error adding to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold">Details</h1>
        <div className="w-10" /> {/* Spacer for symmetry */}
      </div>

      {/* Skeleton Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 animate-pulse">
          <div className="w-[90%] h-64 bg-white/10 rounded-2xl"></div>
          <div className="w-3/4 h-6 bg-white/10 rounded"></div>
          <div className="w-2/3 h-4 bg-white/10 rounded"></div>
          <div className="w-1/2 h-10 bg-white/10 rounded mt-6"></div>
        </div>
      ) : (
        product && (
          <div className="flex flex-col p-6 space-y-6">
            {/* Product Image */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.tag && (
                <span className="absolute top-3 left-3 bg-[#ff4b1f] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Product Details */}
            <div>
              <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
              <p className="text-[#ff4b1f] text-lg mb-2">R{product.price}</p>
              {product.prep_time && (
                <p className="text-gray-400 text-sm mb-2">
                  Prep Time: {product.prep_time} min
                </p>
              )}
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`mt-4 w-full py-3 rounded-full font-semibold transition ${
                adding
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#ff4b1f] hover:bg-[#ff5f33]"
              }`}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        )
      )}
    </div>
  );
}
