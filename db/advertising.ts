import { asc, desc, eq, sql } from 'drizzle-orm';
import { getDb, type Database } from './index';
import { advertisingBids, bidRevisions, type BidStatus } from './schema';

export type NewBid = {
  name: string;
  phone: string;
  business: string;
  amountPaise: number;
  reason: string;
  now: string;
};

export type ReviewInput = {
  id: string;
  status: Exclude<BidStatus, 'pending'>;
  reason: string;
  actor: string;
  now: string;
};

export type BidSummary = {
  id: string;
  name: string;
  phone: string;
  business: string;
  amountPaise: number;
  reason: string;
  status: BidStatus;
  createdAt: string;
  reviewReason: string | null;
};

export type PublicAd = {
  id: string;
  business: string;
  reason: string;
};

export async function createBid(
  input: NewBid,
  submitterHash: string,
  db: Database = getDb(),
): Promise<{ id: string; status: BidStatus } | null> {
  const id = `BID-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  // A single conditional INSERT keeps the five-per-day submitter limit atomic.
  // Column names in an INSERT target cannot be table-qualified in PostgreSQL.
  const result = await db.execute<{ id: string; status: BidStatus }>(sql`
    INSERT INTO ${advertisingBids}
      (${sql.identifier('id')}, ${sql.identifier('name')}, ${sql.identifier('phone')},
       ${sql.identifier('business')}, ${sql.identifier('amount_paise')},
       ${sql.identifier('reason')}, ${sql.identifier('status')},
       ${sql.identifier('consent_at')}, ${sql.identifier('created_at')},
       ${sql.identifier('submitter_hash')})
    SELECT ${id}, ${input.name}, ${input.phone}, ${input.business},
           ${input.amountPaise}, ${input.reason}, ${'pending'},
           ${input.now}, ${input.now}, ${submitterHash}
    WHERE (
      SELECT COUNT(*) FROM ${advertisingBids}
      WHERE ${advertisingBids.submitterHash} = ${submitterHash}
    ) < 5
    RETURNING ${sql.identifier('id')}, ${sql.identifier('status')}
  `);

  const row = result.rows[0];
  return row ? { id: row.id, status: row.status } : null;
}

export async function listApprovedAds(
  limit = 6,
  db: Database = getDb(),
): Promise<PublicAd[]> {
  return db
    .select({
      id: advertisingBids.id,
      business: advertisingBids.business,
      reason: advertisingBids.reason,
    })
    .from(advertisingBids)
    .where(eq(advertisingBids.status, 'approved'))
    .orderBy(desc(advertisingBids.amountPaise), asc(advertisingBids.createdAt))
    .limit(limit);
}

export async function listBids(limit = 200, db: Database = getDb()): Promise<BidSummary[]> {
  return db
    .select({
      id: advertisingBids.id,
      name: advertisingBids.name,
      phone: advertisingBids.phone,
      business: advertisingBids.business,
      amountPaise: advertisingBids.amountPaise,
      reason: advertisingBids.reason,
      status: advertisingBids.status,
      createdAt: advertisingBids.createdAt,
      reviewReason: advertisingBids.reviewReason,
    })
    .from(advertisingBids)
    .orderBy(desc(advertisingBids.createdAt))
    .limit(limit);
}

/**
 * Record a decision and its immutable audit revision in one Postgres statement.
 * The previous row is locked so concurrent reviewers cannot silently overwrite
 * each other's decision.
 */
export async function reviewBid(
  input: ReviewInput,
  db: Database = getDb(),
): Promise<{ previousStatus: BidStatus; status: BidStatus } | null> {
  const revisionId = crypto.randomUUID();

  // SET and INSERT target columns cannot be table-qualified in PostgreSQL.
  const result = await db.execute<{ previous_status: BidStatus; status: BidStatus }>(sql`
    WITH previous AS (
      SELECT ${sql.identifier('status')}
      FROM ${advertisingBids}
      WHERE ${advertisingBids.id} = ${input.id}
      FOR UPDATE
    ), updated AS (
      UPDATE ${advertisingBids}
      SET ${sql.identifier('status')} = ${input.status},
          ${sql.identifier('reviewed_at')} = ${input.now},
          ${sql.identifier('reviewed_by')} = ${input.actor},
          ${sql.identifier('review_reason')} = ${input.reason}
      WHERE ${advertisingBids.id} = ${input.id}
      RETURNING ${sql.identifier('status')}
    ), revision AS (
      INSERT INTO ${bidRevisions}
        (${sql.identifier('id')}, ${sql.identifier('bid_id')}, ${sql.identifier('actor')},
         ${sql.identifier('previous_status')}, ${sql.identifier('status')},
         ${sql.identifier('reason')}, ${sql.identifier('created_at')})
      SELECT ${revisionId}, ${input.id}, ${input.actor}, previous.status,
             updated.status, ${input.reason}, ${input.now}
      FROM previous CROSS JOIN updated
      RETURNING ${sql.identifier('id')}
    )
    SELECT previous.status AS previous_status, updated.status AS status
    FROM previous CROSS JOIN updated
  `);

  const row = result.rows[0];
  return row ? { previousStatus: row.previous_status, status: row.status } : null;
}
