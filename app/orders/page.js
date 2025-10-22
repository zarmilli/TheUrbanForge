import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="flex flex-col items-center h-screen bg-white p-4">
      <h1 className="text-xl font-bold mb-4">Your Orders</h1>
      <p className="text-gray-500 mb-6">Order history will appear here.</p>
      <Link href="/profile">
        <button className="bg-green-500 text-white px-5 py-2 rounded-lg">Go to Profile</button>
      </Link>
    </div>
  );
}
