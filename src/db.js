const { Pool } = require('pg')

// Hanterar en återanvändbar pool av PostgreSQL-anslutningar
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

module.exports = pool
