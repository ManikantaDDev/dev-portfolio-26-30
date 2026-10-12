import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { TopBar } from "@/components/admin/top-bar";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const current = await getCurrentProfile();

  if (!current) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar email={current.user.email ?? ""} role={current.role} />

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}