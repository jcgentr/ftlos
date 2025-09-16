import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO date string to a localized date format
 * Handles timezone issues by parsing the date components directly
 */
export function formatDate(dateString: string | null | undefined, locale = "en-US"): string {
  if (!dateString) return "Not set";

  try {
    // Get just the date part (before the T in ISO format)
    const datePart = dateString.split("T")[0];
    if (!datePart) return "Not set";

    // Parse the date manually
    const [year, month, day] = datePart.split("-");
    if (!year || !month || !day) return "Not set";

    // Create a date directly with year/month/day in local time
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // JS months are 0-indexed
      parseInt(day)
    );

    if (isNaN(date.getTime())) return "Not set";

    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Not set";
  }
}

/**
 * Creates a Google search link for a given name
 */
export function createGoogleSearchLink(name: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(name)}`;
}
