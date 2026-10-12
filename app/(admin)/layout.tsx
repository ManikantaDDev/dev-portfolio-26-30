import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { claimPortfolio, getCurrentUser, getOwnerId, getProfileById } from "@/lib/portfolio/queries";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Idempotent: the first signed-in account becomes the published owner and
  // gets the default sections. Doing it here means landing on any admin page
  // is enough, rather than only /dashboard.
  //
  // A failure here is recoverable (it needs one migration), so it degrades to
  // a banner instead of taking the whole panel down.
  let setupError: string | null = null;

  try {
    await claimPortfolio(user.id, user.email ?? "");
  } catch (error) {
    setupError = error instanceof Error ? error.message : "Could not prepare your portfolio.";
  }

  const [profile, ownerId] = await Promise.all([getProfileById(user.id), getOwnerId()]);

  return (
    <div className="min-h-screen bg-background lg:pl-64">
      <AdminSidebar
        email={user.email ?? ""}
        role={profile?.role ?? null}
        isOwner={ownerId === user.id}
      />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {setupError ? (
          <div
            role="alert"
            className="mb-8 flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="space-y-2">
              <p className="font-medium">Your portfolio is not set up yet.</p>
              <p className="leading-snug text-muted-foreground">{setupError}</p>
              <p className="leading-snug text-muted-foreground">
                Run <code className="rounded bg-muted px-1 py-0.5">20260202000000_claim_policy.sql</code>{" "}
                in the Supabase SQL Editor, then reload this page.
              </p>
            </div>
          </div>
        ) : null}

        {children}
      </main>
    </div>
  );
}
