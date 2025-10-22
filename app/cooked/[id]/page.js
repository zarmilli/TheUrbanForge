"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { FiArrowLeft } from "react-icons/fi"
import Image from "next/image"
import { toast, Toaster } from "sonner"

export default function ProductDetailsPage() {
  const router = useRouter()
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  // ✅ Fetch product + user
  useEffect(() => {
    const fetchProduct = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/intro")
        return
      }
      setUserId(user.id)

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

      if (!error) setProduct(data)
      setLoading(false)
    }

    fetchProduct()
  }, [id, router])

  // ✅ Add to cart with Sonner promise toast
  const handleAddToCart = async () => {
  if (!userId || !product) return;

  toast.promise(
    (async () => {
      const { data: existingItem, error: checkError } = await supabase
        .from("carts")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("product_id", product.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingItem) {
        const { error: updateError } = await supabase
          .from("carts")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("carts")
          .insert([{ user_id: userId, product_id: product.id, quantity: 1 }]);
        if (insertError) throw insertError;
      }
    })(),
    {
      loading: "Adding to cart...",
      success: "Added to cart!",
      error: "Error adding to cart",
    }
  );
};


  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      {/* Toast Container */}
      <Toaster position="bottom-center" richColors />

      {/* Skeleton Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 animate-pulse p-6">
          <div className="w-full h-72 bg-white/10 rounded-xl"></div>
          <div className="w-3/4 h-6 bg-white/10 rounded"></div>
          <div className="w-2/3 h-4 bg-white/10 rounded"></div>
          <div className="w-1/2 h-10 bg-white/10 rounded mt-6"></div>
        </div>
      ) : (
        product && (
          <>
            {/* Product Image */}
            <div className="relative w-full h-[45vh]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className="absolute top-5 left-5 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 transition"
              >
                <FiArrowLeft size={20} />
              </button>

              {/* Tag */}
              {product.tag && (
                <span className="absolute top-5 right-5 bg-[#ff4b1f] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 px-6 py-8 pb-28">
              <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
              <p className="text-[#ff4b1f] text-lg mb-3">R{product.price}</p>
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
            <div className="fixed bottom-0 left-0 w-full bg-black/90 p-4 border-t border-white/10">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 rounded-full font-semibold bg-[#ff4b1f] hover:bg-[#ff5f33] transition"
              >
                Add to Cart
              </button>
            </div>
          </>
        )
      )}
    </div>
  )
}
