const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const link = await prisma.link.create({
    data: {
      url: 'www.howtographql.com',
      description: 'Fullstack tutorial for GraphQL',
    },
  })
  console.log(link)
  const links = await prisma.link.findMany({})
  console.log(links)
}

;(async () => {
  await main()
  await prisma.$disconnect()
})()
