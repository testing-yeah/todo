import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User as PrismaUser, Todo } from '@prisma/client';

interface Context {
    user: PrismaUser | null;
    prisma: PrismaClient;
    res: any;
}

interface CreateUserInput {
    username: string;
    email: string;
    password: string;
}

interface LoginUserInput {
    email: string;
    password: string;
}

export default {
    Query: {
        user: async (
            _: unknown,
            __: unknown,
            { user, prisma }: Context
        ): Promise<PrismaUser | null> => {
            if (!user) {
                throw new Error('User is not authenticated');
            }

            return prisma.user.findUnique({
                where: { id: user.id },
                include: { todos: true },
            });
        },

        getUserProfile: async (
            _: unknown,
            __: unknown,
            { user, prisma }: Context
        ): Promise<PrismaUser | null> => {
            if (!user) {
                throw new Error('Unauthorized: Please log in.');
            }

            return prisma.user.findUnique({
                where: { id: user.id },
            });
        },
    },

    Mutation: {
        createUser: async (
            _: unknown,
            { username, email, password }: CreateUserInput,
            { prisma }: Context
        ): Promise<PrismaUser> => {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            return newUser;
        },

        loginUser: async (
            _: unknown,
            { email, password }: LoginUserInput,
            { res, prisma }: Context
        ): Promise<{ user: PrismaUser; token: string }> => {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) throw new Error('User not found');

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) throw new Error('Invalid password');

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );

            return { user, token };
        },
    },

    User: {
        todos: async (
            parent: PrismaUser,
            _: unknown,
            { prisma }: Context
        ): Promise<Todo[]> => {
            return prisma.todo.findMany({ where: { userId: parent.id } });
        },
    },
};
