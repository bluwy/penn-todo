import { Router } from 'express'
import db from '../db'

const router = new Router()

router.get('/todos/:uid', (req, res) => {
  const uid = req.params.uid
  db.query('SELECT * FROM todos WHERE uid=$1', [uid], res, (result) => {
    res.json(result.rows[0])
  })
})

router.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', null, res, (result) => {
    res.json(result.rows)
  })
})

router.put('/todos/title/:uid', (req, res) => {
  const uid = req.params.uid

  const { title } = req.body
  if (title) {
    db.query('UPDATE todos SET title=$1 WHERE uid=$2', [title, uid], res)
    res.end()
  } else {
    res.sendStatus(400)
  }
})

router.put('/todos/done/:uid', (req, res) => {
  const uid = req.params.uid

  const { done } = req.body
  if (done) {
    db.query('UPDATE todos SET done=$1 WHERE uid=$2', [done, uid], res)
    res.end()
  } else {
    res.sendStatus(400)
  }
})

router.post('/todos/add', (req, res) => {
  const { title, done = 'false' } = req.body

  if (title) {
    db.query('INSERT INTO todos (title, done) VALUES ($1, $2) RETURNING uid', [title, done], res, (result) => {
      res.json(result.rows[0])
    })
  } else {
    res.sendStatus(400)
  }
})

router.delete('/todos/:uid', (req, res) => {
  const uid = req.params.uid
  db.query('DELETE FROM todos WHERE uid=$1', [uid], res)
  res.end()
})

export default router
