"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const router = express_1.default.Router();
router.post('/login', userControllers_1.login);
router.post('/signup', userControllers_1.signup);
router.post('/logout', userControllers_1.logout);
router.post('/user-data', userControllers_1.getUserData);
router.post('/validation', userControllers_1.validateUserController);
exports.default = router;
