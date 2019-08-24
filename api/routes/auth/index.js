import { Router } from 'express'
import auth from '../../auth'
import db from '../../db'
import mail from '../../mail'

const router = new Router()

router.post('/signup', async (req, res) => {
  const { name = null, email = null, password = null } = req.body

  if (name && email && password) {
    await db.queryApi('SELECT * FROM users WHERE email=$1', [email], res, async (result) => {
      // Make sure doesn't have existing account
      if (result.rowCount <= 0) {
        const salt = 'bf'
        await db.queryApi('INSERT INTO users (name, email, hash) VALUES ($1, $2, crypt($3, gen_salt($4)))', [name, email, password, salt], res)
      } else {
        res.status(401).send({ message: 'Account already exist' })
      }
    })
  } else {
    res.status(400).send({ message: 'Data "name", "email" or "password" is null or empty' })
  }
})

router.post('/login', async (req, res) => {
  const { email = null, password = null } = req.body

  if (email && password) {
    await db.queryApi('SELECT id, hash=crypt($1, hash) AS match, verified FROM users WHERE email=$2', [password, email], res, async (result) => {
      if (result.rowCount > 0 && result.rows[0].match) {
        if (!result.rows[0].verified) {
          res.status(401).send({ name: 'auth-unverified', message: 'Account is not verified' })
        } else {
          // Send JWT
          const payload = {
            previlage: 'basic',
            userId: result.rows[0].id
          }
          await auth.signJwt(payload, { expiresIn: '12h' })
            .then(token => res.json({ payload, token }))
            .catch(e => res.status(401).send(e))
            .finally(() => res.end())
        }
      } else {
        res.status(401).send({ message: 'Invalid email or password' })
      }
    })
  } else {
    res.status(400).send({ message: 'Data "email" or "password" is null or empty' })
  }
})

router.post('/check', async (req, res) => {
  const { token } = req.body

  if (token) {
    await auth.verifyJwt(token)
      .then(async (dec) => {
        await db.queryApi('SELECT pwd_reset_ts FROM users WHERE id=$1', [dec.userId], res, (result) => {
          const resetTimestamp = result.rows[0].pwd_reset_ts
          const iat = new Date(dec.iat * 1000)
          if (iat > resetTimestamp) {
            res.json(dec)
          } else {
            res.status(401).send({ message: 'Token expired' })
          }
        }, { atLeastOneRow: true })
      })
      .catch(e => res.status(401).send(e))
      .finally(() => res.end())
  } else {
    res.status(400).send({ message: 'Data "token" is null or empty' })
  }
})

router.post('/forgot', async (req, res) => {
  const { email = null } = req.body

  if (email) {
    await db.queryApi('SELECT name FROM users WHERE email=$1', [email], res, async (result) => {
      if (result.rowCount > 0) {
        const token = await auth.signJwt({ email }, { expiresIn: '1h' })

        await mail.sendMail({
          from: 'no-reply@example.com',
          to: email,
          subject: 'Penn Todo: Reset password',
          html: `<p>Hello ${result.rows[0].name},</p><p>Click <a href="https://${req.headers.host}/reset?token=${token}">this link</a> to reset password.</p><p>If you did not request a password reset, please ignore this email.</p><p>Regards, Penn Todo team.`
        })
          .then((info) => {
            res.json({ preview: mail.getTestMessageUrl(info) })
          })
          .catch((e) => {
            res.status(500).send(e)
          })

        res.end()
      } else {
        res.status(401).send({ message: 'Email is not registered' })
      }
    })
  } else {
    res.status(400).send({ message: 'Data "email" is null or empty' })
  }
})

router.post('/reset', async (req, res) => {
  const { token = null, password = null } = req.body

  if (token && password) {
    await auth.verifyJwt(token)
      .then(async (dec) => {
        const salt = 'bf'
        await db.queryApi('UPDATE users SET hash=crypt($1, gen_salt($2)), pwd_reset_ts=now() WHERE email=$3', [password, salt, dec.email], res)
      })
      .catch((e) => {
        res.status(401).send(e)
      })

    res.end()
  } else {
    res.status(400).send({ message: 'Data "token" or "password" is null or empty' })
  }
})

router.post('/send-verify', async (req, res) => {
  const { email } = req.body

  if (email) {
    await db.queryApi('SELECT name, verified FROM users WHERE email=$1', [email], res, async (result) => {
      if (result.rowCount > 0) {
        if (!result.rows[0].verified) {
          const token = await auth.signJwt({ email }, { expiresIn: '1h' })

          await mail.sendMail({
            from: 'no-reply@example.com',
            to: email,
            subject: 'Penn Todo: Verify email',
            html: `<p>Hello ${result.rows[0].name},</p><p>Click <a href="https://${req.headers.host}/verify?token=${token}">this link</a> to verify your account.</p><p>Regards, Penn Todo team.`
          })
            .then((info) => {
              res.json({ preview: mail.getTestMessageUrl(info) })
            })
            .catch((e) => {
              res.status(500).send(e)
            })

          res.end()
        } else {
          res.status(422).send({ message: 'Account already verified' })
        }
      } else {
        res.status(401).send({ message: 'Email is not registered' })
      }
    })
  } else {
    res.status(400).send({ message: 'Data "email" is null or empty' })
  }
})

router.post('/verify', async (req, res) => {
  const { token } = req.body

  if (token) {
    await auth.verifyJwt(token)
      .then(async (dec) => {
        await db.queryApi('UPDATE users SET verified=$1 WHERE email=$2', [true, dec.email], res)
      })
      .catch((e) => {
        res.status(401).send(e)
      })

    res.end()
  } else {
    res.status(400).send({ message: 'Data "token" is null or empty' })
  }
})

export default router
