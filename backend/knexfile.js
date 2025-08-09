module.exports = {
  development: {
    client: 'mssql',
    connection: {
      user: 'pcelarstvo_user',
      password: 'pcelarstvo_password',
      server: 'localhost',     
      port: 8300,               
      database: 'Pcelarstvo',
      options: {
        trustServerCertificate: true
      }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',  
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
