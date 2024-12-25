import { Priority, Status } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { completeTask, createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../services/todoServices';
import { log } from 'console';

// Custom error class to include status
class HttpError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

interface TaskInput {
    userId: string;
    title: string;
    task_description: string;
    dueDate?: Date;
    status?: Status;
    priority?: Priority;
}

interface UpdateTaskInput {
    title: string;
    task_description: string;
    dueDate: string;
    status: Status;
    priority: Priority;
    task_id: string;
}

export const getAllTodos = async (req: any, res: any) => {
    try {
        const { userId } = req.body;
        const tasks = await getAllTasks(userId);
        res.status(200).json(tasks);
    } catch (error: unknown) {
        res.status(500)({ message: 'Unknown error occurred' });
    }
}

export const getTodoById = async (req: any, res: any) => {
    try {
        const { task_id } = req.body;
        const task = await getTaskById(task_id[0]);
        res.status(200).json(task);
    } catch (error: unknown) {
        res.status(500).json({ message: 'Unknown error occurred' });
    }
}

export const createTodo = async (req: any, res: any) => {
    try {
        const user_id = req.body.user_id
        const todo: TaskInput = req.body.formData;
        const task = await createTask(user_id, todo);
        res.status(201).json(task);
    } catch (error: unknown) {
        res.status(500).json({ messege: 'error in add todo' })
    }
}

export const updateTodo = async (req: any, res: any) => {
    try {
        const data: UpdateTaskInput = req.body;
        const updatedTask = await updateTask(data.task_id, data);
        res.status(200).json(updatedTask);
    } catch (error: unknown) {
        res.status(500).json({ messege: 'error in update todo' })
    }
}

export const deleteTodo = async (req: any, res: any) => {
    try {
        const { task_id } = req.body;
        await deleteTask(task_id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: unknown) {
        res.status(500).json({ messege: 'error in delete todo' })
    }
}

export const completeTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { task_id } = req.params;
        const updatedTask = await completeTask(task_id);
        res.status(200).json(updatedTask);
    } catch (error: unknown) {
        if (error instanceof HttpError) {
            next({ status: error.status, message: error.message });
        } else if (error instanceof Error) {
            next({ status: 500, message: error.message });
        } else {
            next({ status: 500, message: 'Unknown error occurred' });
        }
    }
}
