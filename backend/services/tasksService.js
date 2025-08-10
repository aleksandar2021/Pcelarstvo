const { sql, poolConnect } = require('../db');

function pagingClause(page = 1, pageSize = 20, defaultOrder = 't.start_at DESC, t.id DESC') {
  page = Math.max(1, parseInt(page, 10) || 1);
  pageSize = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 20));
  const offset = (page - 1) * pageSize;
  return { page, pageSize, offset, orderBy: defaultOrder };
}

function toDateOnly(d) {
  const dt = new Date(d);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function fetchTasks({ from, to, status, page, pageSize }) {
  await poolConnect;
  const req = (await poolConnect).request();
  const { offset, pageSize: ps, orderBy } = pagingClause(page, pageSize);

  let where = '1=1';
  if (from) { req.input('from', sql.DateTime2, new Date(from)); where += ' AND t.start_at >= @from'; }
  if (to)   { req.input('to',   sql.DateTime2, new Date(to));   where += ' AND (t.end_at IS NULL OR t.end_at <= @to)'; }
  if (status) { 
    req.input('st', sql.VarChar(20), status);
    where += ' AND EXISTS (SELECT 1 FROM TaskAssignments a WHERE a.task_id=t.id AND a.status=@st)';
  }

  const countQ = `
    SELECT COUNT(*) AS total
    FROM Tasks t
    WHERE ${where};
  `;
  const dataQ = `
    SELECT
      t.id, t.title, t.description, t.start_at, t.end_at, t.created_at, t.location,
      t.source_type,
      COUNT(a.id) AS assignments_total,
      SUM(CASE WHEN a.status='DONE' THEN 1 ELSE 0 END) AS assignments_done
    FROM Tasks t
    LEFT JOIN TaskAssignments a ON a.task_id = t.id
    WHERE ${where}
    GROUP BY t.id, t.title, t.description, t.start_at, t.end_at, t.created_at, t.location, t.source_type
    ORDER BY ${orderBy}
    OFFSET ${offset} ROWS FETCH NEXT ${ps} ROWS ONLY;
  `;

  const [countRes, dataRes] = await Promise.all([
    req.query(countQ),
    req.query(dataQ)
  ]);

  const total = countRes.recordset[0]?.total || 0;
  return { total, items: dataRes.recordset };
}

async function fetchComments({ from, to, beekeeperId, taskId, page, pageSize }) {
  await poolConnect;
  const req = (await poolConnect).request();
  const { offset, pageSize: ps, orderBy } = pagingClause(page, pageSize, 'c.created_at DESC, c.id DESC');

  let where = '1=1';
  if (from) { req.input('from', sql.DateTime2, new Date(from)); where += ' AND c.created_at >= @from'; }
  if (to)   { req.input('to',   sql.DateTime2, new Date(to));   where += ' AND c.created_at <= @to'; }
  if (beekeeperId) { req.input('bk', sql.Int, beekeeperId); where += ' AND c.author_id = @bk'; }
  if (taskId)      { req.input('tid', sql.Int, taskId);     where += ' AND c.task_id = @tid'; }

  const countQ = `
    SELECT COUNT(*) AS total
    FROM TaskComments c
    WHERE ${where};
  `;
  const dataQ = `
    SELECT
      c.id, c.task_id, c.assignment_id, c.author_id,
      c.content, c.created_at,
      t.title AS task_title,
      u.name, u.surname
    FROM TaskComments c
    LEFT JOIN Tasks t ON t.id = c.task_id
    LEFT JOIN Users u ON u.id = c.author_id
    WHERE ${where}
    ORDER BY ${orderBy}
    OFFSET ${offset} ROWS FETCH NEXT ${ps} ROWS ONLY;
  `;

  const [countRes, dataRes] = await Promise.all([
    req.query(countQ),
    req.query(dataQ)
  ]);

  const total = countRes.recordset[0]?.total || 0;
  return { total, items: dataRes.recordset };
}

async function fetchCompleted({ from, to, beekeeperId, taskId, page, pageSize }) {
  await poolConnect;
  const req = (await poolConnect).request();
  const { offset, pageSize: ps, orderBy } = pagingClause(page, pageSize, 'a.done_at DESC, a.id DESC');

  let where = "a.status='DONE'";
  if (from) { req.input('from', sql.DateTime2, new Date(from)); where += ' AND a.done_at >= @from'; }
  if (to)   { req.input('to',   sql.DateTime2, new Date(to));   where += ' AND a.done_at <= @to'; }
  if (beekeeperId) { req.input('bk', sql.Int, beekeeperId); where += ' AND a.beekeeper_id = @bk'; }
  if (taskId)      { req.input('tid', sql.Int, taskId);     where += ' AND a.task_id = @tid'; }

  const countQ = `
    SELECT COUNT(*) AS total
    FROM TaskAssignments a
    WHERE ${where};
  `;
  const dataQ = `
    SELECT
      a.id AS assignment_id,
      a.task_id,
      a.beekeeper_id,
      a.done_at,
      a.result_note,
      t.title AS task_title,
      t.start_at, t.end_at,
      u.name, u.surname
    FROM TaskAssignments a
    LEFT JOIN Tasks t ON t.id = a.task_id
    LEFT JOIN Users u ON u.id = a.beekeeper_id
    WHERE ${where}
    ORDER BY ${orderBy}
    OFFSET ${offset} ROWS FETCH NEXT ${ps} ROWS ONLY;
  `;

  const [countRes, dataRes] = await Promise.all([
    req.query(countQ),
    req.query(dataQ)
  ]);

  const total = countRes.recordset[0]?.total || 0;
  return { total, items: dataRes.recordset };
}

async function getBeekeeperCalendar({ beekeeperId, from, to }) {
  if (!beekeeperId) throw new Error('beekeeperId required');
  if (!from || !to) throw new Error('from and to required');

  await poolConnect;
  const req = (await poolConnect).request();
  req.input('bk', sql.Int, beekeeperId);
  req.input('from', sql.Date, new Date(from));
  req.input('to', sql.Date, new Date(to));

  const q = `
    SELECT
      a.id AS assignment_id,
      a.status AS assignment_status,           -- 'ASSIGNED' | 'DONE' | ...
      a.done_at,
      t.id AS task_id,
      t.title,
      t.start_at,
      t.end_at
    FROM TaskAssignments a
    JOIN Tasks t ON t.id = a.task_id
    WHERE a.beekeeper_id = @bk
      AND CAST(t.start_at AS date) BETWEEN @from AND @to;
  `;
  const rs = await req.query(q);

  const now = new Date();
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const today = todayDate.getTime();

  // group by date
  const byDate = new Map(); 
  for (const row of rs.recordset) {
    const dayKey = toDateOnly(row.start_at);
    const bucket = byDate.get(dayKey) || { done: false, future: false, past: false };

    if ((row.assignment_status || '').toUpperCase() === 'DONE') {
      bucket.done = true;
    } else {
      const start = new Date(row.start_at).getTime();
      const end = row.end_at ? new Date(row.end_at).getTime() : null;

      const isFuture = start >= today;
      const isOverdue = end ? (end < now.getTime()) : (start < today);

      if (isOverdue) bucket.past = true;
      else if (isFuture) bucket.future = true;
      else {
        bucket.future = true;
      }
    }

    byDate.set(dayKey, bucket);
  }

  const result = [...byDate.entries()]
    .map(([date, b]) => {
      let status = null;
      if (b.done) status = 'DONE';
      else if (b.future) status = 'ASSIGNED_FUTURE';
      else if (b.past) status = 'ASSIGNED_PAST';
      return { date, status };
    })
    .filter(x => !!x.status)
    .sort((a, b) => a.date.localeCompare(b.date));

  return result;
}

module.exports = {
  fetchTasks,
  fetchComments,
  fetchCompleted,
  getBeekeeperCalendar
};