import request from 'supertest'
import app from '~/api/index.js'
import db from '~/api/db/index.js'

// Note:
// Axios response data is at res.data
// Supertest response data is at res.body

describe('API Todos', () => {
  const testDatas = [
    {
      uid: 1,
      title: 'Todo 1',
      done: false
    },
    {
      uid: 2,
      title: 'Todo 2',
      done: true
    }
  ]

  beforeAll(async () => {
    await db.queryNative(
      `CREATE TABLE todos
      (
        uid SERIAL PRIMARY KEY,
        title character varying(256) NOT NULL,
        done boolean NOT NULL
      )`
    )
  })

  beforeEach(async () => {
    for (const data of testDatas) {
      await db.queryNative('INSERT INTO todos (title, done) VALUES ($1, $2)', [data.title, data.done])
    }
  })

  afterEach(async () => {
    await db.queryNative('DELETE FROM todos')
    // Restart uid auto-incremnet sequence to start from 1 again
    await db.queryNative('ALTER SEQUENCE todos_uid_seq RESTART WITH 1')
  })

  afterAll(async () => {
    await db.queryNative('DROP TABLE todos')
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

    it('should return nothing when no todos', async () => {
      await db.queryNative('DELETE FROM todos')
      expect.assertions(2)
      const res = await request(app).get('/todos')
      expect(res.status).toBe(204)
      expect(res.body).toEqual({})
    })
  })

  describe('GET /todos/:uid', () => {
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

  describe('PUT /todos/title/:uid', () => {
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

  describe('PUT /todos/done/:uid', () => {
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
      // Return incremented uid, which should be 3
      expect(res.body).toEqual({ uid: 3 })

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

  describe('DELETE /todos/:uid', () => {
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
