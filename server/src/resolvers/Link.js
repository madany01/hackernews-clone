async function author(link, args, { prisma }) {
  return prisma.user.findUnique({ where: { id: link.authorId } })
}

async function votes(link, args, { prisma }) {
  return prisma.vote.findMany({ where: { linkId: link.id } })
}

const Link = {
  author,
  votes,
}

module.exports = Link
