"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = logout;
exports.getUserData = getUserData;
exports.login = login;
exports.signup = signup;
exports.validateUserController = validateUserController;
const userServices_1 = require("../services/userServices");
const tokenUtils_1 = require("../utils/tokenUtils");
async function logout(req, res) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.json({ message: 'Logged out successfully' });
}
async function getUserData(req, res) {
    const user_id = req.body.user_id;
    const user = await (0, userServices_1.getUser)(user_id);
    res.status(200).json(user);
}
async function login(req, res) {
    try {
        const { emailOrUsername, password } = req.body;
        const user = await (0, userServices_1.loginUser)({ emailOrUsername, password });
        res.cookie('accessToken', user.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1 * 60 * 60 * 1000 // 2 hours
        });
        res.cookie('refreshToken', user.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json(error);
    }
}
async function signup(req, res) {
    try {
        const userData = req.body;
        const user = await (0, userServices_1.createUser)(userData);
        res.cookie('accessToken', user.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1 * 60 * 60 * 1000 // 2 hours
        });
        res.cookie('refreshToken', user.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json(error);
    }
}
async function validateUserController(req, res) {
    try {
        if (req.cookies.refreshToken) {
            if (req.cookies.accessToken) {
                const userId = (0, tokenUtils_1.getAccessTokenPayload)(req.cookies.accessToken);
                try {
                    const user = await (0, userServices_1.getUser)(userId);
                    return res.status(200).json({ ...user, isAuthenticated: true });
                }
                catch (error) {
                    console.error(error);
                }
            }
            else {
                const userId = (0, tokenUtils_1.getRefreshTokenPayload)(req.cookies.refreshToken);
                res.cookie("accessToken", (0, tokenUtils_1.generateAccessToken)(userId), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 1 * 60 * 60 * 1000,
                });
                const user = await (0, userServices_1.getUser)(userId);
                return res.status(200).json({ ...user, isAuthenticated: true });
            }
        }
        else {
            return res.status(200).json({ isAuthenticated: false });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
