"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBillingStatus } from "@/lib/billingApi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuth();

  const [plan, setPlan] = useState("FREE");

  useEffect(() => {
    async function loadBillingStatus() {
      try {
        const data = await getBillingStatus();
        setPlan(data.subscriptionPlan);
      } catch {
        setPlan("FREE");
      }
    }

    loadBillingStatus();
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      {/* Sidebar */}
      <aside className="bg-slate-900 text-white p-4 md:min-h-screen md:w-64 md:p-6">
        {/* <aside className="w-64 bg-slate-900 text-white p-6"> */}
        <h1 className="text-xl font-bold mb-8">Mini CRM</h1>

        <div className="mb-6 rounded-lg bg-slate-800 px-3 py-2 text-sm">
          Plan:{" "}
          <span
            className={plan === "PRO" ? "text-green-400" : "text-yellow-300"}
          >
            {plan}
          </span>
        </div>

        <nav className="flex flex-wrap gap-3 md:block md:space-y-3">
          {/* <nav className="space-y-3"> */}
          <Link className="block hover:text-blue-300" href="/">
            Dashboard
          </Link>

          <Link className="block hover:text-blue-300" href="/clients">
            Clients
          </Link>

          <Link className="block hover:text-blue-300" href="/projects">
            Projects
          </Link>

          <Link className="block hover:text-blue-300" href="/invoices">
            Invoices
          </Link>

          <Link className="block hover:text-blue-300" href="/upgrade">
            {plan === "PRO" ? "Billing" : "Upgrade"}
          </Link>

          {/* {plan !== "PRO" && (
            <Link className="block hover:text-blue-300" href="/upgrade">
              Upgrade
            </Link>
          )} */}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full rounded bg-red-600 py-2 text-sm hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      {/* <main className="flex-1 p-8">{children}</main> */}
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
