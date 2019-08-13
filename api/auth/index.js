import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

export default {
  /**
   * Signs the token
   * @param {(string|object|Buffer)} payload The JWT payload
   * @param {jwt.SignOptions} options JWT sign options
   * @returns {Promise<string>} The JWT token
   */
  signJwt (payload, options) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, options, (err, enc) => {
        if (err) {
          reject(err)
        } else {
          resolve(enc)
        }
      })
    })
  },
  /**
   * Verifies the token
   * @param {(string|object)} token The JWT token
   * @param {jwt.VerifyOptions} options JWT verify options
   * @returns {Promise<(string|object)>} The decoded payload
   */
  verifyJwt (token, options) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, options, (err, dec) => {
        if (err) {
          reject(err)
        } else {
          resolve(dec)
        }
      })
    })
  }
}
