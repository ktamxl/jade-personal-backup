/**
 * Returns only the first name from a full name string for privacy.
 * Falls back to the email username (before @) if no name is provided,
 * or to the fallback string if neither is available.
 */
export function getFirstName(
  name: string | null | undefined,
  email?: string | null,
  fallback?: string
): string {
  if (name && name.trim()) {
    return name.trim().split(/\s+/)[0];
  }
  if (email && email.includes("@")) {
    return email.split("@")[0];
  }
  return fallback ?? "User";
}
