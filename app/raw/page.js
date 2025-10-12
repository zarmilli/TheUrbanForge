import Link from "next/link";

export default function RawCatalogue() {
  return (
    <div className="flex flex-col items-center h-screen bg-white p-4">
      <h1 className="text-xl font-bold mb-4">Raw Catalogue</h1>
      <p className="text-gray-500 mb-6">List of available raw meals will appear here.</p>
      <Link href="/cart">
        <button className="bg-green-500 text-white px-5 py-2 rounded-lg">View Cart</button>
      </Link>
    </div>
  );
}
