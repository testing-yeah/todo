import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma/client.js";

const userResolvers = {
    Query: {
        // hello world
    },

    Mutation: {
        register: async (_, { email, password, username }) => {
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

            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined in environment variables");
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            return token;
        },

        logout: async (_, __) => {
            return true;
        },
    },
};

export { userResolvers };
