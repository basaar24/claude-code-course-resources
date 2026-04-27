import Link from "next/link";
import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  await requireAuth();
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Notes</h1>
        <Link
          href="/notes/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition-colors dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
        >
          New note
        </Link>
      </div>
    </main>
  );
}
