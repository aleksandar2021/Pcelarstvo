const { fetchTasks } = require('../services/tasksService');

function n(v) { const x = parseInt(v, 10); return Number.isFinite(x) ? x : undefined; }

async function getTasks(req, res) {
  try {
    const data = await fetchTasks({
      from: req.query.from,
      to: req.query.to,
      status: req.query.status,
      page: n(req.query.page),
      pageSize: n(req.query.pageSize)
    });
    res.json({ total: data.total, items: data.items });
  } catch (e) {
    console.error('admin getTasks error:', e);
    res.status(500).json({ message: 'Failed to load tasks.' });
  }
}

module.exports = { getTasks }