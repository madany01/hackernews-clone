const { ApolloServer } = require('apollo-server')
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: { prisma },
})

server.listen().then(({ url }) => {
  console.log(`⚡ Apollo listening at ${url}`)
})
