"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const resolvers = {
    Query: {
        getTodos: async (_, { userId }) => {
            try {
                const tasks = await prisma.task.findMany({
                    where: { userId },
                });
                return tasks;
            }
            catch (error) {
                console.error("Error fetching tasks:", error);
                throw new Error("Unable to fetch tasks.");
            }
        },
        getTodoById: async (_, { task_id }) => {
            const task = await prisma.task.findUnique({ where: { task_id } });
            if (!task) {
                throw new Error("Task not found");
            }
            return task;
        },
    },
    Mutation: {
        createTodo: async (_, { userId, title, task_description, dueDate, priority }) => {
            const userExists = await prisma.user.findUnique({ where: { user_id: userId } });
            if (!userExists) {
                throw new Error("User not authorized to create tasks");
            }
            const date = new Date(dueDate);
            return await prisma.task.create({
                data: {
                    userId,
                    title,
                    task_description,
                    dueDate: date,
                    priority
                },
            });
            ;
        },
        deleteTodo: async (_, { task_id }) => {
            const task = await prisma.task.findUnique({ where: { task_id } });
            if (!task) {
                throw new Error("Task not found");
            }
            return await prisma.task.delete({ where: { task_id } });
        },
        updateTask: async (_, { task_id, data }, context) => {
            delete data.task_id;
            try {
                const updatedTask = await prisma.task.update({
                    where: { task_id },
                    data: data,
                });
                return updatedTask;
            }
            catch (error) {
                console.error('Error updating task:', error);
                throw new Error('Failed to update task');
            }
        },
        completeTodo: async (_, { task_id }, { prisma }) => {
            const task = await prisma.task.findUnique({ where: { task_id } });
            if (!task) {
                throw new Error("Task not found");
            }
            return await prisma.task.update({
                where: { task_id },
                data: { status: "COMPLETED" },
            });
        },
    },
};
exports.default = resolvers;
