require('dotenv').config();
const knex = require('knex');
const env = process.env;

const db = knex({
  client: 'pg',
  connection: {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
  }
});

module.exports = db;