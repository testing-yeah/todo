import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

export default {
    Query: {
        users: async (_, __, { prisma }) => prisma.user.findMany({
            include: { todos: true, tokens: true },
        }),

        user: async (_, __, { user, prisma }) => {
            if (!user) {
                throw new Error('User is not authenticated');
            }

            return prisma.user.findUnique({
                where: { id: user.id },
                include: { todos: true, tokens: true },
            });
        },

        getUserProfile: async (_, __, { user, prisma }) => {
            // console.log("use", user)
            if (!user) {
                throw new Error("Unauthorized: Please log in.");
            }

            const userProfile = await prisma.user.findUnique({
                where: { id: user.id },
            });

            // console.log('User Profile:', user); // Log the data to see the structure
            return userProfile;
        },

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

        loginUser: async (_, { email, password }, { res, prisma }) => {
            if (!res) {
                alert('Res Not foUND')
            }
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) throw new Error('User not found');

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) throw new Error('Invalid password');

            const sessionToken = uuidV4();
            // const sessionExpiry = new Date(Date.now() + 10 * 1000);
            const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            // res.setHeader('Set-Cookie', `sessionId=${sessionToken}; HttpOnly; Path=/; SameSite=Lax`);
            // context.res.cookie("sessionId", sessionToken, {
            //     httpOnly: true,
            //     secure: true,
            //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            // });

            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { sessionToken, expiresAt: sessionExpiry },
            });

            return { user: updatedUser, sessionToken };
        },
    },

    User: {
        todos: (parent, _, { prisma }) => prisma.todo.findMany({ where: { userId: parent.id } }),
        tokens: (parent, _, { prisma }) => prisma.token.findMany({ where: { userId: parent.id } }),
    },
};
