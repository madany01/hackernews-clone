const { GraphQLError } = require('graphql')

function authenticated(userId) {
  const error = new GraphQLError('Invalid Credentials', {
    extensions: {
      code: 'UNAUTHENTICATED',
      http: { status: 401 },
    },
  })

  if (!userId) throw error
}

const checks = {
  authenticated,
}

module.exports = checks
