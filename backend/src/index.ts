import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { todoResolvers } from "./graphQL/resolvers/todo";
import { userResolvers } from "./graphQL/resolvers/user";
import { typeDefs } from "./graphQL/type";
import prisma from "../prisma/client";

dotenv.config();

const app: express.Application = express();
const port = process.env.PORT || 8080;

app.use(cookieParser());

// Define a custom JWT payload type with the userId property
interface MyJwtPayload extends JwtPayload {
    userId: string;
}

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

// Helper function to verify the JWT token and extract the userId
const verifyToken = (authorizationHeader: string): MyJwtPayload | null => {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        throw new Error("Authorization token is missing or malformed.");
    }

    const token = authorizationHeader.replace("Bearer ", "");

    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as MyJwtPayload;
    } catch (err: unknown) {
        if (err instanceof Error) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token has expired");
            } else {
                throw new Error("Invalid or expired token");
            }
        } else {
            throw new Error("Unknown error occurred during token verification");
        }
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

                if (decodedToken) {
                    user = { id: decodedToken.userId };
                }
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

    // Type assertion workaround (use if type mismatch persists)
    server.applyMiddleware({ app } as any);

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
