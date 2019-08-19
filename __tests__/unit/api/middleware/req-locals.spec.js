import reqLocals from '~/api/middleware/req-locals.js'

describe('API Middleware ReqLocals', () => {
  it('should set req locals and next', () => {
    const req = {}
    const next = jest.fn()
    reqLocals(req, null, next)
    expect(req.locals).toBeTruthy()
    expect(next).toBeCalled()
  })
})
