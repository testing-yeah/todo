var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const resolvers = {
    Query: {
        getTodoByUser: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user, prisma }) {
            const findUser = yield prisma.user.findUnique({
                where: { id: user.id },
            });
            if (!findUser) {
                throw new Error('User not found');
            }
            const todoData = yield prisma.todo.findMany({
                where: { userId: findUser.id },
            });
            return todoData;
        }),
    },
    Mutation: {
        createTodo: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { title, description }, { user, prisma }) {
            const findUser = yield prisma.user.findUnique({
                where: { id: user.id },
            });
            if (!findUser) {
                throw new Error('User not found');
            }
            try {
                const newTodo = yield prisma.todo.create({
                    data: {
                        userId: findUser.id,
                        title,
                        description,
                    },
                });
                return newTodo;
            }
            catch (error) {
                console.error('Error creating todo:', error);
                throw new Error('Error creating todo');
            }
        }),
        deleteTodo: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { id }, { user, prisma }) {
            const findUser = yield prisma.user.findUnique({
                where: { id: user.id },
            });
            if (!findUser) {
                throw new Error('User not found');
            }
            const todo = yield prisma.todo.findUnique({ where: { id } });
            if (!todo) {
                throw new Error('Todo not found');
            }
            try {
                yield prisma.todo.delete({ where: { id } });
                return 'Todo deleted successfully';
            }
            catch (error) {
                console.error('Error deleting todo:', error);
                throw new Error('Error deleting todo');
            }
        }),
        getTodoById: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { id }, { user, prisma }) {
            const findUser = yield prisma.user.findUnique({
                where: { id: user.id },
            });
            if (!findUser) {
                throw new Error('User not found');
            }
            try {
                const findedTodo = yield prisma.todo.findUnique({
                    where: { id },
                });
                return findedTodo;
            }
            catch (error) {
                console.error('Error finding Todo by ID:', error);
                return null;
            }
        }),
        updateTodo: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { id, title, description, completed }, { user, prisma }) {
            const findUser = yield prisma.user.findUnique({
                where: { id: user.id },
            });
            if (!findUser) {
                throw new Error('User not found');
            }
            try {
                const updatedTodo = yield prisma.todo.update({
                    where: { id: id },
                    data: {
                        title,
                        description,
                        completed,
                    },
                });
                return updatedTodo;
            }
            catch (error) {
                console.error('Error updating Todo:', error);
                throw new Error('Error updating Todo');
            }
        }),
        completedTodo: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { id, completed }, { user, prisma }) {
            const findUser = yield prisma.user.findUnique({
                where: { id: user.id },
            });
            if (!findUser) {
                throw new Error('Unauthorized User');
            }
            const findTodo = yield prisma.todo.update({
                where: { id },
                data: { completed },
            });
            if (!findTodo) {
                throw new Error('Todo not found');
            }
            const sortedTodos = yield prisma.todo.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return sortedTodos;
        }),
    },
};
export default resolvers;
