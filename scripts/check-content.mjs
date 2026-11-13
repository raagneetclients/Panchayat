import fs from 'node:fs';
import assert from 'node:assert/strict';

const register = JSON.parse(fs.readFileSync('public/evidence-register.json', 'utf8'));
for (const record of register.records) {
  assert(record.field && record.sourceUrl && record.lastVerified && record.administrativeScope);
  assert(/^https:\/\//.test(record.sourceUrl));
}
assert(register.records.find((record) => record.field === 'gramPanchayats').conflictingSources.length > 0);

const media = JSON.parse(fs.readFileSync('media-manifest.json', 'utf8'));
for (const asset of media) {
  assert(asset.licensingStatus && asset.creditLine);
  for (const file of asset.localFiles) assert(fs.existsSync(file), file);
}

const geo = JSON.parse(fs.readFileSync('public/dhar-boundary.geojson', 'utf8'));
assert.equal(geo.properties.district, 'Dhar');
assert.equal(geo.geometry.type, 'Polygon');
assert(geo.geometry.coordinates[0].length > 100);

const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
assert.match(netlifyConfig, /command\s*=\s*"npm run build"/);
assert.match(netlifyConfig, /publish\s*=\s*"\.next"/);
assert(fs.existsSync('netlify/database/migrations'), 'Netlify database migrations are missing');
assert(fs.existsSync('db/schema.ts'), 'Drizzle schema is missing');

console.log(
  `Content checks passed: ${register.records.length} evidence records, ${media.length} licensed assets, real Dhar polygon and Netlify deployment config.`,
);
