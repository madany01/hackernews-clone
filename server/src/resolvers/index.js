const Query = require('./Query')
const Mutation = require('./Mutation')
const Subscription = require('./Subscription')
const Token = require('./Token')
const User = require('./User')
const Link = require('./Link')
const Vote = require('./Vote')

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Token,
  User,
  Link,
  Vote,
}

module.exports = resolvers
