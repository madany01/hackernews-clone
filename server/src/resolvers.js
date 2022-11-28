const resolvers = {
  Query: {
    info: () => 'This is the API of a Hackernews Clone',
    feed: async (root, args, { prisma }) => prisma.link.findMany(),
  },

  Mutation: {
    post: async (root, { url, description }, { prisma }) => {
      const link = await prisma.link.create({ data: { url, description } })
      return link
    },
  },
}

module.exports = resolvers
