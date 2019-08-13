import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  const token = req.header('Authorization')

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.locals.authed = true
      req.locals.userId = decoded.userId
      next()
    } catch (e) {
      res.status(401).send(e)
      req.locals.authed = false
    }
  } else {
    res.status(401).send(new Error('No token supplied'))
    req.locals.authed = false
  }
}
