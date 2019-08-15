import auth from '../auth'

export default async (req, res, next) => {
  const token = req.header('Authorization')

  if (token) {
    await auth.verifyJwt(token)
      .then((dec) => {
        req.locals.authed = true
        req.locals.userId = dec.userId
        next()
      })
      .catch((e) => {
        req.locals.authed = false
        res.status(401).send(e)
      })
  } else {
    req.locals.authed = false
    res.status(401).send(new Error('No token supplied'))
  }
}
