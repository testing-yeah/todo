
import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../src/graphQL/typeDefs.js'
import resolvers from '../src/graphQL/resolvers/index.js'
import prisma from '../prisma/client.js';

dotenv.config({ path: './.env' })

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
        prisma,
    }),
});

const app = express()

const startServer = async () => {

    await server.start()

    server.applyMiddleware({ app });

    app.listen(process.env.PORT, () => {
        console.log("Server Running" + " " + process.env.PORT)
    })
}

startServer().catch((error) => {
    console.error("Error starting server:", error);
})