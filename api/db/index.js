import { Pool } from 'pg'

// Connection string from environment variables
const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
pool.connect()

export default {
  query (text, params, callback) {
    return pool.query(text, params, callback)
  }
}
