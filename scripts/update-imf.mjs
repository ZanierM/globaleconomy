// Downloads the IMF World Economic Outlook figures used by the World Economy Globe
// and saves a compact copy to data/imf.json.
// Run with:  node scripts/update-imf.mjs
// The IMF updates these twice a year (April and October), with smaller updates in between.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'data', 'imf.json');
const API = 'https://www.imf.org/external/datamapper/api/v1';
const INDICATORS = ['NGDP_RPCH', 'PCPIPCH', 'LUR', 'GGXWDG_NGDP', 'NGDPDPC', 'BCA_NGDPD', 'GGXCNL_NGDP', 'LP', 'NGDPD', 'PPPPC', 'PPPSH'];
const FIRST_YEAR = 2000;
const LAST_YEAR = new Date().getFullYear() + 5;
const GROUPS = { WEOWORLD: 'World', ADVEC: 'Advanced economies', OEMDC: 'Emerging and developing economies', EURO: 'Euro area', EU: 'European Union' };

async function get(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'EconomyLive/1.0 (school project)', accept: 'application/json' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise((res) => setTimeout(res, 3000 * attempt));
    }
  }
}

try {
  const meta = (await get(`${API}/indicators`)).indicators;
  const countries = Object.fromEntries(Object.entries((await get(`${API}/countries`)).countries).map(([k, v]) => [k, v.label]));
  const values = {};
  for (const k of INDICATORS) {
    const raw = (await get(`${API}/${k}`)).values[k];
    values[k] = {};
    for (const [code, years] of Object.entries(raw)) {
      if (!countries[code] && !GROUPS[code]) continue;
      const arr = [];
      for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) arr.push(years[y] ?? null);
      while (arr.length && arr[arr.length - 1] === null) arr.pop();
      if (arr.some((v) => v !== null)) values[k][code] = arr.map((v) => (v === null ? null : Math.round(v * 100) / 100));
    }
    console.log(`${k}: ${Object.keys(values[k]).length} countries`);
  }
  const edition = meta.NGDP_RPCH?.source || 'World Economic Outlook';
  const out = {
    source: `IMF, ${edition}`, edition, fetched: new Date().toISOString(), firstYear: FIRST_YEAR,
    countries, groups: GROUPS, values,
  };
  // Only rewrite the file when the figures have actually changed
  const old = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT)) : null;
  if (old && JSON.stringify(old.values) === JSON.stringify(values) && old.edition === edition) {
    console.log('No change in IMF data.');
  } else {
    fs.writeFileSync(OUT, JSON.stringify(out));
    console.log(`Saved ${edition}.`);
  }
} catch (e) {
  // Keep the last good copy rather than breaking the site
  console.error('Could not update IMF data, keeping the existing file:', e.message);
  process.exitCode = 0;
}
