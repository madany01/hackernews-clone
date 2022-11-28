function info() {
  return 'This is the API of a Hackernews Clone'
}

async function feed(root, args, { prisma }) {
  return prisma.link.findMany()
}

const Query = {
  info,
  feed,
}

module.exports = Query
