import request from 'supertest'
import app from '~/api'

describe('API Index', () => {
  it('should respond status 404 if not route match', async () => {
    expect.assertions(1)
    const req = await request(app).post('/doesnotexist')
    expect(req.status).toBe(404)
  })
})
