async function links(user, args, { prisma }) {
  return prisma.link.findMany({ where: { authorId: user.id } })
}

const User = {
  links,
}

module.exports = User
