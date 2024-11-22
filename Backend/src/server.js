import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import typeDefs from '../src/graphQL/typeDefs.js';
import resolvers from '../src/graphQL/resolvers/index.js';
import prisma from '../prisma/client.js';
import checkSession from '../middleware/middleware.js';
import Cookies from 'js-cookie'

dotenv.config({ path: './.env' });

const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.options('*', cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

const validateSession = async (sessionToken) => {
    if (!sessionToken) return null;
    const user = await prisma.user.findUnique({ where: { sessionToken } });
    if (!user || !user.expiresAt || new Date(user.expiresAt) < new Date()) return null;
    return user;
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const sessionToken = req.cookies.sessionId;
        const user = await validateSession(sessionToken);
        return { user, prisma };
    },
});

app.get('/api/check-session', async (req, res) => {
    const sessionToken = req.cookies.sessionId;
    const user = await validateSession(sessionToken);
    if (!user) return res.status(401).json({ message: 'Session expired or invalid' });
    return res.status(200).json({ message: 'Session valid', user });
});

const startServer = async () => {
    await server.start();
    server.applyMiddleware({ app });
    app.listen(5000, () => {
        console.log(`Server running on port ${5000}`);
    });
};

startServer().catch((error) => {
    console.error('Error starting server:', error);
});

fetch('http://localhost:5000/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cookies.get('sessionId'),
    },
    credentials: 'include',
    body: JSON.stringify({
        query: `mutation createTodo($title: String!, $description: String!) {
        createTodo(title: $title, description: $description) {
          id
          title
          description
        }
      }`,
        variables: {
            title: 'Test Todo',
            description: 'This is a test description',
        },
    }),
})
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
