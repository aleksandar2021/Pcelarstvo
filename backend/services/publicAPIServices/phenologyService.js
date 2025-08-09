const PHENO_ENDPOINT = 'https://data.usanpn.org/observations/getSitePhenometrics.json';

async function getFlowering({
  years,
  species_id,
  phenophase_id,
  request_source = 'Pcelarstvo',
  period_start = '01-01',
  period_end = '12-31',
  region,
  bbox 
}) {

  if (!species_id || !phenophase_id || !Array.isArray(years) || !years.length) {
    throw new Error('species_id, phenophase_id and years[] are required.');
  }
  
  const url = new URL(PHENO_ENDPOINT);
  url.searchParams.set('request_source', request_source);
  years.forEach(y => url.searchParams.append('years', String(y)));
  url.searchParams.append('species_ids', String(species_id));
  url.searchParams.append('phenophase_ids', String(phenophase_id));
  url.searchParams.append('period_start', period_start);
  url.searchParams.append('period_end', period_end);
  if (Array.isArray(bbox) && bbox.length === 4) {
    url.searchParams.append('bbox', bbox.join(','));
  }

  const r = await fetch(url.toString());
  if (!r.ok) throw new Error(`phenology http ${r.status}`);
  const json = await r.json();

  const rows = Array.isArray(json) ? json : (json.data || []);
  const byYear = new Map();

  for (const row of rows) {
    const year =
      row.year ||
      (row.phenophase_onset_date ? new Date(row.phenophase_onset_date).getUTCFullYear() : null);
    if (!year) continue;

    const onset = row.phenophase_onset_date || row.onset_date || row.start_date;
    const end   = row.phenophase_end_date   || row.end_date   || row.last_date;

    if (!onset && !end) continue;

    const prev = byYear.get(year) || { start: null, end: null };
    const bestStart = [prev.start, onset].filter(Boolean).sort()[0] || onset || prev.start;
    const bestEnd   = [prev.end, end].filter(Boolean).sort().slice(-1)[0] || end || prev.end;

    byYear.set(year, { start: bestStart || null, end: bestEnd || null });
  }

  const windows = [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([y, w]) => ({ year: y, start: w.start, end: w.end }));

  return {
    provider: 'usa-npn',
    plant: `species_id:${species_id}`,
    region: region || (bbox ? `bbox:${bbox.join(',')}` : 'n/a'),
    windows,
    notes: `phenophase_id:${phenophase_id}; data = Site Phenometrics (onset/end by year).`
  };
}

module.exports = { getFlowering };
