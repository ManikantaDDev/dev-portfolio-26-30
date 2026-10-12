import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function handleSignOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <>
      <main className="max-w-5xl mx-auto py-8">
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <h2 className="text-lg font-semibold mb-2">
            Welcome to your Portfolio Admin
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            You have successfully authenticated into the admin portal.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin">
              <Button size="sm">Edit Profile</Button>
            </Link>
            <Link href="/profile">
              <Button variant="secondary" size="sm">
                View My Profile
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                View Live Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
