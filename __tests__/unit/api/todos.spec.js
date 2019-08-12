import request from 'supertest'
import app from '~/api/index.js'
import db from '~/api/db/index.js'

// Note:
// Axios response data is at res.data
// Supertest response data is at res.body

// Set timeout to 10sec since database query could be slow
// Increase this if Jest slaps you with timeout errors
jest.setTimeout(10000)

describe('API Todos', () => {
  const testDatas = [
    {
      id: 1,
      title: 'Todo 1',
      done: false
    },
    {
      id: 2,
      title: 'Todo 2',
      done: true
    }
  ]

  beforeAll(async () => {
    await db.query(
      `CREATE TABLE todos
      (
        id SERIAL PRIMARY KEY,
        title character varying(256) NOT NULL,
        done boolean NOT NULL
      )`
    )
  })

  beforeEach(async () => {
    for (const data of testDatas) {
      await db.query('INSERT INTO todos (title, done) VALUES ($1, $2)', [data.title, data.done])
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
      const res = await request(app).get('/todos')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('todos')
      expect(res.body.todos).toEqual(testDatas)
    })

    it('should return empty array when no todos', async () => {
      await db.query('DELETE FROM todos')
      expect.assertions(2)
      const res = await request(app).get('/todos')
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ todos: [] })
    })
  })

  describe('GET /todos/:id', () => {
    it('should get one todo', async () => {
      expect.assertions(2)
      const res = await request(app).get('/todos/1')
      expect(res.status).toBe(200)
      expect(res.body).toEqual(testDatas[0])
    })

    it('should respond status 204 when no todo found', async () => {
      expect.assertions(2)
      const res = await request(app).get('/todos/3')
      expect(res.status).toBe(204)
      expect(res.body).toEqual({})
    })
  })

  describe('PUT /todos/title/:id', () => {
    it('should update todo title', async () => {
      expect.assertions(3)
      const res = await request(app).put('/todos/title/1').send({ title: '810' })
      expect(res.status).toBe(200)
      expect(res.body).toEqual({})

      const res2 = await request(app).get('/todos/1')
      expect(res2.body).toEqual({ ...testDatas[0], title: '810' })
    })

    it('should respond status 400 when data insufficient', async () => {
      expect.assertions(2)
      const res = await request(app).put('/todos/title/1')
      expect(res.status).toBe(400)
      expect(res.body).toEqual({})
    })
  })

  describe('PUT /todos/done/:id', () => {
    it('should update todo done', async () => {
      expect.assertions(3)
      const res = await request(app).put('/todos/done/1').send({ done: true })
      expect(res.status).toBe(200)
      expect(res.body).toEqual({})

      const res2 = await request(app).get('/todos/1')
      expect(res2.body).toEqual({ ...testDatas[0], done: true })
    })

    it('should respond status 400 when data insufficient', async () => {
      expect.assertions(2)
      const res = await request(app).put('/todos/done/1')
      expect(res.status).toBe(400)
      expect(res.body).toEqual({})
    })
  })

  describe('POST /todos/add', () => {
    it('should add a new todo', async () => {
      expect.assertions(3)
      const res = await request(app).post('/todos/add').send({ title: '810', done: false })
      expect(res.status).toBe(200)
      // Return incremented id, which should be 3
      expect(res.body).toEqual({ id: 3 })

      const res2 = await request(app).get('/todos')
      expect(res2.body.todos).toHaveLength(3)
    })

    it('should respond status 400 when data insufficient', async () => {
      expect.assertions(2)
      const res = await request(app).post('/todos/add')
      expect(res.status).toBe(400)
      expect(res.body).toEqual({})
    })
  })

  describe('DELETE /todos/done', () => {
    it('should delete all done todos', async () => {
      expect.assertions(3)
      const res = await request(app).delete('/todos/done')
      expect(res.status).toBe(200)
      expect(res.body).toEqual({})

      const res2 = await request(app).get('/todos')
      expect(res2.body.todos).toHaveLength(1)
    })
  })

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      expect.assertions(3)
      const res = await request(app).delete('/todos/1')
      expect(res.status).toBe(200)
      expect(res.body).toEqual({})

      const res2 = await request(app).get('/todos')
      expect(res2.body.todos).toHaveLength(1)
    })
  })
})
