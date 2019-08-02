import { Router } from 'express'
import db from '../db'

const router = new Router()

router.get('/todos/:uid', (req, res) => {
  const uid = req.params.uid
  db.query('SELECT * FROM todos WHERE uid=$1', [uid], (err, result) => {
    if (err) {
      res.sendStatus(400)
      return
    }
    if (result.rows.length > 0) {
      res.send(result.rows[0])
    } else {
      res.sendStatus(204)
    }
  })
})

router.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', null, (err, result) => {
    if (err) {
      res.sendStatus(400)
      return
    }
    res.send(result.rows)
  })
})

router.put('/todos/:uid', (req, res) => {
  const uid = req.params.uid

  const done = req.query.done
  if (done) {
    db.query('UPDATE todos SET done=$1 WHERE uid=$2', [done, uid])
    res.end()
  } else {
    res.sendStatus(400)
  }
})

router.post('/todos/add', (req, res) => {
  const title = req.query.title

  if (title) {
    const done = req.query.done | 'false'
    db.query('INSERT INTO todos (title, done) VALUES ($1, $2) RETURNING uid', [title, done], (err, result) => {
      if (err) {
        res.sendStatus(400)
        return
      }
      res.send(result.rows[0])
    })
  } else {
    res.sendStatus(400)
  }
})

router.delete('/todos/:uid', (req, res) => {
  const uid = req.params.uid
  db.query('DELETE FROM todos WHERE uid=$1', [uid])
  res.end()
})

export default router
