import { getCurrentUser } from "@/lib/portfolio/queries";

/** Pages that render database-backed portfolio content. */
export const PORTFOLIO_PATHS = ["/"];

/** The shape every server action resolves to, consumed by the forms. */
export type ActionResult = { error?: string; message?: string };

export type ActionUser =
  | ({ ok: true; userId: string; email: string } & ActionResult)
  | ({ ok: false } & ActionResult);

/**
 * Resolves the signed-in user for an action. Actions return an error rather
 * than redirecting, so the calling form can surface it.
 */
export async function getActionUser(): Promise<ActionUser> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, error: "You must be signed in to make this change." };
  }

  return { ok: true, userId: user.id, email: user.email ?? "" };
}

/** Empty strings are stored as NULL so "no value" stays distinguishable. */
export function blankToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
