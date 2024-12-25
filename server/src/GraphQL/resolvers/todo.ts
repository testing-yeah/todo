import { Priority, PrismaClient, Status } from '@prisma/client';
const prisma = new PrismaClient()

type Context = {
    prisma: PrismaClient;
};

type TaskInput = {
    userId: string;
    title: string;
    task_description: string;
    dueDate: Date;
    priority?: Priority;
};

type UpdateTaskInput = {
    title?: string;
    task_description?: string;
    dueDate?: Date;
    status?: Status;
    priority?: Priority;
    task_id?: string
};

const resolvers = {
    Query: {
        getTodos: async (_: unknown, { userId }: { userId: string }) => {
            try {
                const tasks = await prisma.task.findMany({
                    where: { userId },
                });
                return tasks;

            } catch (error) {
                console.error("Error fetching tasks:", error);
                throw new Error("Unable to fetch tasks.");
            }
        },

        getTodoById: async (_: unknown, { task_id }: { task_id: string }) => {

            const task = await prisma.task.findUnique({ where: { task_id } });
            if (!task) {
                throw new Error("Task not found");
            }
            return task;
        },
    },
    Mutation: {
        createTodo: async (_: unknown, { userId,
            title,
            task_description,
            dueDate,
            priority }: TaskInput) => {
            const userExists = await prisma.user.findUnique({ where: { user_id: userId } });
            if (!userExists) {
                throw new Error("User not authorized to create tasks");
            }
            const date = new Date(dueDate)
            return await prisma.task.create({
                data: {
                    userId,
                    title,
                    task_description,
                    dueDate: date,
                    priority
                },
            });;
        },

        deleteTodo: async (_: unknown, { task_id }: { task_id: string }) => {
            const task = await prisma.task.findUnique({ where: { task_id } });
            if (!task) {
                throw new Error("Task not found");
            }
            return await prisma.task.delete({ where: { task_id } });
        },

        updateTask: async (_: any, { task_id, data }: { task_id: string; data: UpdateTaskInput }, context: any) => {
            delete data.task_id;

            try {
                const updatedTask = await prisma.task.update({
                    where: { task_id },
                    data: data,
                });
                return updatedTask;
            } catch (error) {
                console.error('Error updating task:', error);
                throw new Error('Failed to update task');
            }
        },



        completeTodo: async (_: unknown, { task_id }: { task_id: string }, { prisma }: Context) => {
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

export default resolvers;
