import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isReviewer,
  loginPath,
  parseAllowlist,
  safeReturnPath,
} from '../lib/auth';

const env = {
  ADMIN_REVIEWER_EMAILS: ' Reviewers@Example.org, second@example.org ',
  ADMIN_USER_IDS: 'user-1,user-2',
};

test('parses comma-separated allowlists and ignores blanks', () => {
  assert.deepEqual(parseAllowlist(' a, ,b , c '), ['a', 'b', 'c']);
  assert.deepEqual(parseAllowlist(undefined), []);
});

test('authorizes allowlisted Netlify Identity users by email or ID', () => {
  assert.equal(isReviewer({ id: 'user-2' }, env), true);
  assert.equal(isReviewer({ id: 'other', email: 'REVIEWERS@example.org' }, env), true);
  assert.equal(isReviewer({ id: 'other', email: 'second@example.org' }, env), true);
});

test('rejects anonymous, unlisted and mock identities', () => {
  assert.equal(isReviewer(null, env), false);
  assert.equal(isReviewer({ id: 'other', email: 'nobody@example.org' }, env), false);
  assert.equal(
    isReviewer(
      { id: 'local_seedy', email: 'local@example.org' },
      { ADMIN_REVIEWER_EMAILS: '', ADMIN_USER_IDS: '' },
    ),
    false,
  );
});

test('safe return paths stay local and avoid auth routes', () => {
  assert.equal(safeReturnPath('/admin/advertising/'), '/admin/advertising/');
  assert.equal(safeReturnPath('/hi/?x=1#top'), '/hi/?x=1#top');
  assert.equal(safeReturnPath('https://evil.example/'), '/admin/advertising/');
  assert.equal(safeReturnPath('//evil.example/'), '/admin/advertising/');
  assert.equal(safeReturnPath('/login/?return_to=/admin/'), '/admin/advertising/');
  assert.equal(safeReturnPath('/api/auth/logout'), '/admin/advertising/');
});

test('login links preserve a safe reviewer destination', () => {
  assert.equal(
    loginPath('/admin/advertising/'),
    '/login/?return_to=%2Fadmin%2Fadvertising%2F',
  );
  assert.equal(
    loginPath('https://evil.example/'),
    '/login/?return_to=%2Fadmin%2Fadvertising%2F',
  );
});
