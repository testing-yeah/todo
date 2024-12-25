"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoControllers_1 = require("../controllers/todoControllers");
const checkUser_1 = require("../middleware/checkUser");
const router = express_1.default.Router();
router.post('/todos', checkUser_1.validateUser, todoControllers_1.getAllTodos);
router.post('/task-details', checkUser_1.validateUser, todoControllers_1.getTodoById);
router.post('/todo', checkUser_1.validateUser, todoControllers_1.createTodo);
router.post('/update-task', checkUser_1.validateUser, todoControllers_1.updateTodo);
router.post('/delete-task', checkUser_1.validateUser, todoControllers_1.deleteTodo);
// router.patch('/todo/:task_id/complete', completeTodo);
exports.default = router;
