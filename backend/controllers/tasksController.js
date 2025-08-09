const { fetchTasks, fetchComments } = require('../services/tasksService');

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

async function getComments(req, res) {
  try {
    const data = await fetchComments({
      from: req.query.from,
      to: req.query.to,
      beekeeperId: n(req.query.beekeeperId),
      taskId: n(req.query.taskId),
      page: n(req.query.page),
      pageSize: n(req.query.pageSize)
    });
    res.json({ total: data.total, items: data.items });
  } catch (e) {
    console.error('admin getComments error:', e);
    res.status(500).json({ message: 'Failed to load comments.' });
  }
}

module.exports = { getTasks, getComments }