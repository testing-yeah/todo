import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import dotenv from 'dotenv';
import { DocumentNode } from 'graphql';
import typeDefs from './graphQL/typeDefs.js';
import resolvers from './graphQL/resolvers/index.js';
import prisma from './prisma/client.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { loginUser } from './routes/loginUser.js';
import { signUpUser } from './routes/signUp.js';
import { getUser } from './routes/getUser.js';
import { createTodo } from './routes/createTodo.js';
import { deleteTodo } from './routes/deleteTodo.js';
import { completeTodo } from './routes/completeTask.js';
import { getTodoDetails } from './routes/getTodoDetails.js';
import { editTodoFun } from './routes/updateTodo.js';
import getTodo from './routes/getTodo.js';

dotenv.config({ path: './.env' });

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.options('*', cors());
app.use(
    cors({
        origin: 'http://localhost:5000',
    })
);

type DecodedToken = JwtPayload & { userId: string };

const validateSession = async (sessionToken: string | undefined) => {
    if (!sessionToken) {
        console.error('Session token not provided');
        return null;
    }

    try {
        const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET || '') as DecodedToken;
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            console.error('No user found for the provided token');
            return null;
        }
        return user;
    } catch (error) {
        console.error('Invalid or expired token:', (error as Error).message);
        return null;
    }
};

const server = new ApolloServer({
    typeDefs: typeDefs as DocumentNode,
    resolvers,
    context: async ({ req, res }: ExpressContext) => {
        const sessionToken = req.headers.authorization;
        const user = await validateSession(sessionToken);
        return { user, prisma, res };
    },
});

app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body
    try {
        const response = await signUpUser({ username, email, password })
        res.status(200).json(response);
    } catch (error: any) {
        console.log(error.message as string)
    }
})

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const loginResponse = await loginUser({ email, password });
        res.status(200).json(loginResponse);
    } catch (error: any) {
        console.log(error.message as string)
    }
})

app.post('/api/getuser', async (req, res) => {
    const { token } = req.body
    try {
        const loggedUser = await getUser({ token } as any);
        res.status(200).json(loggedUser);
    } catch (error: any) {
        console.log(error.message as string)
    }
})

interface createTodo {
    title: string,
    description: string,
    token: string
}

app.post('/api/createtodo', async (req, res) => {
    const { title, description, token } = req.body
    try {
        const loginResponse = await createTodo({ title, description, token } as createTodo)
        res.status(200).json(loginResponse);
    } catch (error: any) {
        console.log(error.message as string)
    }
})

app.post('/api/deleteTodo', async (req, res) => {
    const { id, token } = req.body
    try {
        const response = await deleteTodo({ id, token })
        res.status(200).json(response);
    } catch (error: any) {
        console.log(error.message as string)
    }
})

app.post('/api/completetodo', async (req, res) => {
    const { id, completed, token } = req.body
    try {
        const response = await completeTodo({ id, completed, token })
        res.status(200).json(response);
    } catch (error: any) {
        console.log(error.message as string)
    }
})

app.post('/api/gettododetails', async (req, res) => {
    const { id, token } = req.body
    try {
        const response = await getTodoDetails({ id, token })
        res.status(200).json(response);
    } catch (error: any) {
        console.log(error.message as string)
    }
})

app.post('/api/updatetodo', async (req, res) => {
    const { id, title, description, completed, token } = req.body
    try {
        const response = await editTodoFun({ id, title, description, completed, token })
        res.status(200).json(response);
    } catch (error: any) {
        console.log(error.message as string)
    }
})

app.post('/api/gettodo', async (req, res) => {
    const { token } = req.body
    try {
        const response = await getTodo({ token })
        res.status(200).json(response);
    } catch (error: any) {
        console.log(error.message as string)
    }
})

const startServer = async () => {
    try {
        await server.start();
        server.applyMiddleware({ app } as any);
        app.listen(8000, () => {
            console.log(`Server running on port ${8000}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();