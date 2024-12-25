import express from "express";
import { login, signup, validateUserController,logout,getUserData } from '../controllers/userControllers';
const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.post('/user-data', getUserData)
router.post('/validation', validateUserController)

export default router