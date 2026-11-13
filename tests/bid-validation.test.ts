import assert from 'node:assert/strict';
import test from 'node:test';
import {
  clean,
  submissionHash,
  validateBidSubmission,
  validateReviewDecision,
} from '../lib/bid-validation';

const validBid = {
  name: 'Aarti Verma',
  phone: '9876543210',
  business: 'Dhar Agro Supplies',
  amount: '2500.50',
  reason: 'We want to promote a local soil-testing service for farmers in Dhar district.',
  consent: 'yes',
};

test('accepts a valid advertising bid and converts rupees to paise', () => {
  const result = validateBidSubmission(validBid);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.value, {
    name: 'Aarti Verma',
    phone: '9876543210',
    business: 'Dhar Agro Supplies',
    amountPaise: 250050,
    reason: validBid.reason,
  });
});

test('normalizes Unicode and strips control characters', () => {
  const result = validateBidSubmission({
    ...validBid,
    name: '  आरती\u0000 वर्मा  ',
    business: 'धार कृषि सेवा',
    reason: 'स्थानीय किसानों के लिए मिट्टी परीक्षण सेवा का प्रचार करना है।',
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.name, 'आरती  वर्मा');
  assert.equal(result.value.business, 'धार कृषि सेवा');
});

test('rejects malformed or unsafe submissions', () => {
  const cases: Array<[unknown, string]> = [
    [null, 'Invalid JSON.'],
    [{ ...validBid, website: 'spam.example' }, 'Unable to accept this submission.'],
    [{ ...validBid, name: 'A' }, 'Check name'],
    [{ ...validBid, phone: '1234567890' }, 'Check name'],
    [{ ...validBid, business: '' }, 'Check name'],
    [{ ...validBid, reason: 'too short' }, 'Check name'],
    [{ ...validBid, amount: '0' }, 'Check name'],
    [{ ...validBid, amount: '10000001' }, 'Check name'],
    [{ ...validBid, amount: '10.001' }, 'Check name'],
    [{ ...validBid, consent: 'no' }, 'Check name'],
  ];

  for (const [input, message] of cases) {
    const result = validateBidSubmission(input);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.match(result.error, new RegExp(message));
      assert.equal(result.status, 400);
    }
  }
});

test('accepts only approved or rejected review decisions with a reason', () => {
  assert.deepEqual(validateReviewDecision({ status: 'approved', reason: 'Verified' }), {
    ok: true,
    value: { status: 'approved', reason: 'Verified' },
  });
  assert.deepEqual(validateReviewDecision({ status: 'rejected', reason: 'Policy' }), {
    ok: true,
    value: { status: 'rejected', reason: 'Policy' },
  });

  for (const input of [
    null,
    { status: 'pending', reason: 'Not a final state' },
    { status: 'approved', reason: '   ' },
    { status: 'approved', reason: 'x'.repeat(1001) },
  ]) {
    const result = validateReviewDecision(input);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.status, 400);
  }
});

test('clean enforces the documented maximum and never returns non-strings', () => {
  assert.equal(clean('  hello  ', 10), 'hello');
  assert.equal(clean('abcdef', 3), 'abcd');
  assert.equal(clean(42, 10), '');
});

test('submission hashes are deterministic per day and separate across days', async () => {
  const first = await submissionHash('203.0.113.10', '2026-11-13');
  const second = await submissionHash('203.0.113.10', '2026-11-13');
  const nextDay = await submissionHash('203.0.113.10', '2026-11-14');
  assert.equal(first, second);
  assert.notEqual(first, nextDay);
  assert.match(first, /^[a-f0-9]{64}$/);
});
