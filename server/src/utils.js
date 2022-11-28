const conf = require('../conf')
// eslint-disable-next-line import/order
const jwt = require('jsonwebtoken')

function getJwtPayload(req) {
  const authHeader = req?.headers?.authorization

  if (!authHeader) return null

  const [type, token] = authHeader.split(' ')

  if (!type || !token) return null

  if (type.toLowerCase() !== 'bearer') return null

  let payload = null

  try {
    payload = jwt.verify(token, conf.JWT_SECRET_KEY)
  } catch {
    return null
  }

  return payload
}

module.exports = {
  getJwtPayload,
}
