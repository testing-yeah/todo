import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export default {
    Query: {
        users: async (_, __, { prisma }) => prisma.user.findMany({
            include: { todos: true },
        }),

        user: async (_, __, { user, prisma }) => {
            if (!user) {
                throw new Error('User is not authenticated');
            }

            return prisma.user.findUnique({
                where: { id: user.id },
                include: { todos: true },
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
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) throw new Error('User not found');

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) throw new Error('Invalid password');

            const token = jwt.sign({ userId: user.id, }, process.env.JWT_SECRET, { expiresIn: "1h" })

            return { user, token };
        },
    },

    User: {
        todos: (parent, _, { prisma }) => prisma.todo.findMany({ where: { userId: parent.id } }),
    },
};
