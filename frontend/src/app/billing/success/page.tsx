"use client";

import Link from "next/link";

export default function BillingSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-3">
          Payment successful
        </h1>
        <p className="text-gray-600 mb-6">
          Your subscription is being activated. You can return to the dashboard.
        </p>
        <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded">
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
