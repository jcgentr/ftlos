import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SentimentType, TaglineSentiment } from "./types";

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

export const TAGLINE_SENTIMENTS = {
  // Positive sentiments
  LOVES: { display: "Loves", type: "positive" },
  LOOKS_LIKE: { display: "Looks Like", type: "positive" },
  WATCHES: { display: "Watches", type: "positive" },
  IDOLIZES: { display: "Idolizes", type: "positive" },
  ADORES: { display: "Adores", type: "positive" },
  SUPPORTS: { display: "Supports", type: "positive" },
  // Negative sentiments
  DETESTS: { display: "Detests", type: "negative" },
  LOATHES: { display: "Loathes", type: "negative" },
  ROOTS_AGAINST: { display: "Roots Against", type: "negative" },
  LAUGHS_AT: { display: "Laughs At", type: "negative" },
  PITIES: { display: "Pities", type: "negative" },
  IS_SCARED_OF: { display: "Is Scared Of", type: "negative" },
};

export const getSentimentDisplay = (sentiment: TaglineSentiment): string => {
  return TAGLINE_SENTIMENTS[sentiment]?.display || "Unknown";
};

export const getSentimentType = (sentiment: TaglineSentiment): SentimentType => {
  return (TAGLINE_SENTIMENTS[sentiment]?.type as SentimentType) || "positive";
};

export const getSentimentsByType = (type: SentimentType): TaglineSentiment[] => {
  return Object.entries(TAGLINE_SENTIMENTS)
    .filter(([, config]) => config.type === type)
    .map(([key]) => key as TaglineSentiment);
};
