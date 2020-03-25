import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { clientState, migrateState } from 'common/state'
export const apolloClient: ApolloClient<InMemoryCache> = new ApolloClient({
  clientState,
})
apolloClient.defaultOptions = {
  ...apolloClient.defaultOptions,
  watchQuery: {
    returnPartialData: true
  }
}

export { migrateState }