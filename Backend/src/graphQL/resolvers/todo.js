export default {
    Query: {
        getTodoByUser: async (_, __, { user, prisma }) => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            const TodoData = await prisma.todo.findMany({
                where: { userId: findUser.id }
            })
            return TodoData
        },
    },

    Mutation: {
        createTodo: async (_, { title, description }, { user, prisma }) => {
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

        deleteTodo: async (_, { id }, { user, prisma }) => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            const todo = await prisma.todo.findUnique({ where: { id } });

            if (!todo) {
                throw new Error("Todo not found");
            }

            try {
                await prisma.todo.delete({ where: { id } });
            } catch (error) {
                console.error('Error creating todo:', error);
                throw new Error('Error creating todo');
            }
        },

        getTodoById: async (_, { id }, { user, prisma }) => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            try {
                const findedTodo = await prisma.todo.findUnique({
                    where: { id }
                })

                return findedTodo
            } catch (error) {
                console.log('Error To Finding Todo By id', error)
            }
        },

        updateTodo: async (_, { id, title, description, completed }, { user, prisma }) => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            try {
                const updatedTodo = await prisma.todo.update({
                    where: { id },
                    data: {
                        id,
                        title,
                        description,
                        completed
                    }
                })

                return updatedTodo
            } catch (error) {
                console.log('Error To Update Todo', error)
            }
        },

        completedTodo: async (_, { id, completed }, { user, prisma }) => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id }
            })

            if (!findUser) {
                throw new Error('Unauthorized User')
            }

            const findTodo = await prisma.todo.update({
                where: { id },
                data: { completed },
            })
            if (!findTodo) {
                return
            }

            const sortedTodos = await prisma.todo.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return sortedTodos
        }
    },
};