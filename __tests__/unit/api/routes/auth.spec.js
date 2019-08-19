import request from 'supertest'
import app from '~/api'
import auth from '~/api/auth'
import db from '~/api/db'

jest.setTimeout(10000)
jest.mock('~/api/auth')

describe('API Route Auth', () => {
  const userData = {
    name: 'Bob',
    email: 'test@example.com',
    password: 'correcthorsebatterystapler'
  }

  const addUser = async () => {
    const salt = 'bf'
    await db.query('INSERT INTO users (name, email, hash) VALUES ($1, $2, crypt($3, gen_salt($4)))', [userData.name, userData.email, userData.password, salt])
  }

  beforeAll(async () => {
    // Auth uses pgcrypto for hashing
    await db.query('CREATE EXTENSION pgcrypto')
    await db.query(
      `CREATE TABLE users
      (
        id serial PRIMARY KEY,
        name text NOT NULL,
        email text NOT NULL,
        hash text NOT NULL
      )`
    )
  })

  afterEach(async () => {
    await db.query('DELETE FROM users')
    // Restart id auto-incremnet sequence to start from 1 again
    await db.query('ALTER SEQUENCE users_id_seq RESTART WITH 1')
  })

  afterAll(async () => {
    await db.query('DROP EXTENSION pgcrypto')
    await db.query('DROP TABLE users')
    await db.end()
  })

  describe('POST /signup', () => {
    it('should signup a user given correct credentials', async () => {
      expect.assertions(3)
      auth.signJwt.mockResolvedValue('correctToken')
      const res = await request(app).post('/auth/signup').send(userData)
      expect(res.status).toBe(200)
      expect(res.body.payload).toHaveProperty('userId', 1)
      expect(res.body.token).toBeTruthy()
    })

    it('should not signup user if user is already registered', async () => {
      expect.assertions(1)
      await addUser()
      const res = await request(app).post('/auth/signup').send(userData)
      expect(res.status).toBe(401)
    })

    it('should respond status 400 when data insufficient', async () => {
      expect.assertions(1)
      const res = await request(app).post('/auth/signup')
      expect(res.status).toBe(400)
    })
  })

  describe('POST /login', () => {
    it('should login a user given correct credentials', async () => {
      expect.assertions(3)
      auth.signJwt.mockResolvedValue('correctToken')
      await addUser()
      const res = await request(app).post('/auth/login').send(userData)
      expect(res.status).toBe(200)
      expect(res.body.payload).toHaveProperty('userId', 1)
      expect(res.body.token).toBeTruthy()
    })

    it('should not login a user given wrong credentials', async () => {
      expect.assertions(1)
      await addUser()
      const res = await request(app).post('/auth/login').send({ ...userData, password: 'wrongPassword' })
      expect(res.status).toBe(401)
    })

    it('should respond status 400 when data insufficient', async () => {
      expect.assertions(1)
      const res = await request(app).post('/auth/login')
      expect(res.status).toBe(400)
    })
  })

  describe('POST /check', () => {
    it('should login and check a user given correct credentials', async () => {
      expect.assertions(2)
      auth.verifyJwt.mockResolvedValue({ userId: 1 })
      const res2 = await request(app).post('/auth/check').send({ token: 'correctToken' })
      expect(res2.status).toBe(200)
      expect(res2.body).toHaveProperty('userId', 1)
    })

    it('should login and check error a user given wrong credentials', async () => {
      expect.assertions(1)
      auth.verifyJwt.mockRejectedValue(new Error())
      const res = await request(app).post('/auth/check').send({ token: 'wrongToken' })
      expect(res.status).toBe(401)
    })

    it('should respond status 400 when data insufficient', async () => {
      expect.assertions(1)
      const res = await request(app).post('/auth/check')
      expect(res.status).toBe(400)
    })
  })

  describe('POST /forgot', () => {
    it('should return preview given correct credentials', async () => {
      expect.assertions(2)
      await addUser()
      const res = await request(app).post('/auth/forgot').send(userData)
      expect(res.status).toBe(200)
      expect(res.body.preview).toBeTruthy()
    })

    it('should unauthorize given wrong credentials', async () => {
      expect.assertions(1)
      const res = await request(app).post('/auth/forgot').send({ email: 'wrongEmail' })
      expect(res.status).toBe(401)
    })

    it('should respond status 400 when data insufficient', async () => {
      expect.assertions(1)
      const res = await request(app).post('/auth/forgot')
      expect(res.status).toBe(400)
    })
  })

  describe('POST /reset', () => {
    it('should reset password given correct credentials', async () => {
      expect.assertions(1)
      auth.verifyJwt.mockResolvedValue({ email: 'correctEmail' })
      const res = await request(app).post('/auth/reset').send({
        token: 'correctToken',
        password: '810'
      })
      expect(res.status).toBe(200)
    })

    it('should not reset password given wrong credentials', async () => {
      expect.assertions(1)
      auth.verifyJwt.mockRejectedValue(new Error())
      const res = await request(app).post('/auth/reset').send({
        token: 'wrongToken',
        password: '810'
      })
      expect(res.status).toBe(401)
    })

    it('should respond status 400 when data insufficient', async () => {
      expect.assertions(1)
      const res = await request(app).post('/auth/reset')
      expect(res.status).toBe(400)
    })
  })
})
