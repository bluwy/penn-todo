import { Pool } from 'pg'

// Config here else can't get environment variables
// This file runs before anything else idk why, so I config here
require('dotenv').config()

// Connection string from environment variables
const connectionString = process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL

const pool = new Pool({ connectionString })

export default {
  /**
   * Query database and auto handle failed queries
   * @param {string} text Query text
   * @param {any[]} params Query parameters
   * @param {Response} response Express response
   * @param {(result: QueryResult) => void} callback Callback query result if it's not empty
   * @param {boolean} force Force callback even if result is empty
   */
  query (text, params, response, callback, force) {
    return pool.query(text, params, (err, result) => {
      if (err) {
        // Server error
        response.sendStatus(500)
      } else if (callback) {
        if (result.rows.length > 0 || force) {
          callback(result)
        } else {
          // No data found
          response.sendStatus(204)
        }
      }
    })
  },
  /**
   * Direct call to node-postgres pool
   * @param {string} text Query text
   * @param {any[]} params Query parameters
   * @param {(err: Error, result: QueryResult) => void} callback Callback after query
   */
  queryNative (text, params, callback) {
    return pool.query(text, params, callback)
  },
  async end () {
    await pool.end()
  }
}
