// eslint-disable-next-line import/order
const conf = require('../../conf')

const bcrypt = require('bcryptjs')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const checks = require('../checks')

async function signup(root, { email, password, name }, { prisma }) {
  const hashedPassword = await bcrypt.hash(password, conf.PASSWORD_HASH_ROUNDS)
  return prisma.user.create({ data: { email, password: hashedPassword, name } })
}

async function login(root, { email, password }, { prisma }) {
  const error = new GraphQLError('Invalid Credentials', {
    extensions: {
      code: 'UNAUTHENTICATED',
      http: { status: 401 },
    },
  })

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) throw error

  const correctPassword = await bcrypt.compare(password, user.password)

  if (!correctPassword) throw error

  const payload = { userId: user.id }

  const token = jwt.sign(payload, conf.JWT_SECRET_KEY)

  return token
}

async function post(root, { url, description }, { prisma, userId }) {
  checks.authenticated(userId)

  return prisma.link.create({ data: { url, description, authorId: userId } })
}

const Mutation = {
  signup,
  login,
  post,
}

module.exports = Mutation
