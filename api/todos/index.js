import { Router } from 'express'
import db from '../db'

const router = new Router()

router.get('/todos/:uid', async (req, res) => {
  const uid = req.params.uid
  await db.queryApi('SELECT * FROM todos WHERE uid=$1', [uid], res, (result) => {
    res.json(result.rows[0])
  }, { atLeastOneRow: true })
})

router.get('/todos', async (req, res) => {
  await db.queryApi('SELECT * FROM todos', null, res, (result) => {
    res.json({ todos: result.rows })
  })
})

router.put('/todos/title/:uid', async (req, res) => {
  const uid = req.params.uid

  const { title = null } = req.body

  if (title) {
    await db.queryApi('UPDATE todos SET title=$1 WHERE uid=$2', [title, uid], res)
  } else {
    res.status(400).send(new Error('Data "title" is null or empty'))
  }
})

router.put('/todos/done/:uid', async (req, res) => {
  const uid = req.params.uid

  const { done = null } = req.body

  if (done !== null) {
    await db.queryApi('UPDATE todos SET done=$1 WHERE uid=$2', [done, uid], res)
  } else {
    res.status(400).send('Data "done" is null')
  }
})

router.post('/todos/add', async (req, res) => {
  const { title = null, done = false } = req.body

  if (title) {
    await db.queryApi('INSERT INTO todos (title, done) VALUES ($1, $2) RETURNING uid', [title, done], res, (result) => {
      res.json(result.rows[0])
    }, { atLeastOneRow: true })
  } else {
    res.status(400).send('Data "title" is null or empty')
  }
})

router.delete('/todos/done', async (req, res) => {
  await db.queryApi('DELETE FROM todos WHERE done=$1', [true], res)
})

router.delete('/todos/:uid', async (req, res) => {
  const uid = req.params.uid
  await db.queryApi('DELETE FROM todos WHERE uid=$1', [uid], res)
})

export default router
