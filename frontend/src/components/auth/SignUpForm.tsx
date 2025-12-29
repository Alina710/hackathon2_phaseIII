"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export function SignUpForm() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    try {
      await signup(email, password);
      router.push("/todos");
    } catch {
      // Error is handled by useAuth hook
    }
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

      {displayError && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {displayError}
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
        placeholder="At least 8 characters"
        minLength={8}
      />

      <Input
        type="password"
        label="Confirm Password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        placeholder="Confirm your password"
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Sign Up
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/signin" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
