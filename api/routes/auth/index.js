import { Router } from 'express'
import nm from 'nodemailer'
import db from '../../db'
import auth from '../../auth'

/** @type{Router} */
const router = new Router()

// Manage send token and end response
async function sendJwtToken (res, previlage, userId) {
  await auth.signJwt({ previlage, userId }, { expiresIn: '12h' })
    .then(token => res.json({ token }))
    .catch(e => res.status(401).send(e))
    .finally(() => res.end())
}

router.post('/signup', async (req, res) => {
  const { name = null, email = null, password = null } = req.body

  if (name && email && password) {
    await db.queryApi('SELECT * FROM users WHERE email=$1', [email], res, async (result) => {
      // Make sure doesn't have existing account
      if (result.rows.length <= 0) {
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
      if (result.rows.length > 0 && result.rows[0].match) {
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

router.post('/forgot', async (req, res) => {
  const { email = null } = req.body

  if (email) {
    await db.queryApi('SELECT name FROM users WHERE email=$1', [email], res, async (result) => {
      if (result.rows.length > 0) {
        // Send email
        const acc = await nm.createTestAccount()

        const transporter = nm.createTransport({
          host: 'stmp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: acc.user,
            pass: acc.pass
          }
        })

        const info = await transporter.sendMail({
          from: 'Blu',
          to: 'boom@bard.com',
          subject: 'Test',
          text: 'Hello?',
          html: `<h1>Forgot password, ${result.rows[0].name}?</h1>`
        })

        console.log('Email sent: ', info.messageId)
        console.log('Email preview: ', nm.getTestMessageUrl(info))
      } else {
        res.status(401).send(new Error('Email is not registered'))
      }
    })
  } else {
    res.status(400).send(new Error('Data "email" is null or empty'))
  }
})

export default router
