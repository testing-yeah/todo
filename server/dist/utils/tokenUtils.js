"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshTokenPayload = exports.getAccessTokenPayload = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    const istokenValid = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    return { istokenValid, token };
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    const istokenValid = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return { istokenValid, token };
};
exports.verifyRefreshToken = verifyRefreshToken;
const getAccessTokenPayload = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    return decoded.id;
};
exports.getAccessTokenPayload = getAccessTokenPayload;
const getRefreshTokenPayload = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return decoded.id;
};
exports.getRefreshTokenPayload = getRefreshTokenPayload;
