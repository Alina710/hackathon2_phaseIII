"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, isMounted } = useAuth();

  useEffect(() => {
    if (isMounted && !isLoading) {
      if (isAuthenticated) {
        router.push("/todos");
      } else {
        router.push("/signin");
      }
    }
  }, [isAuthenticated, isLoading, isMounted, router]);

  // Show loading state while checking auth
  // Use suppressHydrationWarning to prevent hydration mismatch during initial render
  return (
    <main className="min-h-screen flex items-center justify-center" suppressHydrationWarning>
      <div className="animate-pulse text-gray-500">Loading...</div>
    </main>
  );
}
