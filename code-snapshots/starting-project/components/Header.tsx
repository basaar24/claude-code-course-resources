import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/dashboard"
          className="text-xl font-bold tracking-tight text-white hover:text-gray-300 transition-colors"
        >
          NextNotes
        </Link>
        {session && <LogoutButton />}
      </div>
    </header>
  );
}
