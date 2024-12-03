var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export default {
    Query: {
        user: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user, prisma }) {
            if (!user) {
                throw new Error('User is not authenticated');
            }
            return prisma.user.findUnique({
                where: { id: user.id },
                include: { todos: true },
            });
        }),
        getUserProfile: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user, prisma }) {
            if (!user) {
                throw new Error('Unauthorized: Please log in.');
            }
            return prisma.user.findUnique({
                where: { id: user.id },
            });
        }),
    },
    Mutation: {
        createUser: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { username, email, password }, { prisma }) {
            const hashedPassword = yield bcrypt.hash(password, 10);
            const newUser = yield prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            return newUser;
        }),
        loginUser: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { email, password }, { res, prisma }) {
            const user = yield prisma.user.findUnique({
                where: { email },
            });
            if (!user)
                throw new Error('User not found');
            const isPasswordValid = yield bcrypt.compare(password, user.password);
            if (!isPasswordValid)
                throw new Error('Invalid password');
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { user, token };
        }),
    },
    User: {
        todos: (parent_1, _1, _a) => __awaiter(void 0, [parent_1, _1, _a], void 0, function* (parent, _, { prisma }) {
            return prisma.todo.findMany({ where: { userId: parent.id } });
        }),
    },
};
