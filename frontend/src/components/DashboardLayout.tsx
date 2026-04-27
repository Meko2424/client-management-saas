"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-xl font-bold mb-8">Mini CRM</h1>

        <nav className="space-y-3">
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
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full rounded bg-red-600 py-2 text-sm hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
