import { redirect } from 'next/navigation';
import { getUser } from '@netlify/identity';
import { LoginForm } from '@/components/auth';
import { safeReturnPath } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Props = {
  searchParams: Promise<{ return_to?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const query = await searchParams;
  const requested = typeof query.return_to === 'string' ? query.return_to : undefined;
  const returnTo = safeReturnPath(requested ?? '/admin/advertising/');
  const user = await getUser();

  if (user) redirect(returnTo);

  return (
    <main className="container section">
      <span className="eyebrow">PRIVATE REVIEW • PROTOTYPE</span>
      <h1>Reviewer sign in / समीक्षक साइन इन</h1>
      <p>
        Use the Netlify Identity account that has been invited by the site owner.
        Public visitors do not need an account.
      </p>
      <LoginForm returnTo={returnTo} />
      <p>
        <a href="/hi/">← वेबसाइट / Website</a>
      </p>
    </main>
  );
}
