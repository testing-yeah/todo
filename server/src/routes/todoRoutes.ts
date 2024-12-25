import express from "express";
import { createTodo, deleteTodo, getAllTodos, getTodoById, updateTodo } from '../controllers/todoControllers';
import { validateUser } from '../middleware/checkUser';

const router = express.Router()

router.post('/todos', validateUser, getAllTodos);
router.post('/task-details', validateUser, getTodoById);
router.post('/todo', validateUser, createTodo);
router.post('/update-task', validateUser, updateTodo);
router.post('/delete-task', validateUser, deleteTodo);
// router.patch('/todo/:task_id/complete', completeTodo);

export default router
