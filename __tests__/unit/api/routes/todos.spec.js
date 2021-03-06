import request from 'supertest'
import app from '~/api'
import auth from '~/api/auth'
import db from '~/api/db'

jest.setTimeout(10000)

describe('API Route Todos', () => {
  const testDatas = [
    {
      id: 1,
      title: 'Todo 1',
      done: false,
      user_id: 1
    },
    {
      id: 2,
      title: 'Todo 2',
      done: true,
      user_id: 1
    }
  ]

  let token
  let headers

  beforeAll(async () => {
    token = await auth.signJwt({ userId: 1 }, { expiresIn: '5m' })
    headers = { 'Authorization': token }

    await db.query(
      `CREATE TABLE todos
      (
        id serial PRIMARY KEY,
        title text NOT NULL,
        done boolean NOT NULL,
        user_id integer NOT NULL
      )`
    )
  })

  beforeEach(async () => {
    for (const data of testDatas) {
      await db.query('INSERT INTO todos (title, done, user_id) VALUES ($1, $2, $3)', [data.title, data.done, data.user_id])
    }
  })

  afterEach(async () => {
    await db.query('DELETE FROM todos')
    // Restart id auto-incremnet sequence to start from 1 again
    await db.query('ALTER SEQUENCE todos_id_seq RESTART WITH 1')
  })

  afterAll(async () => {
    await db.query('DROP TABLE todos')
    await db.end()
  })

  describe('GET /todos', () => {
    it('should get all todos', async () => {
      expect.assertions(3)
      const res = await request(app).get('/todos/').set(headers)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('todos')
      expect(res.body.todos).toEqual(testDatas)
    })

    it('should return empty array when no todos', async () => {
      await db.query('DELETE FROM todos')
      expect.assertions(2)
      const res = await request(app).get('/todos/').set(headers)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ todos: [] })
    })
  })

  describe('GET /todos/:id', () => {
    it('should get one todo', async () => {
      expect.assertions(2)
      const res = await request(app).get('/todos/1').set(headers)
      expect(res.status).toBe(200)
      expect(res.body).toEqual(testDatas[0])
    })

    it('should respond status 204 when no todo found', async () => {
      expect.assertions(1)
      const res = await request(app).get('/todos/3').set(headers)
      expect(res.status).toBe(204)
    })
  })

  describe('PUT /todos/title/:id', () => {
    it('should update todo title', async () => {
      expect.assertions(3)
      const res = await request(app).put('/todos/title/1').set(headers).send({ title: '810' })
      expect(res.status).toBe(200)
      expect(res.body).toEqual({})

      const res2 = await request(app).get('/todos/1').set(headers)
      expect(res2.body.title).toBe('810')
    })

    it('should respond status 400 when data insufficient', async () => {
      expect.assertions(1)
      const res = await request(app).put('/todos/title/1').set(headers)
      expect(res.status).toBe(400)
    })
  })

  describe('PUT /todos/done/:id', () => {
    it('should update todo done', async () => {
      expect.assertions(3)
      const res = await request(app).put('/todos/done/1').set(headers).send({ done: true })
      expect(res.status).toBe(200)
      expect(res.body).toEqual({})

      const res2 = await request(app).get('/todos/1').set(headers)
      expect(res2.body.done).toBe(true)
    })

    it('should respond status 400 when data insufficient', async () => {
      expect.assertions(1)
      const res = await request(app).put('/todos/done/1').set(headers)
      expect(res.status).toBe(400)
    })
  })

  describe('POST /todos/add', () => {
    it('should add a new todo', async () => {
      expect.assertions(3)
      const res = await request(app).post('/todos/add').set(headers).send({ title: '810', done: false })
      expect(res.status).toBe(200)
      // Return incremented id, which should be 3
      expect(res.body).toEqual({ id: 3 })

      const res2 = await request(app).get('/todos').set(headers)
      expect(res2.body.todos).toHaveLength(3)
    })

    it('should respond status 400 when data insufficient', async () => {
      expect.assertions(1)
      const res = await request(app).post('/todos/add').set(headers)
      expect(res.status).toBe(400)
    })
  })

  describe('DELETE /todos/done', () => {
    it('should delete all done todos', async () => {
      expect.assertions(3)
      const res = await request(app).delete('/todos/done').set(headers)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({})

      const res2 = await request(app).get('/todos').set(headers)
      expect(res2.body.todos).toHaveLength(1)
    })
  })

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      expect.assertions(3)
      const res = await request(app).delete('/todos/1').set(headers)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({})

      const res2 = await request(app).get('/todos').set(headers)
      expect(res2.body.todos).toHaveLength(1)
    })
  })
})
