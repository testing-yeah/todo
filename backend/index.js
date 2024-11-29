import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import prisma from "./prisma/client.js";
import { userResolvers } from "./src/graphQL/resolvers/user.js";
import { todoResolvers } from "./src/graphQL/resolvers/todo.js";
import { typeDefs } from "./src/graphQL/type.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cookieParser());

const resolvers = {
    Query: {
        ...todoResolvers.Query,
        ...userResolvers.Query,
    },
    Mutation: {
        ...todoResolvers.Mutation,
        ...userResolvers.Mutation,
    },
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};

// Apollo Server Setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const sessionToken = req?.headers?.authorization;

        let user = null;

        if (sessionToken) {
            try {
                const decodedToken = verifyToken(sessionToken);
                user = { id: decodedToken.userId };
            } catch (err) {
                console.error("Token validation failed:", err);
            }
        }

        return {
            prisma,
            user,
        };
    },
});

const serverStart = async () => {
    // CORS configuration
    const corsOptions = {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "OPTIONS"],
    };
    app.use(cors(corsOptions));

    await server.start();

    server.applyMiddleware({ app });

    // Start the Express server
    app.listen(port, () =>
        console.log(
            `Server is running on http://localhost:${port}${server.graphqlPath}`
        )
    );
};

serverStart().catch((err) => {
    console.log(`Server error: ${err}`);
});
