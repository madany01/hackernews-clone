const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const conf = require('../conf')

const prisma = new PrismaClient()

const users = [
  { email: 'ahmad@email.test', password: 'ahmad.secret', name: 'ahmad' },
  { email: 'robin@email.test', password: 'robin.secret', name: 'robin' },
  { email: 'alex@email.test', password: 'alex.secret', name: 'alex' },
  { email: 'alice@email.test', password: 'alice.secret', name: 'alice' },
]

const links = [
  {
    url: 'https://theodinproject.com/',
    description: 'odin',
    authorName: 'ahmad',
  },
  {
    url: 'https://www.howtographql.com/',
    description: 'Learn graphql',
    authorName: 'robin',
  },
  {
    url: 'https://fullstackopen.com/en/',
    description: 'fullstackopen',
    authorName: 'alex',
  },
  {
    url: 'https://youtube.com/',
    description: 'youtube',
    authorName: 'alex',
  },
]

const votes = [
  ['ahmad', 1],
  ['ahmad', 2],
  ['ahmad', 3],

  ['robin', 0],

  ['alex', 0],
]

async function main() {
  await prisma.vote.deleteMany()
  await prisma.link.deleteMany()
  await prisma.user.deleteMany()

  const hashedPasswords = await Promise.all(
    users.map(u => bcrypt.hash(u.password, conf.PASSWORD_HASH_ROUNDS))
  )

  const dbUsers = await Promise.all(
    users.map((u, idx) =>
      prisma.user.create({ data: { ...u, password: hashedPasswords[idx] } })
    )
  )

  const userByName = dbUsers.reduce((acc, user) => {
    acc[user.name] = user
    return acc
  }, {})

  const dbLinks = await Promise.all(
    links
      .map(l => {
        const { authorName, ...rest } = l
        return { ...rest, authorId: userByName[authorName].id }
      })
      .map(l =>
        prisma.link.create({
          data: l,
        })
      )
  )

  const dbVotes = await Promise.all(
    votes
      .map(([userName, linkIdx]) => ({
        userId: userByName[userName].id,
        linkId: dbLinks[linkIdx].id,
      }))
      .map(v => prisma.vote.create({ data: v }))
  )

  console.log(dbUsers)
  console.log(dbLinks)
  console.log(dbVotes)
}

;(async () => {
  main()
})()
