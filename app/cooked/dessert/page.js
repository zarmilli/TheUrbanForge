"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerSkeleton,
} from "@/components/ui/drawer";
import { FiArrowLeft, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function MealsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [hasCartItems, setHasCartItems] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user + cart presence + meals
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/intro");

      const { data: cartData } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id);

      setHasCartItems(cartData && cartData.length > 0);

      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, price, prep_time, image, tag")
        .eq("category", "Desserts")
        .eq("type", "Prepared");

      if (!error) setProducts(data || []);
      setLoading(false);
    };
    fetchData();
  }, [router]);

  // ✅ Fetch full cart items
  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: cartData, error: cartError } = await supabase
      .from("carts")
      .select("id, product_id, quantity")
      .eq("user_id", user.id);

    if (cartError) {
      console.error("Error fetching cart:", cartError);
      setLoading(false);
      return;
    }

    if (!cartData?.length) {
      setCartItems([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    const productIds = cartData.map((c) => c.product_id);
    const { data: productsData } = await supabase
      .from("products")
      .select("id, name, description, price, image")
      .in("id", productIds);

    const merged = cartData.map((cart) => {
      const product = productsData.find((p) => p.id === cart.product_id);
      return {
        ...cart,
        product,
        totalPrice: product ? product.price * cart.quantity : 0,
      };
    });

    setCartItems(merged);
    setTotal(merged.reduce((sum, item) => sum + item.totalPrice, 0));
    setLoading(false);
  }, []);

  // ✅ Delete item from cart
  const deleteCartItem = async (cartId) => {
    const { error } = await supabase.from("carts").delete().eq("id", cartId);
    if (error) console.error(error);
    else {
      const updated = cartItems.filter((item) => item.id !== cartId);
      setCartItems(updated);
      setTotal(updated.reduce((sum, item) => sum + item.totalPrice, 0));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-white relative">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 z-[9999]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/home")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold">Dessert</h1>
        </div>

        {/* ✅ Cart Drawer */}
        <Drawer onOpenChange={(open) => open && fetchCartItems()}>
          <DrawerTrigger asChild>
            <div className="relative cursor-pointer">
              <FiShoppingCart
                size={26}
                className="hover:text-[#ff4b1f] transition"
              />
              {hasCartItems && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ff4b1f] rounded-full" />
              )}
            </div>
          </DrawerTrigger>

          <DrawerContent className="z-[10000] bg-[#111111] text-white border-none">
            <DrawerHeader>
              <DrawerTitle>Your Cart</DrawerTitle>
              <DrawerDescription>
                Review your selected meals below
              </DrawerDescription>
            </DrawerHeader>

            {/* ✅ Scrollable area */}
            <DrawerBody className="max-h-[85vh] overflow-y-auto px-6 pb-6">
              {loading ? (
                            <DrawerSkeleton />
                          ) : cartItems.length === 0 ? (
                <p className="text-gray-400">Your cart is empty.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5"
                    >
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product?.name}</h3>
                        <p className="text-sm text-gray-400">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-[#ff4b1f]">
                          R{item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteCartItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </DrawerBody>

            <DrawerFooter className="border-t border-white/10 px-6 py-4">
              <div className="flex justify-between text-lg font-semibold mb-3">
                <span>Total</span>
                <span className="text-[#ff4b1f]">R{total.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-[#ff4b1f] hover:bg-[#e13e12] text-white">
                Checkout
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-6 p-6 pb-10">
        {loading ? (
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
