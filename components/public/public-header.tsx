import Link from "next/link";
import { cn } from "@/lib/utils";

export type PublicHeaderProps = {
  links?: { href: string; label: string }[];
  action?: { href: string; label: string };
  className?: string;
};

const defaultLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function PublicHeader({
  links = defaultLinks,
  action = { href: "/dashboard", label: "Admin" },
  className,
}: PublicHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Portfolio
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href={action.href}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          {action.label}
        </Link>
      </div>
    </header>
  );
}
