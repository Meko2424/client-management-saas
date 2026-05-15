"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageLoader } from "@/components/LoadingStates";

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
    return <PageLoader message="Checking authentication..." />;
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
