var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import typeDefs from './graphQL/typeDefs.js';
import resolvers from './graphQL/resolvers/index.js';
import prisma from './prisma/client.js';
import jwt from 'jsonwebtoken';
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
const app = express();
app.use(express.json());
app.use(cookieParser());
app.options('*', cors());
app.use(cors({
    origin: 'http://localhost:5000',
}));
const validateSession = (sessionToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!sessionToken) {
        console.error('Session token not provided');
        return null;
    }
    try {
        const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET || '');
        const user = yield prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            console.error('No user found for the provided token');
            return null;
        }
        return user;
    }
    catch (error) {
        console.error('Invalid or expired token:', error.message);
        return null;
    }
});
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers,
    context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, res }) {
        const sessionToken = req.headers.authorization;
        const user = yield validateSession(sessionToken);
        return { user, prisma, res };
    }),
});
app.post('/api/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const response = yield signUpUser({ username, email, password });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
    }
}));
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const loginResponse = yield loginUser({ email, password });
        res.status(200).json(loginResponse);
    }
    catch (error) {
        console.log(error.message);
    }
}));
app.post('/api/getuser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const loggedUser = yield getUser({ token });
        res.status(200).json(loggedUser);
    }
    catch (error) {
        console.log(error.message);
    }
}));
app.post('/api/createtodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, token } = req.body;
    try {
        const loginResponse = yield createTodo({ title, description, token });
        res.status(200).json(loginResponse);
    }
    catch (error) {
        console.log(error.message);
    }
}));
app.post('/api/deleteTodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.body;
    try {
        const response = yield deleteTodo({ id, token });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
    }
}));
app.post('/api/completetodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, completed, token } = req.body;
    try {
        const response = yield completeTodo({ id, completed, token });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
    }
}));
app.post('/api/gettododetails', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.body;
    try {
        const response = yield getTodoDetails({ id, token });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
    }
}));
app.post('/api/updatetodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, description, completed, token } = req.body;
    try {
        const response = yield editTodoFun({ id, title, description, completed, token });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
    }
}));
app.post('/api/gettodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const response = yield getTodo({ token });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
    }
}));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.start();
        server.applyMiddleware({ app });
        app.listen(8000, () => {
            console.log(`Server running on port ${8000}`);
        });
    }
    catch (error) {
        console.error('Error starting server:', error);
    }
});
startServer();
