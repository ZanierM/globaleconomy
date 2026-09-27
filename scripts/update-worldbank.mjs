// Downloads World Bank development and trade indicators for the World Economy Globe
// and saves a compact copy to data/worldbank.json.
// Run with:  node scripts/update-worldbank.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'data', 'worldbank.json');
const IMF = path.join(ROOT, 'data', 'imf.json');
const SHAPES = path.join(ROOT, 'data', 'shape-ids.json');
const INDICATORS = [
  'SP.DYN.LE00.IN',        // life expectancy
  'SI.POV.GINI',           // Gini index
  'SI.POV.DDAY',           // extreme poverty ($3.00 a day, 2021 PPP)
  'EN.GHG.CO2.PC.CE.AR5',  // CO2 per head
  'NE.TRD.GNFS.ZS',        // trade % of GDP
  'NE.EXP.GNFS.ZS',        // exports % of GDP
  'BX.KLT.DINV.WD.GD.ZS',  // FDI net inflows % of GDP
  'BX.TRF.PWKR.DT.GD.ZS',  // remittances % of GDP
  'NV.AGR.TOTL.ZS', 'NV.IND.TOTL.ZS', 'NV.SRV.TOTL.ZS', // sectors % of GDP
];
const FIRST_YEAR = 2000;
const LAST_YEAR = new Date().getFullYear();
const GROUPS = { WLD: 'World', HIC: 'High-income countries', LMY: 'Low and middle income' };
const REMAP = { XKX: 'UVK', PSE: 'WBG' }; // World Bank code -> IMF code used by the map

async function get(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'EconomyLive/1.0 (school project)' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise((res) => setTimeout(res, 3000 * attempt));
    }
  }
}

try {
  const imf = JSON.parse(fs.readFileSync(IMF));
  const keep = new Set([...Object.keys(imf.countries), ...Object.values(JSON.parse(fs.readFileSync(SHAPES))), ...Object.keys(GROUPS)]);
  const values = {}, names = {};
  for (const k of INDICATORS) {
    const j = await get(`https://api.worldbank.org/v2/country/all/indicator/${k}?format=json&date=${FIRST_YEAR}:${LAST_YEAR}&per_page=20000`);
    if (!Array.isArray(j) || !j[1]) throw new Error(`Unexpected reply for ${k}`);
    const by = {};
    for (const row of j[1]) {
      if (row.value === null || !row.countryiso3code) continue;
      const code = REMAP[row.countryiso3code] || row.countryiso3code;
      if (!keep.has(code)) continue;
      (by[code] ||= {})[row.date] = row.value;
      if (!imf.countries[code] && !GROUPS[code]) names[code] = row.country.value;
    }
    values[k] = {};
    for (const [code, yrs] of Object.entries(by)) {
      const arr = [];
      for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) arr.push(yrs[y] == null ? null : Math.round(yrs[y] * 100) / 100);
      while (arr.length && arr[arr.length - 1] === null) arr.pop();
      if (arr.length) values[k][code] = arr;
    }
    console.log(`${k}: ${Object.keys(values[k]).length} countries`);
  }
  const old = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT)) : null;
  if (old && JSON.stringify(old.values) === JSON.stringify(values)) {
    console.log('No change in World Bank data.');
  } else {
    fs.writeFileSync(OUT, JSON.stringify({ source: 'World Bank, World Development Indicators', fetched: new Date().toISOString(), firstYear: FIRST_YEAR, groups: GROUPS, names, values }));
    console.log('Saved World Bank data.');
  }
} catch (e) {
  console.error('Could not update World Bank data, keeping the existing file:', e.message);
  process.exitCode = 0;
}
