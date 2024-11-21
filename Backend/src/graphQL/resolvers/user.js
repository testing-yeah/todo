import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default {
    Query: {
        users: async (_, __, { prisma }) => prisma.user.findMany({
            include: { todos: true, tokens: true },
        }),

        user: async (_, { id }, { prisma }) => prisma.user.findUnique({
            where: { id },
            include: { todos: true, tokens: true },
        }),

        // loginUser: async (_, { email, password }, { prisma }) => {
        //     const user = await prisma.user.findUnique({
        //         where: {
        //             email: email,
        //         },
        //     });

        //     if (!user) {
        //         throw new Error('User not found');
        //     }

        //     const isPasswordValid = await bcrypt.compare(password, user.password);

        //     if (!isPasswordValid) {
        //         throw new Error('Invalid password');
        //     }

        //     const token = jwt.sign(
        //         { userId: user.id },
        //         process.env.JWT_SECRET,
        //         { expiresIn: '1h' }
        //     );

        //     return {
        //         user,
        //         token,
        //     };
        // },
    },

    Mutation: {
        createUser: async (_, { username, email, password }, { prisma }) => {
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

        loginUser: async (_, { email, password }, { prisma }) => {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) throw new Error('User not found');

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) throw new Error('Invalid password');

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return { token, user };
        },
    },

    User: {
        todos: (parent, _, { prisma }) => prisma.todo.findMany({ where: { userId: parent.id } }),
        tokens: (parent, _, { prisma }) => prisma.token.findMany({ where: { userId: parent.id } }),
    },
};
