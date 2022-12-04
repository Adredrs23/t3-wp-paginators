import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: 'http://wproot.local/graphql',
  cache: new InMemoryCache(),
})
