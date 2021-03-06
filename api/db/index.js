import { Pool } from 'pg'

// Connection string from environment variables
const connectionString = process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL

const pool = new Pool({ connectionString, ssl: process.env.DATABASE_SSL === 'true' })

export default {
  /**
   * Query DB
   * @param {string} text Query text
   * @param {any[]} params Query parameters
   */
  query (text, params) {
    return pool.query(text, params)
  },
  /**
   * Query DB for Express APIs. Auto handles errors.
   * @param {string} text Query text
   * @param {any[]} params Query parameters
   * @param {Response} res Express response
   * @param {(result) => void} cb Callback if query succeed and meet conditions from `options`
   * @param {{}} options Extra options to check before invoking callback
   */
  async queryApi (text, params, res, cb = null, options = null) {
    await pool.query(text, params)
      .then(async (result) => {
        if (cb) {
          let stopCb

          if (options) {
            if (options.atLeastOneRow && result.rowCount <= 0) {
              res.status(204).send({ message: 'Query result is empty' })
              stopCb = true
            }
          }

          if (!stopCb) {
            await cb(result)
          }
        }
      })
      .catch(e => res.status(500).send(e))
      .finally(() => res.end())
  },
  async end () {
    await pool.end()
  }
}
