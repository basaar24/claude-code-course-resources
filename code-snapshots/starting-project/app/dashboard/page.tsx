import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  await requireAuth();
  return <main>Dashboard</main>;
}
