import Link from "next/link";

export default function CartPage() {
  return (
    <div className="flex flex-col h-screen bg-white p-4">
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>
      <p className="text-gray-500 flex-1">Items you add will appear here.</p>
      <div className="mt-auto flex justify-between">
        <Link href="/home">
          <button className="border border-gray-400 text-gray-600 px-4 py-2 rounded-lg">Continue Shopping</button>
        </Link>
        <Link href="/orders">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Checkout</button>
        </Link>
      </div>
    </div>
  );
}
