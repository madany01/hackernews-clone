async function author(link, args, { prisma }) {
  return prisma.user.findUnique({ where: { id: link.authorId } })
}

const Link = {
  author,
}

module.exports = Link
