const { fetchTasks, fetchComments, fetchCompleted, getBeekeeperCalendar } = require('../services/tasksService');

function n(v) { const x = parseInt(v, 10); return Number.isFinite(x) ? x : undefined; }
function d(v) { return v ? String(v) : undefined; }

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

async function getCompleted(req, res) {
  try {
    const data = await fetchCompleted({
      from: req.query.from,
      to: req.query.to,
      beekeeperId: n(req.query.beekeeperId),
      taskId: n(req.query.taskId),
      page: n(req.query.page),
      pageSize: n(req.query.pageSize)
    });
    res.json({ total: data.total, items: data.items });
  } catch (e) {
    console.error('admin getCompleted error:', e);
    res.status(500).json({ message: 'Failed to load completed assignments.' });
  }
}

async function beekeeperCalendarCNT(req, res) {
  try {
    const beekeeperId = n(req.query.beekeeperId);
    const from = d(req.query.from);
    const to = d(req.query.to);

    if (!beekeeperId || !from || !to) {
      return res.status(400).json({ message: 'beekeeperId, from and to are required.' });
    }

    const items = await getBeekeeperCalendar({ beekeeperId, from, to });
    return res.json({ items });
  } catch (e) {
    console.error('beekeeperCalendar error:', e);
    return res.status(500).json({ message: 'Failed to load calendar.' });
  }
}

module.exports = { getTasks, getComments, getCompleted, beekeeperCalendarCNT }