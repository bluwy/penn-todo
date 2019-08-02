import express from 'express'
import todosRouter from './todos'

const app = express()

app.use(todosRouter)

app.all('*', (req, res) => {
  res.sendStatus(404)
})

export default {
  path: '/api',
  handler: app
}
