import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const navItems = [
  { href: "/admin", label: "Profile Settings" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "My Profile" },
];

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const current = await getCurrentProfile();

  if (!current) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-8 py-4">
          <div>
            <h1 className="text-lg font-bold">Admin</h1>
            <p className="text-xs text-muted-foreground">
              {current.user.email}
              {current.role ? ` \u00b7 ${current.role}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <form action={signOutAction}>
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-8 py-8">{children}</main>
    </div>
  );
}