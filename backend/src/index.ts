import { ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const getUserFromToken = (token: string | undefined) => {
  if (!token) return null;
  try {
    // Verify the token and decode it
    const decodedToken = jwt.verify(token, JWT_SECRET as string) as { userId: number };
    return decodedToken.userId; // Return the user ID from the token
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: any) => {
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