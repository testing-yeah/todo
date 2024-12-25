// import bcrypt from 'bcrypt';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../../utils/tokenUtils';
const prisma = new PrismaClient()

interface LoginUserData {
    username: string;
    email: string;
    password: string;
}
interface CreateUserData {
    first_name: string,
    last_name: string,
    username: string;
    email: string;
    password: string;
}
export default {
    Query: {
    },
    Mutation: {
        GetUser: async (
            _: unknown,
            { user_id }: { user_id: string },
        ): Promise<PrismaUser> => {
            const userData = await prisma.user.findFirst({
                where: { user_id },
            });
            if (!userData) {
                throw new Error('Unauthorized: Please log in.');
            }
            return userData
        },
        createUser: async (
            _: unknown,
            { first_name, last_name, username, email, password }: CreateUserData
        ): Promise<{ userData: PrismaUser; refreshToken: string; accessToken: string }> => {
            try {
                const checkUserThrewEmail = await prisma.user.findFirst({
                    where: { email }
                });
                if (checkUserThrewEmail) {
                    throw new Error('email is already taken');
                }

                const checkUserThrewUsername = await prisma.user.findFirst({
                    where: { username }
                });
                if (checkUserThrewUsername) {
                    throw new Error('Username is already taken');
                }
                var salt = bcrypt.genSaltSync(10);
                const encrypted_password = await bcrypt.hash(password, salt);
                const newUser = await prisma.user.create({
                    data: {
                        first_name,
                        last_name,
                        username,
                        email,
                        password: encrypted_password,
                    },
                });

                const refreshToken = generateRefreshToken(newUser.user_id)
                const accessToken = generateAccessToken(newUser.user_id)

                await prisma.user.update({
                    where: { email },
                    data: {
                        refreshToken
                    },
                });
                return { userData: newUser, refreshToken: refreshToken, accessToken: accessToken };
            } catch (error) {
                console.error('Error creating user:', error);
                throw new Error('Failed to create user');
            }
        },

        loginUser: async (
            _: unknown,
            { username, email, password }: LoginUserData
        ): Promise<{ userData: PrismaUser; accessToken: string; refreshToken: string }> => {
            try {
                const userData = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { username },
                            { email }
                        ]
                    }
                });
                if (!userData) throw new Error('User not found');
                const isPasswordValid = await bcrypt.compare(password, userData.password as string);
                if (!isPasswordValid) throw new Error('Invalid password');
                const refreshToken = generateRefreshToken(userData.user_id)
                const accessToken = generateAccessToken(userData.user_id)
                await prisma.user.update({
                    where: { user_id: userData.user_id },
                    data: {
                        refreshToken
                    },
                });
                return { userData, refreshToken, accessToken };

            } catch (error) {
                console.error('Login failed:', error);
                throw new Error('Failed to log in');
            }
        },
    },
}
