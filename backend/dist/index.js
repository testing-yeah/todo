"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const typeDefs_1 = require("./graphql/typeDefs");
const resolvers_1 = require("./graphql/resolvers");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
const getUserFromToken = (token) => {
    if (!token)
        return null;
    try {
        // Verify the token and decode it
        const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decodedToken.userId; // Return the user ID from the token
    }
    catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};
const server = new apollo_server_1.ApolloServer({
    typeDefs: typeDefs_1.typeDefs,
    resolvers: resolvers_1.resolvers,
    context: ({ req }) => {
        // Extract the token from the "Authorization" header
        const token = req.headers.authorization?.split(" ")[1]; // Expected format: "Bearer <token>"
        const userId = getUserFromToken(token); // Decode the user ID from the token
        return {
            prisma,
            userId, // Attach the user ID to the context
        };
    },
});
server.listen({ port: 8000 }).then(({ url }) => {
    console.log(`🚀 Server Started at ${url}`);
});
