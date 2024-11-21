import { ApolloServer } from 'apollo-server';
import typeDefs from './graphQL/typeDefs.js';
import resolvers from './graphQL/resolvers/index.js';
import prisma from '../prisma/client.js';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ prisma }), // Pass Prisma Client to resolvers
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
