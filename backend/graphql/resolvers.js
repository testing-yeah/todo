"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
exports.resolvers = {
    Query: {
        users: async () => {
            try {
                return await prisma.user.findMany({ include: { todos: true } });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error fetching users: ${error.message}`);
                }
                throw new Error("An unknown error occurred");
            }
        },
        user: async (_, args) => {
            try {
                return await prisma.user.findUnique({
                    where: { id: parseInt(args.id) },
                    include: { todos: true },
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error fetching user: ${error.message}`);
                }
                throw new Error("An unknown error occurred");
            }
        },
        todos: async () => {
            try {
                return await prisma.todo.findMany({ include: { user: true } });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error fetching todos: ${error.message}`);
                }
                throw new Error("An unknown error occurred");
            }
        },
        todo: async (_, args) => {
            try {
                return await prisma.todo.findUnique({
                    where: { id: parseInt(args.id) },
                    include: { user: true },
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error fetching todo: ${error.message}`);
                }
                throw new Error("An unknown error occurred");
            }
        },
        getTodosByUserId: async (_, { userId }) => {
            try {
                return await prisma.todo.findMany({
                    where: { userId },
                    include: { user: true },
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error fetching todos for user: ${error.message}`);
                }
                throw new Error("An unknown error occurred");
            }
        },
    },
    Mutation: {
        createUser: async (_, args) => {
            try {
                const hashedPassword = await bcryptjs_1.default.hash(args.password, 10);
                return await prisma.user.create({
                    data: {
                        name: args.name,
                        username: args.username,
                        email: args.email,
                        password: hashedPassword,
                    },
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error creating user: ${error.message}`);
                }
                throw new Error("An unknown error occurred");
            }
        },
        createTodo: async (_, args) => {
            try {
                return await prisma.todo.create({
                    data: {
                        title: args.title,
                        description: args.description || "", // Ensure description is a string
                        userId: args.userId,
                    },
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error creating todo: ${error.message}`);
                }
                throw new Error("An unknown error occurred");
            }
        },
        updateTodo: async (_, args) => {
            try {
                return await prisma.todo.update({
                    where: { id: args.id },
                    data: {
                        title: args.title,
                        completed: args.completed,
                        description: args.description,
                        updatedAt: new Date(),
                    },
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error updating todo: ${error.message}`);
                }
                throw new Error("An unknown error occurred");
            }
        },
        deleteTodo: async (_, args) => {
            try {
                await prisma.todo.delete({ where: { id: args.id } });
                return true;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error deleting todo: ${error.message}`);
                }
                throw new Error("An unknown error occurred");
            }
        },
        login: async (_, args) => {
            try {
                const user = await prisma.user.findUnique({
                    where: { email: args.email },
                });
                if (!user) {
                    throw new Error("Invalid credentials");
                }
                const isValidPassword = await bcryptjs_1.default.compare(args.password, user.password);
                if (!isValidPassword) {
                    throw new Error("Invalid credentials");
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
                return { token, user };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error logging in: ${error.message}`);
                }
                throw new Error("An unknown error occurred");
            }
        },
        toggleTodo: async (_, args) => {
            const { id, completed } = args;
            try {
                return await prisma.todo.update({
                    where: { id },
                    data: {
                        completed,
                        updatedAt: new Date(),
                    },
                });
            }
            catch (error) {
                console.error("Error in toggleTodo resolver:", error);
                throw new Error(`Error toggling todo: ${error.message}`);
            }
        },
    },
};
