const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const u = await prisma.user.findFirst()
  const l1 = await prisma.link.create({
    data: { url: 'gql', description: '', authorId: u.id },
  })
  const l2 = await prisma.link.create({
    data: { url: '', description: 'gql', authorId: u.id },
  })

  try {
    const res = await prisma.link.findMany({
      orderBy: [{ description: 'desc' }, { createdAt: 'asc' }],
    })
    console.log(typeof res)
    console.log(res)
  } catch (e) {
    await prisma.link.deleteMany({ where: { id: { in: [l1.id, l2.id] } } })
    throw e
  }

  await prisma.link.deleteMany({ where: { id: { in: [l1.id, l2.id] } } })
  // await prisma.user.deleteMany({ where: { id: { in: [u.id] } } })
}

;(async () => {
  await main()
  await prisma.$disconnect()
})()
