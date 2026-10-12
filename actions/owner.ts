"use server";

import { revalidatePath } from "next/cache";
import { claimPortfolio } from "@/lib/portfolio/queries";
import { PORTFOLIO_PATHS, getActionUser } from "@/actions/_shared";

/**
 * Points the published portfolio at the signed-in account and seeds the
 * sections it starts with. Called when the dashboard is first opened.
 */
export async function claimPortfolioAction() {
  const auth = await getActionUser();

  if (!auth.ok) return auth;

  try {
    await claimPortfolio(auth.userId, auth.email);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to prepare your portfolio.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/sections");
  for (const path of PORTFOLIO_PATHS) revalidatePath(path);

  return { message: "Portfolio ready." };
}
