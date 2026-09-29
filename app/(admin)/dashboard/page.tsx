import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/actions/auth";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Signed in as {user.email}.
          </p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 text-white"
          >
            Logout
          </button>
        </form>
      </div>
    </main>
  );
}
