import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import typeDefs from '../src/graphQL/typeDefs.js';
import resolvers from '../src/graphQL/resolvers/index.js';
import prisma from '../prisma/client.js';
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'

dotenv.config({ path: './.env' });

const app = express();

app.use(express.json())
app.use(cookieParser());
app.options('*', cors());
app.use(cors({
    origin: 'http://localhost:5000',
    // credentials: true,
    // exposedHeaders: ['Authorization'],
}));

const validateSession = async (sessionToken) => {
    if (!sessionToken) {
        console.error('Session token not provided');
        return null;
    }

    try {
        const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            console.error('No user found for the provided token');
            return null;
        }
        return user;
    } catch (error) {
        console.error('Invalid or expired token:', error.message);
        return null;
    }
};


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
        const sessionToken = req.headers.authorization;
        const user = await validateSession(sessionToken);
        return { user, prisma, res };
    },
});

app.post('/logout', (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
    }

    try {
        Cookies.remove('sessionId');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log('Error Logout User', error)
    }
});

const startServer = async () => {
    await server.start();
    server.applyMiddleware({ app });
    app.listen(8000, () => {
        console.log(`Server running on port ${8000}`);
    });
};

startServer().catch((error) => {
    console.error('Error starting server:', error);
});
