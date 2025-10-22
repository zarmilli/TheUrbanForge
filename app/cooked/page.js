"use client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { FiShoppingCart, FiArrowUpRight, FiArrowLeft, FiTrash2 } from "react-icons/fi"
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

export default function CookedPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasCartItems, setHasCartItems] = useState(false)
  const [total, setTotal] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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

  // ✅ Fetch cart items with product details
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

  // ✅ Fetch cart when drawer opens
  useEffect(() => {
    if (isDrawerOpen) fetchCartItems()
  }, [isDrawerOpen, fetchCartItems])

  const cards = [
    { title: "Meals", description: "Full-course dishes prepared for your cravings.", image: "/meals.jpg", link: "/cooked/meals" },
    { title: "Burgers", description: "Juicy handcrafted burgers made fresh daily.", image: "/burgers.jpg", link: "/cooked/burgers" },
    { title: "Extras", description: "Fries, wings, and more to complete your meal.", image: "/extras.jpg", link: "/cooked/extras" },
    { title: "Dessert", description: "Sweet treats to end your meal perfectly.", image: "/dessert.jpg", link: "/cooked/dessert" },
    { title: "Drinks", description: "Refreshing beverages to go with your order.", image: "/drinks.jpg", link: "/cooked/drinks" },
  ]

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

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <div className="relative cursor-pointer">
              <FiShoppingCart size={26} className="hover:text-[#ff4b1f] transition" />
              {hasCartItems && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ff4b1f] rounded-full" />
              )}
            </div>
          </DrawerTrigger>

          <DrawerContent className="max-h-[85vh] overflow-hidden z-[10000]">
            <DrawerHeader>
              <DrawerTitle>Your Cart</DrawerTitle>
              <DrawerDescription>Review your items before checkout.</DrawerDescription>
            </DrawerHeader>

            {loading ? (
              <DrawerSkeleton />
            ) : cartItems.length === 0 ? (
              <div className="text-center py-10 text-gray-400">Your cart is empty.</div>
            ) : (
              <DrawerBody className="max-h-[60vh] overflow-y-auto no-scrollbar space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-[#1e1e1e] p-3 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{item.product?.name}</h3>
                        <p className="text-sm text-gray-400">
                          Qty: {item.quantity} × R{item.product?.price}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCartItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
              </DrawerBody>
            )}

            <DrawerFooter>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>R{total.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-[#ff4b1f] text-white hover:bg-[#ff4b1f]/90">
                Checkout
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
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
    </div>
  )
}
