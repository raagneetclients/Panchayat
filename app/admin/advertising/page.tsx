import { getUser } from '@netlify/identity';
import { isReviewer, loginPath } from '@/lib/auth';
import { listBids } from '@/lib/advertising';
import { ReviewButtons } from '@/components/advertising';
import { LogoutButton } from '@/components/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function Admin() {
  const user = await getUser();
  const admin = user && isReviewer(user) ? user : null;

  if (!admin) {
    return (
      <main className="container section">
        <h1>Advertising review / विज्ञापन समीक्षा</h1>
        {user ? (
          <>
            <p>
              This account is not an authorized reviewer. Ask the site owner to add
              your email to <code>ADMIN_REVIEWER_EMAILS</code> or your Netlify
              Identity user ID to <code>ADMIN_USER_IDS</code>.
            </p>
            <p>
              Identity user ID: <code>{user.id}</code>
            </p>
            <LogoutButton />
          </>
        ) : (
          <>
            <p>Only authorized reviewers may view personal bid records.</p>
            <a className="button" href={loginPath('/admin/advertising/')}>
              Sign in
            </a>
          </>
        )}
        <p>
          <a href="/hi/">← वेबसाइट / Website</a>
        </p>
      </main>
    );
  }

  const bids = await listBids();

  return (
    <main className="container section">
      <span className="eyebrow">PRIVATE REVIEW • PROTOTYPE</span>
      <h1>Advertising bids / विज्ञापन बोलियाँ</h1>
      <p>
        Review identity, business suitability, proposed message, placement and
        policy approval before qualifying a bid. The highest amount does not
        qualify automatically. Approval displays the business name and proposed
        message on the homepage.
      </p>
      <p>
        Production advertising policy and institutional authorization remain
        pending. Use test data during prototype review.
      </p>
      <p>
        Signed in as <strong>{admin.email ?? admin.id}</strong>. <LogoutButton />
      </p>
      {bids.length === 0 && <p>No bids submitted yet.</p>}
      {bids.map((bid) => (
        <article key={bid.id} className="admin-bid">
          <span className="tag">{bid.status}</span>
          <h2>
            {bid.business} — ₹
            {(bid.amountPaise / 100).toLocaleString('en-IN')}
          </h2>
          <p>
            {bid.name} • {bid.phone} • {bid.createdAt}
          </p>
          <p>{bid.reason}</p>
          <p>
            <code>{bid.id}</code> {bid.reviewReason}
          </p>
          <ReviewButtons id={bid.id} />
        </article>
      ))}
      <a href="/hi/">← Website</a>
    </main>
  );
}
