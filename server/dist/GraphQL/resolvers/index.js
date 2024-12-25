"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const todo_js_1 = __importDefault(require("./todo.js"));
const user_js_1 = __importDefault(require("./user.js"));
exports.default = {
    Query: {
        ...user_js_1.default.Query,
        ...todo_js_1.default.Query
    },
    Mutation: {
        ...user_js_1.default.Mutation,
        ...todo_js_1.default.Mutation
    },
};
