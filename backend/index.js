import dotenv from "dotenv";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import jwt from "jsonwebtoken";
import { typeDefs } from "./src/graphQL/type.js";
import { resolvers } from "./src/graphQL/resolvers/user.js";
import cors from "cors";
import prisma from "./prisma/client.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Apollo Server Setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || '';

        const context = {
            prisma,
        };

        if (token) {
            try {
                const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
                context.userId = decodedToken.userId;
            } catch (error) {
                throw new Error('Authentication failed');
            }
        }

        return context;
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

    // Start Server
    app.listen(port, () =>
        console.log(
            `Server is running on http://localhost:${port}${server.graphqlPath}`
        )
    );
};

serverStart().catch((err) => {
    console.log(`Server error: ${err}`);
});
