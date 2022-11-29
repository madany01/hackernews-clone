// eslint-disable-next-line import/order
const conf = require('../../conf')

const bcrypt = require('bcryptjs')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const checks = require('../checks')
const pubsubMsgs = require('../pubsubMsgs')

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

async function post(root, { url, description }, { prisma, userId, pubsub }) {
  checks.authenticated(userId)

  const link = await prisma.link.create({
    data: { url, description, authorId: userId },
  })

  pubsub.publish(pubsubMsgs.LINK_ADDED, link)

  return link
}

async function vote(root, { linkId: ID }, { userId, prisma, pubsub }) {
  checks.authenticated(userId)

  const linkId = parseInt(ID, 10)
  // eslint-disable-next-line no-shadow
  let vote = null

  try {
    vote = await prisma.vote.create({ data: { linkId, userId } })
  } catch (e) {
    if (e.code !== 'P2002') throw e

    throw new GraphQLError("you've already voted on this link", {
      extensions: {
        code: 'Conflict',
        http: { status: 409 },
      },
    })
  }

  pubsub.publish(pubsubMsgs.VOTE_ADDED, vote)

  return vote
}

const Mutation = {
  signup,
  login,
  post,
  vote,
}

module.exports = Mutation
