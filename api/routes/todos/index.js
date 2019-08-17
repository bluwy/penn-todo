import { Router } from 'express'
import authCheck from '../../middleware/auth-check.js'
import db from '../../db'

const router = new Router()

router.all('*', authCheck)

router.get('/', async (req, res) => {
  await db.queryApi('SELECT * FROM todos WHERE user_id=$1', [req.locals.userId], res, (result) => {
    res.json({ todos: result.rows })
  })
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  await db.queryApi('SELECT * FROM todos WHERE id=$1 AND user_id=$2', [id, req.locals.userId], res, (result) => {
    res.json(result.rows[0])
  }, { atLeastOneRow: true })
})

router.put('/title/:id', async (req, res) => {
  const id = req.params.id

  const { title = null } = req.body

  if (title) {
    await db.queryApi('UPDATE todos SET title=$1 WHERE id=$2 AND user_id=$3', [title, id, req.locals.userId], res)
  } else {
    res.status(400).send({ message: 'Data "title" is null or empty' })
  }
})

router.put('/done/:id', async (req, res) => {
  const id = req.params.id

  const { done = null } = req.body

  if (done !== null) {
    await db.queryApi('UPDATE todos SET done=$1 WHERE id=$2 AND user_id=$3', [done, id, req.locals.userId], res)
  } else {
    res.status(400).send('Data "done" is null')
  }
})

router.post('/add', async (req, res) => {
  const { title = null, done = false } = req.body

  if (title) {
    await db.queryApi('INSERT INTO todos (title, done, user_id) VALUES ($1, $2, $3) RETURNING id', [title, done, req.locals.userId], res, (result) => {
      res.json(result.rows[0])
    }, { atLeastOneRow: true })
  } else {
    res.status(400).send('Data "title" is null or empty')
  }
})

router.delete('/done', async (req, res) => {
  await db.queryApi('DELETE FROM todos WHERE done=$1 AND user_id=$2', [true, req.locals.userId], res)
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  await db.queryApi('DELETE FROM todos WHERE id=$1 AND user_id=$2', [id, req.locals.userId], res)
})

export default router
