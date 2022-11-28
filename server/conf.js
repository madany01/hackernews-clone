const { JWT_SECRET_KEY = 'secret' } = process.env

const { PASSWORD_HASH_ROUNDS = 10 } = process.env

const conf = {
  JWT_SECRET_KEY,
  PASSWORD_HASH_ROUNDS,
}

module.exports = conf
