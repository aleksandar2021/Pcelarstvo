const {
  getFlowering
} = require('../services/publicAPIServices/phenologyService');

const {
    getForecast
} = require('../services/publicAPIServices/weatherService')


async function getFloweringCNT(req, res) {
  try {
    const data = await getFlowering();
    return res.json({ data });
  } catch (err) {
    console.error('getFlowering error:', err);
    return res.status(500).json({ message: 'Failed to load flowering data' });
  }
}

function toNumber(v) {
  if (v == null) return undefined;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

async function getForecastCNT(req, res) {
  try {
    const lat = toNumber(req.query.lat);
    const lon = toNumber(req.query.lon);
    const days = req.query.days ? parseInt(req.query.days, 10) : 7;
    const timezone = req.query.timezone || 'UTC';

    if (lat == null || lon == null) {
      return res.status(400).json({ message: 'lat and lon are required (e.g. ?lat=44.8&lon=20.47)' });
    }

    const data = await getForecast({ lat, lon, days, timezone });
    return res.json({ data });
  } catch (err) {
    console.error('getForecast error:', err);
    return res.status(500).json({ message: 'Failed to fetch forecast.' });
  }
}

module.exports = { getFloweringCNT, getForecastCNT };