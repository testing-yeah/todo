import prisma from "../../../prisma/client.js";

const todoResolvers = {
    Query: {
        getTodo: async () => {
            try {
                const todos = await prisma.todo.findMany();
                return todos;
            } catch (error) {
                throw new Error("Error fetching todos: " + error.message);
            }
        },

        getUserTodos: async (_, { userId }) => {
            try {
                const todos = await prisma.todo.findMany({
                    where: {
                        userId,
                    },
                });

                console.log("todos", todos);

                return todos;
            } catch (error) {
                throw new Error("Error fetching todos for user: " + error.message);
            }
        },
    },

    Mutation: {
        // Add a new Todo
        addTodo: async (_, { userId, title, description, completed }) => {
            try {
                // Check if the user exists
                const user = await prisma.user.findUnique({ where: { id: userId } });

                if (!user) {
                    throw new Error("User not found");
                }

                // Create the new Todo
                const newTodo = await prisma.todo.create({
                    data: {
                        title,
                        description,
                        completed: completed ?? false, // Default to false if not provided
                        userId, // Associate the Todo with the user
                    },
                });

                return newTodo;
            } catch (error) {
                throw new Error("Error adding Todo: " + error.message);
            }
        },

        // Edit a Todo
        editTodo: async (_, { id, userId, title, description, completed }) => {
            const user = await prisma?.user?.findUnique({ where: { id: userId } });

            if (!user) {
                throw new Error("User not found");
            }

            try {
                // Check if the todo exists and belongs to the user
                const todo = await prisma?.todo?.findUnique({
                    where: { id },
                });

                if (!todo) {
                    throw new Error("Todo not found");
                }

                if (todo.userId !== userId) {
                    throw new Error("You do not have permission to edit this todo");
                }

                // Update the todo
                const updatedTodo = await prisma?.todo?.update({
                    where: { id },
                    data: {
                        title: title || todo.title,
                        description: description || todo.description,
                        completed: completed !== undefined ? completed : todo.completed,
                    },
                });

                return updatedTodo;
            } catch (error) {
                throw new Error("Error editing Todo: " + error.message);
            }
        },

        // Delete a Todo
        deleteTodo: async (_, { id, userId }) => {
            const user = await prisma?.user?.findUnique({ where: { id: userId } });

            if (!user) {
                throw new Error("User not found");
            }

            try {
                // Check if the todo exists and belongs to the user
                const todo = await prisma?.todo?.findUnique({
                    where: { id },
                });

                if (!todo) {
                    throw new Error("Todo not found");
                }

                if (todo.userId !== userId) {
                    throw new Error("You do not have permission to delete this todo");
                }

                // Delete the todo
                await prisma?.todo?.delete({
                    where: { id },
                });

                return true; // Return true if deletion is successful
            } catch (error) {
                throw new Error("Error deleting Todo: " + error.message);
            }
        },
    },
};

export { todoResolvers };
