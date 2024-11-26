export default {
    Query: {
        getTodoByUser: async (_, __, { user, prisma }) => {
            const findUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            if (!findUser.expiresAt || new Date(user.expiresAt) < new Date()) {
                throw new Error('Session expired');
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

            if (!findUser.expiresAt || new Date(user.expiresAt) < new Date()) {
                throw new Error('Session expired');
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

            if (!findUser.expiresAt || new Date(user.expiresAt) < new Date()) {
                throw new Error('Session expired');
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
            const sessionToken = user.sessionToken

            if (!sessionToken) {
                throw new Error('Session Token Is Missing')
            }

            const findUser = await prisma.user.findUnique({
                where: { sessionToken },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            if (!findUser.expiresAt || new Date(user.expiresAt) < new Date()) {
                throw new Error('Session expired');
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
            const sessionToken = user.sessionToken

            if (!sessionToken) {
                throw new Error('Session Token Is Missing')
            }

            const findUser = await prisma.user.findUnique({
                where: { sessionToken },
            });

            if (!findUser) {
                throw new Error('User not found');
            }

            if (!findUser.expiresAt || new Date(user.expiresAt) < new Date()) {
                throw new Error('Session expired');
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
        }
    },
};