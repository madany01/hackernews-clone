function user(vote, args, { prisma }) {
  return prisma.user.findUnique({ where: { id: vote.userId } })
}

function link(vote, args, { prisma }) {
  return prisma.link.findUnique({ where: { id: vote.linkId } })
}

const Vote = {
  user,
  link,
}

module.exports = Vote
