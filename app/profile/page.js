import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white p-4">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <p className="text-gray-500 mb-6">Your personal details and settings.</p>
      <Link href="/home">
        <button className="bg-green-500 text-white px-5 py-2 rounded-lg">Back to Home</button>
      </Link>
    </div>
  );
}
