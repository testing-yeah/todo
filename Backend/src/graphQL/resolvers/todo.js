export default {
    Mutation: {
        createTodo: async (_, { title, description }, { req, prisma }) => {
            // Retrieve session token from cookies
            const sessionToken = req.cookies.sessionId;

            if (!sessionToken) {
                throw new Error('Session token is missing.');
            }

            // Find user by sessionToken
            const user = await prisma.user.findUnique({
                where: { sessionToken },
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Optionally, check if the session is expired
            if (!user.expiresAt || new Date(user.expiresAt) < new Date()) {
                throw new Error('Session expired');
            }

            // Create new todo for the user
            try {
                const newTodo = await prisma.todo.create({
                    data: {
                        userId: user.id, // Use the user's ID to associate the todo
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
    },
};
