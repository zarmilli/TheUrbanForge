"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Navbar from "@/components/navbar"
import { FiShoppingCart, FiArrowUpRight, FiTrash2 } from "react-icons/fi"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/drawer"

export default function HomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [hasCartItems, setHasCartItems] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // ✅ Fetch user profile and basic cart info
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push("/intro")

      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single()
      if (profile) setUserName(profile.name)

      const { data: cartData } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
      setHasCartItems(cartData && cartData.length > 0)
    }
    checkUser()
  }, [router])

  // ✅ Fetch cart items
  const fetchCartItems = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: cartData, error: cartError } = await supabase
      .from("carts")
      .select("id, product_id, quantity")
      .eq("user_id", user.id)

    if (cartError) {
      console.error("Error fetching cart:", cartError)
      setLoading(false)
      return
    }

    if (!cartData?.length) {
      setCartItems([])
      setTotal(0)
      setLoading(false)
      return
    }

    const productIds = cartData.map((c) => c.product_id)
    const { data: productsData } = await supabase
      .from("products")
      .select("id, name, description, price, image")
      .in("id", productIds)

    const merged = cartData.map((cart) => {
      const product = productsData.find((p) => p.id === cart.product_id)
      return {
        ...cart,
        product,
        totalPrice: product ? product.price * cart.quantity : 0,
      }
    })

    setCartItems(merged)
    setTotal(merged.reduce((sum, item) => sum + item.totalPrice, 0))
    setLoading(false)
  }, [])

  // ✅ Delete cart item
  const deleteCartItem = async (cartId) => {
    const { error } = await supabase.from("carts").delete().eq("id", cartId)
    if (error) console.error(error)
    else {
      const updated = cartItems.filter((item) => item.id !== cartId)
      setCartItems(updated)
      setTotal(updated.reduce((sum, item) => sum + item.totalPrice, 0))
    }
  }

  // ✅ Product cards
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
  ]

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold">
          Hi, <span className="text-white">{userName || "User"}</span>
        </h1>
        <div className="relative">
          <FiShoppingCart
            size={26}
            className="cursor-pointer hover:text-[#ff4b1f] transition"
            onClick={async () => {
              await fetchCartItems()
              setIsDrawerOpen(true)
            }}
          />
          {hasCartItems && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ff4b1f] rounded-full" />
          )}
        </div>
      </div>

      {/* Product cards */}
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
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />
            <div className="absolute top-4 left-4 z-10">
              <h2 className="text-2xl font-semibold">{card.title}</h2>
              <p className="text-sm opacity-80">{card.description}</p>
            </div>
            <button
              onClick={() => router.push(card.link)}
              className="absolute bottom-4 right-4 w-14 h-14 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
            >
              <FiArrowUpRight size={28} />
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Cart Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent
          className={`fixed inset-x-0 bottom-0 z-[10000] mx-auto w-full max-w-md rounded-t-2xl bg-[#111] shadow-xl ${
            !isDrawerOpen ? "slide-down" : ""
          }`}
          style={{ maxHeight: "85vh" }}
        >
          <DrawerHeader className="px-6 pt-4 pb-2 border-b border-gray-800">
            <DrawerTitle className="text-left text-lg font-semibold">
              Your Cart
            </DrawerTitle>
            <DrawerDescription className="text-left text-sm text-gray-400">
              Review your selected items
            </DrawerDescription>
          </DrawerHeader>

          <DrawerBody
            className="px-6 py-4 overflow-y-scroll space-y-4"
            style={{
              maxHeight: "calc(85vh - 150px)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {loading ? (
              <DrawerSkeleton />
            ) : cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[#1c1c1c] rounded-xl p-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium">{item.product?.name}</h4>
                      <p className="text-sm text-gray-400">
                        {item.quantity} × R{item.product?.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold">
                      R{item.totalPrice.toFixed(2)}
                    </p>
                    <button
                      onClick={() => deleteCartItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">
                Your cart is empty
              </p>
            )}
          </DrawerBody>

          <DrawerFooter className="px-6 py-4 border-t border-gray-800 bg-[#111] sticky bottom-0">
            <div className="flex justify-between items-center mb-3 text-white">
              <span>Total</span>
              <span className="font-semibold">R{total.toFixed(2)}</span>
            </div>
            <Button
              className="w-full bg-[#ff4b1f] hover:bg-[#ff6a3d] text-white rounded-xl mt-3"
              onClick={() => router.push("/checkout")}
            >
              Checkout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Navbar */}
      <Navbar />
    </div>
  )
}
