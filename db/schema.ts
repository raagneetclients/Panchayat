import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const bidStatuses = ['pending', 'approved', 'rejected'] as const;

export type BidStatus = (typeof bidStatuses)[number];

export const advertisingBids = pgTable(
  'advertising_bids',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    business: text('business').notNull(),
    amountPaise: integer('amount_paise').notNull(),
    reason: text('reason').notNull(),
    status: text('status').$type<BidStatus>().notNull().default('pending'),
    consentAt: timestamp('consent_at', { withTimezone: true, mode: 'string' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
    submitterHash: text('submitter_hash').notNull(),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true, mode: 'string' }),
    reviewedBy: text('reviewed_by'),
    reviewReason: text('review_reason'),
  },
  (table) => [
    index('bid_status_idx').on(table.status),
    index('bid_submitter_idx').on(table.submitterHash),
  ],
);

export const bidRevisions = pgTable(
  'bid_revisions',
  {
    id: text('id').primaryKey(),
    bidId: text('bid_id')
      .notNull()
      .references(() => advertisingBids.id, { onDelete: 'cascade' }),
    actor: text('actor').notNull(),
    previousStatus: text('previous_status').$type<BidStatus>().notNull(),
    status: text('status').$type<BidStatus>().notNull(),
    reason: text('reason').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
  },
  (table) => [index('bid_revision_bid_idx').on(table.bidId)],
);

export type AdvertisingBid = typeof advertisingBids.$inferSelect;
export type BidRevision = typeof bidRevisions.$inferSelect;
