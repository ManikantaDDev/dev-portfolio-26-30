import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Briefcase,
  Building,
  Code,
  Globe,
  MapPin,
  Shield,
  Star,
} from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const linkFields = [
  { key: "github_url", label: "GitHub", icon: Code },
  { key: "linkedin_url", label: "LinkedIn", icon: Building },
  { key: "website_url", label: "Website", icon: Globe },
] as const;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ProfilePage() {
  const current = await getCurrentProfile();

  if (!current) {
    redirect("/login");
  }

  const { user, profile, role, skills } = current;
  const displayName = profile?.display_name || user.email || "Profile";
  const initial = displayName.charAt(0).toUpperCase();
  const links = linkFields.filter((field) => profile?.[field.key]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="size-20 shrink-0 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                {initial}
              </div>
            )}

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold">{displayName}</h2>
              {profile?.headline ? (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Briefcase className="size-3.5" />
                  {profile.headline}
                </p>
              ) : null}
              {profile?.location ? (
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {profile.location}
                </p>
              ) : null}
            </div>
          </div>

          {profile?.bio ? (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
          ) : (
            <p className="mt-4 text-sm italic text-muted-foreground">
              You haven&apos;t added a bio yet.
            </p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <h3 className="text-base font-semibold">Account</h3>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="space-y-0.5">
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="truncate font-medium">{user.email}</dd>
            </div>
            {role ? (
              <div className="space-y-0.5">
                <dt className="text-xs text-muted-foreground">Role</dt>
                <dd className="flex items-center gap-1.5 font-medium capitalize">
                  <Shield className="size-3.5 text-muted-foreground" />
                  {role}
                </dd>
              </div>
            ) : null}
            <div className="space-y-0.5">
              <dt className="text-xs text-muted-foreground">Member since</dt>
              <dd className="font-medium">{formatDate(user.created_at)}</dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-xs text-muted-foreground">Email confirmed</dt>
              <dd className="font-medium">
                {user.email_confirmed_at ? formatDate(user.email_confirmed_at) : "—"}
              </dd>
            </div>
          </dl>
        </section>

        {links.length > 0 ? (
          <section className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <h3 className="text-base font-semibold">Links</h3>
            <ul className="mt-4 flex flex-wrap gap-3">
              {links.map((field) => (
                <li key={field.key}>
                  <Link
                    href={profile![field.key] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    <field.icon />
                    {field.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {skills.length > 0 ? (
          <section className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <h3 className="text-base font-semibold">Skills</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-sm"
                >
                  {skill.is_featured ? (
                    <Star className="size-3.5 fill-current text-primary" aria-label="Featured" />
                  ) : null}
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">{skill.level}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
  );
}
