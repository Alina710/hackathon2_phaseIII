"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export function SignInForm() {
  const router = useRouter();
  const { signin, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await signin(email, password);
      router.push("/todos");
    } catch {
      // Error is handled by useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Input
        type="email"
        label="Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="you@example.com"
      />

      <Input
        type="password"
        label="Password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Your password"
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
