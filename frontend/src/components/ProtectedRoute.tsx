// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function ProtectedRoute({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();

//   // Prevent page from flashing before token check finishes
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   useEffect(() => {
//     // Get JWT token from localStorage
//     const token = localStorage.getItem("token");

//     // If no token exists, redirect to login
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     // Token exists, allow page to show
//     setCheckingAuth(false);
//   }, [router]);

//   if (checkingAuth) {
//     return <p className="p-6">Checking authentication...</p>;
//   }

//   return <>{children}</>;
// }

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

  if (authLoading) {
    return <p className="p-6">Checking authentication...</p>;
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
