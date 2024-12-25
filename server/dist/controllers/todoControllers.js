"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeTodo = exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodoById = exports.getAllTodos = void 0;
const todoServices_1 = require("../services/todoServices");
// Custom error class to include status
class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
const getAllTodos = async (req, res) => {
    try {
        const { userId } = req.body;
        const tasks = await (0, todoServices_1.getAllTasks)(userId);
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500)({ message: 'Unknown error occurred' });
    }
};
exports.getAllTodos = getAllTodos;
const getTodoById = async (req, res) => {
    try {
        const { task_id } = req.body;
        const task = await (0, todoServices_1.getTaskById)(task_id[0]);
        res.status(200).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Unknown error occurred' });
    }
};
exports.getTodoById = getTodoById;
const createTodo = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const todo = req.body.formData;
        const task = await (0, todoServices_1.createTask)(user_id, todo);
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ messege: 'error in add todo' });
    }
};
exports.createTodo = createTodo;
const updateTodo = async (req, res) => {
    try {
        const data = req.body;
        const updatedTask = await (0, todoServices_1.updateTask)(data.task_id, data);
        res.status(200).json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ messege: 'error in update todo' });
    }
};
exports.updateTodo = updateTodo;
const deleteTodo = async (req, res) => {
    try {
        const { task_id } = req.body;
        await (0, todoServices_1.deleteTask)(task_id);
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ messege: 'error in delete todo' });
    }
};
exports.deleteTodo = deleteTodo;
const completeTodo = async (req, res, next) => {
    try {
        const { task_id } = req.params;
        const updatedTask = await (0, todoServices_1.completeTask)(task_id);
        res.status(200).json(updatedTask);
    }
    catch (error) {
        if (error instanceof HttpError) {
            next({ status: error.status, message: error.message });
        }
        else if (error instanceof Error) {
            next({ status: 500, message: error.message });
        }
        else {
            next({ status: 500, message: 'Unknown error occurred' });
        }
    }
};
exports.completeTodo = completeTodo;
