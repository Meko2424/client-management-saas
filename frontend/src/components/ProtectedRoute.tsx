"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Prevent page from flashing before token check finishes
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Get JWT token from localStorage
    const token = localStorage.getItem("token");

    // If no token exists, redirect to login
    if (!token) {
      router.push("/login");
      return;
    }

    // Token exists, allow page to show
    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) {
    return <p className="p-6">Checking authentication...</p>;
  }

  return <>{children}</>;
}
