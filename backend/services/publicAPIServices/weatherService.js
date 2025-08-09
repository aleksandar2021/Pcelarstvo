const BASE = 'https://api.open-meteo.com/v1/forecast';

async function getForecast({ lat, lon, days = 7, timezone = 'UTC' }) {
  const url = `${BASE}?latitude=${lat}&longitude=${lon}` +
              `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum` +
              `&forecast_days=${days}&timezone=${encodeURIComponent(timezone)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`weather http ${r.status}`);
  const j = await r.json();
  
  const out = (j.daily?.time || []).map((date, i) => ({
    date,
    tmax: j.daily.temperature_2m_max?.[i] ?? null,
    tmin: j.daily.temperature_2m_min?.[i] ?? null,
    precip: j.daily.precipitation_sum?.[i] ?? null
  }));
  return { provider: 'open-meteo', location: { lat, lon }, days: out.length, data: out };
}

module.exports = { getForecast };
