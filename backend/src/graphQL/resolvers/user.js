import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma/client.js";

const resolvers = {
    Query: {
        getTodos: async () => {
            return prisma.todo.findMany();
        },
        getAllUsers: async () => {
            return prisma.user.findMany();
        },
        getUser: async (_, { id }) => {
            return prisma.user.findUnique({
                where: {
                    id,
                },
            });
        },
    },

    Mutation: {
        register: async (_, { email, password, username }, { prisma }) => {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword,
                },
            });

            return user;
        },

        login: async (_, { email, password }) => {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) throw new Error("User not found");

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) throw new Error("Invalid password");

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            return token;
        },

        logout: async () => {
            return true;
        },
    },
};

export { resolvers };
