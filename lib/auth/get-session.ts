import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type Session = {
  user: User;
  email: string;
  isAdmin: boolean;
};

export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    email: user.email ?? "",
    isAdmin: profile?.role === "admin",
  };
}

export async function requireUser(returnTo?: string): Promise<Session> {
  const session = await getSession();

  if (!session) {
    const target = returnTo ? `/login?next=${encodeURIComponent(returnTo)}` : "/login";

    redirect(target);
  }

  return session;
}
