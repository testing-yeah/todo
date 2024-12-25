"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import bcrypt from 'bcrypt';
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const tokenUtils_1 = require("../../utils/tokenUtils");
const prisma = new client_1.PrismaClient();
exports.default = {
    Query: {},
    Mutation: {
        GetUser: async (_, { user_id }) => {
            const userData = await prisma.user.findFirst({
                where: { user_id },
            });
            if (!userData) {
                throw new Error('Unauthorized: Please log in.');
            }
            return userData;
        },
        createUser: async (_, { first_name, last_name, username, email, password }) => {
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
                var salt = bcrypt_1.default.genSaltSync(10);
                const encrypted_password = await bcrypt_1.default.hash(password, salt);
                const newUser = await prisma.user.create({
                    data: {
                        first_name,
                        last_name,
                        username,
                        email,
                        password: encrypted_password,
                    },
                });
                const refreshToken = (0, tokenUtils_1.generateRefreshToken)(newUser.user_id);
                const accessToken = (0, tokenUtils_1.generateAccessToken)(newUser.user_id);
                await prisma.user.update({
                    where: { email },
                    data: {
                        refreshToken
                    },
                });
                return { userData: newUser, refreshToken: refreshToken, accessToken: accessToken };
            }
            catch (error) {
                console.error('Error creating user:', error);
                throw new Error('Failed to create user');
            }
        },
        loginUser: async (_, { username, email, password }) => {
            try {
                const userData = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { username },
                            { email }
                        ]
                    }
                });
                if (!userData)
                    throw new Error('User not found');
                const isPasswordValid = await bcrypt_1.default.compare(password, userData.password);
                if (!isPasswordValid)
                    throw new Error('Invalid password');
                const refreshToken = (0, tokenUtils_1.generateRefreshToken)(userData.user_id);
                const accessToken = (0, tokenUtils_1.generateAccessToken)(userData.user_id);
                await prisma.user.update({
                    where: { user_id: userData.user_id },
                    data: {
                        refreshToken
                    },
                });
                return { userData, refreshToken, accessToken };
            }
            catch (error) {
                console.error('Login failed:', error);
                throw new Error('Failed to log in');
            }
        },
    },
};
