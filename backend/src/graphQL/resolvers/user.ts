import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

interface RegisterArgs {
    email: string;
    password: string;
    username: string;
}

interface LoginArgs {
    email: string;
    password: string;
}

const userResolvers = {
    Query: {},

    Mutation: {
        register: async (
            _: unknown,
            { email, password, username }: RegisterArgs
        ): Promise<any> => {
            try {
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });

                if (existingUser) {
                    throw new Error("User already exists with this email");
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const user = await prisma.user.create({
                    data: {
                        email,
                        username,
                        password: hashedPassword,
                    },
                });

                return user;
            } catch (error: any) {
                throw new Error("Error registering user: " + error.message);
            }
        },

        login: async (
            _: unknown,
            { email, password }: LoginArgs
        ): Promise<string> => {
            try {
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
            } catch (error: any) {
                throw new Error("Error logging in: " + error.message);
            }
        },
    },
};

export { userResolvers };
