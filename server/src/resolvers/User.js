async function links(user, args, { prisma }) {
  return prisma.link.findMany({ where: { authorId: user.id } })
}

async function votes(user, args, { prisma }) {
  return prisma.vote.findMany({ where: { userId: user.id } })
}

const User = {
  links,
  votes,
}

module.exports = User
