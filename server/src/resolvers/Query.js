function info() {
  return 'This is the API of a Hackernews Clone'
}

async function feed(root, { filter, skip, take, sort }, { prisma }) {
  const where = !filter
    ? {}
    : {
        OR: [
          { url: { contains: filter } },
          { description: { contains: filter } },
        ],
      }
  const orderBy = !sort
    ? undefined
    : Object.entries(sort)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([f, v]) => ({ [f]: v }))

  const links = await prisma.link.findMany({
    where,
    skip: skip ?? undefined,
    take: take ?? undefined,
    orderBy,
  })

  const count = links.length

  return { links, count }
}

const Query = {
  info,
  feed,
}

module.exports = Query
