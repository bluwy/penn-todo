import express from 'express'
import bodyParser from 'body-parser'
import todosRouter from './todos'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(todosRouter)

app.all('*', (req, res) => {
  res.sendStatus(404)
})

export default {
  path: '/api',
  handler: app
}
