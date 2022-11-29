const conf = require('../conf')
// eslint-disable-next-line import/order
const jwt = require('jsonwebtoken')

function getJwtPayload(authHeader) {
  if (!authHeader) return null

  const [type, token] = String(authHeader).split(' ')

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
