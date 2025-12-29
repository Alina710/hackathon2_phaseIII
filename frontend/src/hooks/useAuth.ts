"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "@/lib/types";
import { authApi } from "@/lib/auth";
import { ApiClientError } from "@/lib/api";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMounted: boolean;
  error: string | null;
  signup: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getSession();
      setUser(response.user);
      setError(null);
    } catch (err) {
      setUser(null);
      // Don't set error for auth check - user might just not be logged in
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    checkSession();
  }, [checkSession]);

  const signup = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.signup({ email, password });
      setUser(response.user);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
        if (err.details && err.details.length > 0) {
          setError(err.details.map((d) => d.message).join(", "));
        }
      } else {
        setError("An unexpected error occurred");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.signin({ email, password });
      setUser(response.user);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = async () => {
    try {
      setIsLoading(true);
      await authApi.signout();
      setUser(null);
      setError(null);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isMounted,
    error,
    signup,
    signin,
    signout,
    checkSession,
  };
}
