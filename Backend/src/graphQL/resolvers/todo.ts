import { PrismaClient, Todo, User } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';

export interface Context {
    user: User;
    prisma: PrismaClient;
}

interface TodoInput {
    id?: string;
    title?: string;
    description?: string;
    completed?: boolean;
}

const resolvers = {
    Query: {
        getTodoByUser: async (
            _: unknown,
            __: unknown,
            { user, prisma }: Context
        ): Promise<Todo[]> => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            const todoData = await prisma.todo.findMany({
                where: { userId: findUser.id },
            });

            return todoData;
        },
    },

    Mutation: {
        createTodo: async (
            _: unknown,
            { title, description }: { title: string; description: string },
            { user, prisma }: Context
        ): Promise<Todo> => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            try {
                const newTodo = await prisma.todo.create({
                    data: {
                        userId: findUser.id,
                        title,
                        description,
                    },
                });

                return newTodo;
            } catch (error) {
                console.error('Error creating todo:', error);
                throw new Error('Error creating todo');
            }
        },

        deleteTodo: async (
            _: unknown,
            { id }: { id: string },
            { user, prisma }: Context
        ): Promise<string> => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            const todo = await prisma.todo.findUnique({ where: { id } });

            if (!todo) {
                throw new Error('Todo not found');
            }

            try {
                await prisma.todo.delete({ where: { id } });
                return 'Todo deleted successfully';
            } catch (error) {
                console.error('Error deleting todo:', error);
                throw new Error('Error deleting todo');
            }
        },

        getTodoById: async (
            _: unknown,
            { id }: { id: string },
            { user, prisma }: Context
        ): Promise<Todo | null> => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            try {
                const findedTodo = await prisma.todo.findUnique({
                    where: { id },
                });

                return findedTodo;
            } catch (error) {
                console.error('Error finding Todo by ID:', error);
                return null;
            }
        },

        updateTodo: async (
            _: unknown,
            { id, title, description, completed }: TodoInput,
            { user, prisma }: Context
        ): Promise<Todo> => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            try {
                const updatedTodo = await prisma.todo.update({
                    where: { id: id as string },
                    data: {
                        title,
                        description,
                        completed,
                    },
                });

                return updatedTodo;
            } catch (error) {
                console.error('Error updating Todo:', error);
                throw new Error('Error updating Todo');
            }
        },

        completedTodo: async (
            _: unknown,
            { id, completed }: { id: string; completed: boolean },
            { user, prisma }: Context
        ): Promise<Todo[]> => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!findUser) {
                throw new Error('Unauthorized User');
            }

            const findTodo = await prisma.todo.update({
                where: { id },
                data: { completed },
            });

            if (!findTodo) {
                throw new Error('Todo not found');
            }

            const sortedTodos = await prisma.todo.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return sortedTodos;
        },
    },
};

export default resolvers;
