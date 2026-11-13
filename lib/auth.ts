import { getUser } from '@netlify/identity';

export const DEFAULT_REVIEWER_PATH = '/admin/advertising/';

export type ReviewerIdentity = {
  id: string;
  email?: string;
};

type ReviewerEnvironment = {
  ADMIN_REVIEWER_EMAILS?: string;
  ADMIN_USER_IDS?: string;
};

export function parseAllowlist(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * Reviewer access is decided on the server from the verified Netlify Identity
 * session. There is deliberately no local/mock bypass.
 */
export function isReviewer(
  user: ReviewerIdentity | null | undefined,
  env: ReviewerEnvironment = process.env as ReviewerEnvironment,
): boolean {
  if (!user) return false;

  const ids = parseAllowlist(env.ADMIN_USER_IDS);
  const emails = parseAllowlist(env.ADMIN_REVIEWER_EMAILS).map((email) =>
    email.toLowerCase(),
  );

  if (ids.includes(user.id)) return true;

  return Boolean(user.email && emails.includes(user.email.toLowerCase()));
}

export async function getReviewer() {
  const user = await getUser();
  return user && isReviewer(user) ? user : null;
}

export function safeReturnPath(value: string): string {
  if (!value.startsWith('/') || value.startsWith('//')) {
    return DEFAULT_REVIEWER_PATH;
  }

  let url: URL;
  try {
    url = new URL(value, 'https://app.local');
  } catch {
    return DEFAULT_REVIEWER_PATH;
  }

  if (url.origin !== 'https://app.local') return DEFAULT_REVIEWER_PATH;

  if (isReservedAuthPath(url.pathname)) return DEFAULT_REVIEWER_PATH;

  return `${url.pathname}${url.search}${url.hash}`;
}

export function loginPath(returnTo = DEFAULT_REVIEWER_PATH): string {
  return `/login/?return_to=${encodeURIComponent(safeReturnPath(returnTo))}`;
}

function isReservedAuthPath(pathname: string): boolean {
  return (
    pathname === '/login' ||
    pathname.startsWith('/login/') ||
    pathname === '/api/auth' ||
    pathname.startsWith('/api/auth/')
  );
}
