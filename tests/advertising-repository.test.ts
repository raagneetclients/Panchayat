import assert from 'node:assert/strict';
import test from 'node:test';
import { getTableColumns } from 'drizzle-orm';
import type { Database } from '../db';
import {
  createBid,
  listApprovedAds,
  listBids,
  reviewBid,
} from '../db/advertising';
import { advertisingBids, bidRevisions } from '../db/schema';

type CapturedQuery = { usedTables: Array<{ [key: string]: unknown }> };

function fakeExecutor(rows: unknown[]) {
  const calls: CapturedQuery[] = [];
  const db = {
    execute: async (query: CapturedQuery) => {
      calls.push(query);
      return { rows };
    },
  } as unknown as Database;

  return { db, calls };
}

test('Postgres schema retains bid status, privacy and audit fields', () => {
  const bidColumns = getTableColumns(advertisingBids);
  const revisionColumns = getTableColumns(bidRevisions);

  for (const field of [
    'id',
    'name',
    'phone',
    'business',
    'amountPaise',
    'reason',
    'status',
    'consentAt',
    'createdAt',
    'submitterHash',
    'reviewedAt',
    'reviewedBy',
    'reviewReason',
  ]) {
    assert(field in bidColumns, field);
  }

  for (const field of [
    'id',
    'bidId',
    'actor',
    'previousStatus',
    'status',
    'reason',
    'createdAt',
  ]) {
    assert(field in revisionColumns, field);
  }
});

test('createBid persists through the database and returns the pending reference', async () => {
  const { db, calls } = fakeExecutor([
    { id: 'BID-AB12CD34', status: 'pending' },
  ]);

  const created = await createBid(
    {
      name: 'Test Bidder',
      phone: '9876543210',
      business: 'Test Business',
      amountPaise: 10000,
      reason: 'A valid test advertising message for repository verification.',
      now: '2026-11-13T10:00:00.000Z',
    },
    'fingerprint-hash',
    db,
  );

  assert.deepEqual(created, { id: 'BID-AB12CD34', status: 'pending' });
  assert.equal(calls.length, 1);
  assert(calls[0].usedTables.length > 0);
});

test('createBid returns null when the daily submitter limit is reached', async () => {
  const { db } = fakeExecutor([]);
  const created = await createBid(
    {
      name: 'Test Bidder',
      phone: '9876543210',
      business: 'Test Business',
      amountPaise: 10000,
      reason: 'A valid test advertising message for repository verification.',
      now: '2026-11-13T10:00:00.000Z',
    },
    'fingerprint-hash',
    db,
  );

  assert.equal(created, null);
});

test('reviewBid records the previous and new status for the audit trail', async () => {
  const { db, calls } = fakeExecutor([
    { previous_status: 'pending', status: 'approved' },
  ]);

  const decision = await reviewBid(
    {
      id: 'BID-AB12CD34',
      status: 'approved',
      reason: 'Business and message verified.',
      actor: 'reviewer-user-id',
      now: '2026-11-13T11:00:00.000Z',
    },
    db,
  );

  assert.deepEqual(decision, { previousStatus: 'pending', status: 'approved' });
  assert.equal(calls.length, 1);
  assert(calls[0].usedTables.length > 0);
});

test('reviewBid returns null for a missing bid', async () => {
  const { db } = fakeExecutor([]);
  const decision = await reviewBid(
    {
      id: 'BID-FFFFFFFF',
      status: 'rejected',
      reason: 'Missing record.',
      actor: 'reviewer-user-id',
      now: '2026-11-13T11:00:00.000Z',
    },
    db,
  );

  assert.equal(decision, null);
});

function fakeSelector(rows: unknown[]) {
  let selected: Record<string, unknown> = {};
  const chain = {
    from() {
      return chain;
    },
    where() {
      return chain;
    },
    orderBy() {
      return chain;
    },
    limit() {
      return Promise.resolve(rows);
    },
  };

  return {
    db: {
      select(fields: Record<string, unknown>) {
        selected = fields;
        return chain;
      },
    } as unknown as Database,
    selectedFields: () => selected,
  };
}

test('public approved-ad query selects only non-personal fields', async () => {
  const fake = fakeSelector([
    { id: 'BID-AB12CD34', business: 'Test Business', reason: 'Approved message' },
  ]);

  const ads = await listApprovedAds(6, fake.db);
  assert.deepEqual(Object.keys(fake.selectedFields()).sort(), [
    'business',
    'id',
    'reason',
  ]);
  assert.deepEqual(ads, [
    { id: 'BID-AB12CD34', business: 'Test Business', reason: 'Approved message' },
  ]);
});

test('private review queue query includes personal contact fields', async () => {
  const fake = fakeSelector([]);
  await listBids(200, fake.db);
  const fields = Object.keys(fake.selectedFields());
  assert(fields.includes('name'));
  assert(fields.includes('phone'));
});
