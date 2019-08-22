import './load-env.js'
import express from 'express'
import bodyParser from 'body-parser'
import reqLocals from './middleware/req-locals.js'
import authRouter from './routes/auth'
import todosRouter from './routes/todos'

const app = express()

app.use(reqLocals)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/auth', authRouter)
app.use('/todos', todosRouter)

app.all('*', (req, res) => {
  res.sendStatus(404)
})

export default app
