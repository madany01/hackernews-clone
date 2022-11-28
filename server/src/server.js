const { ApolloServer } = require('apollo-server')
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const { getJwtPayload } = require('./utils')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

function createContext({ req }) {
  const ctx = { userId: null, prisma }
  const payload = getJwtPayload(req)

  if (payload) ctx.userId = payload.userId

  return ctx
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: createContext,
})

server.listen().then(({ url }) => {
  console.log(`⚡ Apollo listening at ${url}`)
})
