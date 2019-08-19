import auth from '~/api/auth'
import authCheck from '~/api/middleware/auth-check.js'

jest.mock('~/api/auth')

describe('API Middleware AuthCheck', () => {
  let req
  let res
  let next

  beforeEach(() => {
    req = {
      header: jest.fn(),
      locals: {}
    }
    res = {
      status: jest.fn(() => res),
      send: jest.fn()
    }
    next = jest.fn()
  })

  it('should verify jwt and next given correct credentials', async () => {
    req.header.mockReturnValue('correctToken')
    auth.verifyJwt.mockResolvedValue({})
    await authCheck(req, res, next)
    expect(auth.verifyJwt).toBeCalled()
    expect(next).toBeCalled()
  })

  it('should fail verify jwt given wrong credentials', async () => {
    req.header.mockReturnValue('wrongToken')
    auth.verifyJwt.mockRejectedValue(new Error())
    await authCheck(req, res, next)
    expect(auth.verifyJwt).toBeCalled()
    expect(res.status).toBeCalled()
  })

  it('should block route when data insufficient', async () => {
    await authCheck(req, res, next)
    expect(res.status).toBeCalled()
  })
})
