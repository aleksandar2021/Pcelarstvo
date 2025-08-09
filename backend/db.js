const sql = require('mssql');

const config = {
  user: 'pcelarstvo_user',
  password: 'pcelarstvo_password',
  server: 'localhost',
  port: 8300,
  database: 'Pcelarstvo',
  options: {
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = { sql, pool, poolConnect };
