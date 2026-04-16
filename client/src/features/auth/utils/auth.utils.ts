export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  return error instanceof Error ? error.message : fallback;
}