"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeTask = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getAllTasks = void 0;
const client_1 = require("@prisma/client");
const getToDo_1 = require("../GraphQL/GetToDoGQL/getToDo");
const prisma = new client_1.PrismaClient();
const getAllTasks = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: getToDo_1.GET_TODO_QUERY,
                variables: { userId },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error in adding data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        return result.data.getTodos;
    }
    catch (error) {
        console.error(error);
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (task_id) => {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: getToDo_1.GET_TODO_BYID,
                variables: { task_id },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error in adding data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        return result.data.getTodoById;
    }
    catch (error) {
        console.error(error);
    }
};
exports.getTaskById = getTaskById;
const createTask = async (userId, data) => {
    const final_data = { ...data, userId };
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: getToDo_1.TODO_MUTATION,
                variables: { ...final_data },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error in adding data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        return result.data.createTodo;
    }
    catch (error) {
        console.error(error);
    }
};
exports.createTask = createTask;
const updateTask = async (task_id, data) => {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: getToDo_1.UPDATE_TODO,
                variables: {
                    task_id,
                    data
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error in update data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        return result.data.createUser;
    }
    catch (error) {
        console.error(error);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (task_id) => {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: getToDo_1.DELETE_TODO_MUTATION,
                variables: { task_id },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error in delete data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        return result.data.createUser;
    }
    catch (error) {
        console.error(error);
    }
};
exports.deleteTask = deleteTask;
const completeTask = async (task_id) => {
    const task = await prisma.task.findUnique({ where: { task_id } });
    if (!task)
        throw { status: 404, message: 'Task not found' };
    return prisma.task.update({ where: { task_id }, data: { status: 'COMPLETED' } });
};
exports.completeTask = completeTask;
