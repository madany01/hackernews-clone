const http = require('http')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer,
} = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { PubSub } = require('graphql-subscriptions')

const { PrismaClient } = require('@prisma/client')

const { getJwtPayload } = require('./utils')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const prisma = new PrismaClient()
const pubsub = new PubSub()

function createContext({ req }) {
  const ctx = {
    userId: null,
    prisma,
    pubsub,
  }

  const payload = getJwtPayload(req?.headers?.authorization)

  if (payload) ctx.userId = payload.userId

  return ctx
}

function createWSContext(connCtx) {
  const ctx = {
    userId: null,
    prisma,
    pubsub,
  }

  const authHeader = connCtx.connectionParams?.Authorization || ''

  const payload = getJwtPayload(authHeader)

  if (payload) ctx.userId = payload.userId

  return ctx
}

async function start() {
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const serverCleanup = useServer(
    {
      schema,
      context: createWSContext,
    },
    wsServer
  )

  const apolloServer = new ApolloServer({
    schema,
    context: createContext,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        serverWillStart: async () => {
          console.log('serverWillStart')
          return {
            drainServer: async () => {
              console.log('drainServer')
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    path: '/',
  })

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`⚡ Server is now running on http://localhost:${PORT}`)
  )
}

;(() => {
  start()
})()
