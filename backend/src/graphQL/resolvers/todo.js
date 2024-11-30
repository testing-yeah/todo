import prisma from "../../../prisma/client.js";
import jwt from "jsonwebtoken";

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

        getUserTodos: async (_, { userId: userToken }) => {
            const userJwt = jwt.verify(userToken, process.env.JWT_SECRET);

            try {
                const todos = await prisma.todo.findMany({
                    where: {
                        userId: userJwt.userId,
                    },
                });

                return todos;
            } catch (error) {
                throw new Error("Error fetching todos for user: " + error.message);
            }
        },

        getTodoById: async (_, { id }) => {
            try {
                // Find the todo by its ID
                const todo = await prisma.todo.findUnique({
                    where: { id },
                });

                if (!todo) {
                    throw new Error("Todo not found");
                }

                return todo;
            } catch (error) {
                throw new Error("Error fetching todo by ID: " + error.message);
            }
        },
    },

    Mutation: {
        // Add a new Todo
        addTodo: async (_, { title, description, token, completed }) => {
            const userJwt = jwt.verify(token, process.env.JWT_SECRET);

            try {
                // Check if the user exists
                const user = await prisma.user.findUnique({
                    where: { id: userJwt.userId },
                });

                if (!user) {
                    throw new Error("User not found");
                }

                // Create the new Todo
                const newTodo = await prisma.todo.create({
                    data: {
                        title,
                        description,
                        completed: completed ?? false,
                        userId: user.id,
                    },
                });

                return newTodo;
            } catch (error) {
                throw new Error("Error adding Todo: " + error.message);
            }
        },

        // Delete a Todo by ID
        deleteTodo: async (_, { id, token }) => {
            const userJwt = jwt.verify(token, process.env.JWT_SECRET);

            try {
                const todo = await prisma.todo.findUnique({
                    where: { id },
                });

                if (!todo) {
                    throw new Error("Todo not found");
                }

                if (todo.userId !== userJwt.userId) {
                    throw new Error("You are not authorized to delete this todo");
                }

                // Delete the todo
                await prisma.todo.delete({
                    where: { id },
                });

                return true;
            } catch (error) {
                throw new Error("Error deleting Todo: " + error.message);
            }
        },

        // Edit an existing Todo
        editTodo: async (_, { id, token, title, description, completed }) => {
            const userJwt = jwt.verify(token, process.env.JWT_SECRET);

            try {
                const todo = await prisma.todo.findUnique({
                    where: { id },
                });

                if (!todo) {
                    throw new Error("Todo not found");
                }

                if (todo.userId !== userJwt.userId) {
                    throw new Error("You are not authorized to edit this todo");
                }

                // Update the Todo with provided fields
                const updatedTodo = await prisma.todo.update({
                    where: { id },
                    data: {
                        title: title ?? todo.title,
                        description: description ?? todo.description,
                        completed: completed ?? todo.completed,
                    },
                });

                return updatedTodo;
            } catch (error) {
                throw new Error("Error editing Todo: " + error.message);
            }
        },
    },
};

export { todoResolvers };
