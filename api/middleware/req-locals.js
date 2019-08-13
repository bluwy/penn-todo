// Creates req.locals
export default (req, res, next) => {
  req.locals = {}
  next()
}
