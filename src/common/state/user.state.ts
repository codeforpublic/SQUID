import { gql } from 'apollo-boost'

export const apolloState = {
  initialState: {
    user: {
      image: '',
      __typename: 'User',
    },
  },
  Mutation: {
    updateUser(_, { data }, { cache }) {
      const { user } = cache.readQuery({
        query: gql`
          query {
            user @client {
              image
              __typename
            }
          }
        `,
      })
      cache.writeData({
        data: {
          user: {
            ...user,
            ...data,
          },
        },
      })
    },
  },
}
