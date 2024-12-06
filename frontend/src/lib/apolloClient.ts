import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql'
  }),
  cache: new InMemoryCache(),
  headers: {
    'Content-Type': 'application/json',
  }
});

export default client;








