module.exports = {
  development: {
    username: 'root',
    password: '1fafp404',
    database: 'Park_University',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: 'database_test',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: "JAWSDB_URL",
    dialect: 'mysql'
  }
};
