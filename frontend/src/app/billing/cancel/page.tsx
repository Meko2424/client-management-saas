import Link from "next/link";

export default function BillingCancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold mb-3">Payment canceled</h1>
        <p className="text-gray-600 mb-6">
          No changes were made to your subscription.
        </p>
        <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
