import Link from "next/link";
import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  await requireAuth();
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Notes</h1>
        <Link
          href="/notes/new"
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-200 transition-colors"
        >
          New note
        </Link>
      </div>
    </main>
  );
}
