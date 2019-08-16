import { Router } from 'express'
import nm from 'nodemailer'
import db from '../../db'
import auth from '../../auth'

/** @type{Router} */
const router = new Router()

// Manage send token and end response
async function sendJwtToken (res, previlage, userId) {
  const payload = { previlage, userId }
  await auth.signJwt(payload, { expiresIn: '12h' })
    .then(token => res.json({ payload, token }))
    .catch(e => res.status(401).send(e))
    .finally(() => res.end())
}

router.post('/signup', async (req, res) => {
  const { name = null, email = null, password = null } = req.body

  if (name && email && password) {
    await db.queryApi('SELECT * FROM users WHERE email=$1', [email], res, async (result) => {
      // Make sure doesn't have existing account
      if (result.rowCount <= 0) {
        const salt = 'bf'
        await db.queryApi('INSERT INTO users (name, email, hash) VALUES ($1, $2, crypt($3, gen_salt($4))) RETURNING id', [name, email, password, salt], res, async (result2) => {
          // Send JWT
          await sendJwtToken(res, 'basic', result2.rows[0].id)
        }, { atLeastOneRow: true })
      } else {
        res.status(401).send(new Error('Account already exist'))
      }
    })
  } else {
    res.status(400).send(new Error('Data "name", "email" or "password" is null or empty'))
  }
})

router.post('/login', async (req, res) => {
  const { email = null, password = null } = req.body

  if (email && password) {
    await db.queryApi('SELECT id, hash=crypt($1, hash) AS match FROM users WHERE email=$2', [password, email], res, async (result) => {
      if (result.rowCount > 0 && result.rows[0].match) {
        // Send JWT
        await sendJwtToken(res, 'basic', result.rows[0].id)
      } else {
        res.status(401).send(new Error('Invalid email or password'))
      }
    })
  } else {
    res.status(400).send(new Error('Data "email" or "password" is null or empty'))
  }
})

router.post('/check', async (req, res) => {
  const { token } = req.body

  if (token) {
    await auth.verifyJwt(token)
      .then(dec => res.json(dec))
      .catch(e => res.status(401).send(e))
      .finally(() => res.end())
  } else {
    res.status(400).send(new Error('Data "token" is null or empty'))
  }
})

router.post('/forgot', async (req, res) => {
  const { email = null } = req.body

  if (email) {
    await db.queryApi('SELECT name FROM users WHERE email=$1', [email], res, async (result) => {
      if (result.rowCount > 0) {
        const token = await auth.signJwt({ email }, { expiresIn: '1h' })

        // Send email
        const acc = await nm.createTestAccount()

        const transporter = nm.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: acc.user,
            pass: acc.pass
          }
        })

        const info = await transporter.sendMail({
          from: 'no-reply@example.com',
          to: email,
          subject: 'Penn Todo: Reset password',
          html: `<p>Hello ${result.rows[0].name},</p><p>Click <a href="https://${req.headers.host}/reset?token=${token}">this link</a> to reset password.</p><p>If you did not request a password reset, please ignore this email.</p><p>Regards, Penn Todo team.`
        })

        res.json({ preview: nm.getTestMessageUrl(info) })
      } else {
        res.status(401).send(new Error('Email is not registered'))
      }
    })
  } else {
    res.status(400).send(new Error('Data "email" is null or empty'))
  }
})

router.post('/reset', async (req, res) => {
  const { token = null, password = null } = req.body

  if (token && password) {
    await auth.verifyJwt(token)
      .then(async (dec) => {
        const salt = 'bf'
        await db.queryApi('UPDATE users SET hash=crypt($1, gen_salt($2)) WHERE email=$3', [password, salt, dec.email], res)
      })
      .catch((e) => {
        res.status(401).send(e)
      })
  } else {
    res.status(400).send(new Error('Data "token" or "password" is null or empty'))
  }
})

export default router
