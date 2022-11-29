const pubsubMsgs = require('../pubsubMsgs')

function linkAddedSubscribe(parent, args, { pubsub }) {
  return pubsub.asyncIterator(pubsubMsgs.LINK_ADDED)
}

const linkAdded = {
  subscribe: linkAddedSubscribe,
  resolve: payload => payload,
}

const Subscription = {
  linkAdded,
  voteAdded: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator(pubsubMsgs.VOTE_ADDED),
    resolve: payload => payload,
  },
}

module.exports = Subscription
