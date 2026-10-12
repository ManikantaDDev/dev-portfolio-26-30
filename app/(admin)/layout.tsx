import { redirect } from "next/navigation";
import { getCurrentUser, getOwnerId, getProfileById } from "@/lib/portfolio/queries";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [profile, ownerId] = await Promise.all([getProfileById(user.id), getOwnerId()]);

  return (
    <div className="min-h-screen bg-background lg:pl-64">
      <AdminSidebar
        email={user.email ?? ""}
        role={profile?.role ?? null}
        isOwner={ownerId === user.id}
      />

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
