const { sql, poolConnect } = require('../db');

function pagingClause(page = 1, pageSize = 20, defaultOrder = 't.start_at DESC, t.id DESC') {
  page = Math.max(1, parseInt(page, 10) || 1);
  pageSize = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 20));
  const offset = (page - 1) * pageSize;
  return { page, pageSize, offset, orderBy: defaultOrder };
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

module.exports = {
  fetchTasks
};