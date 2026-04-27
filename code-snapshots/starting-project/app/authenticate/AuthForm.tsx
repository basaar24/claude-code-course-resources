"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = isRegister
      ? await authClient.signUp.email({ email, password, name: email, callbackURL: "/dashboard" })
      : await authClient.signIn.email({ email, password, callbackURL: "/dashboard" });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Something went wrong.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
          {isRegister ? "Create an account" : "Welcome back"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            {loading ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link href="/authenticate?mode=login" className="font-medium text-gray-700 hover:underline dark:text-gray-300">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/authenticate?mode=register" className="font-medium text-gray-700 hover:underline dark:text-gray-300">
                Create one
              </Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
