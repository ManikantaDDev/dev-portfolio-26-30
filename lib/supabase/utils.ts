import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to merge Tailwind CSS classes.
 * It ensures that conflicting classes are resolved correctly,
 * allowing later classes to override earlier ones safely.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}