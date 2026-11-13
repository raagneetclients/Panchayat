import fs from 'node:fs';
import assert from 'node:assert/strict';
const register=JSON.parse(fs.readFileSync('public/evidence-register.json','utf8'));
for(const r of register.records){assert(r.field&&r.sourceUrl&&r.lastVerified&&r.administrativeScope);assert(/^https:\/\//.test(r.sourceUrl))}
assert(register.records.find(r=>r.field==='gramPanchayats').conflictingSources.length>0);
const media=JSON.parse(fs.readFileSync('media-manifest.json','utf8'));
for(const m of media){assert(m.licensingStatus&&m.creditLine);for(const f of m.localFiles)assert(fs.existsSync(f),f)}
const geo=JSON.parse(fs.readFileSync('public/dhar-boundary.geojson','utf8'));
assert.equal(geo.properties.district,'Dhar');assert.equal(geo.geometry.type,'Polygon');assert(geo.geometry.coordinates[0].length>100);
const manifest=JSON.parse(fs.readFileSync('.openai/hosting.json','utf8'));assert.equal(manifest.d1,'DB');
console.log(`Content checks passed: ${register.records.length} evidence records, ${media.length} licensed assets and real Dhar polygon.`);
