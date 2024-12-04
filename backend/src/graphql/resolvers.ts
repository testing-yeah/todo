  import { PrismaClient } from "@prisma/client";
  import bcrypt from "bcryptjs";
  import jwt from 'jsonwebtoken'
  import dotenv from 'dotenv'


  dotenv.config();

  const prisma = new PrismaClient();
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  export const resolvers = {
    Query: {
      users: async () => {
        try {
          return await prisma.user.findMany({ include: { todos: true } });
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error fetching users: ${error.message}`);
          }
          throw new Error("An unknown error occurred");
        }
      },
      user: async (_: any, args: { id: string }) => {
        try {
          return await prisma.user.findUnique({
            where: { id: parseInt(args.id) },
            include: { todos: true },
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error fetching user: ${error.message}`);
          }
          throw new Error("An unknown error occurred");
        }
      },
      todos: async () => {
        try {
          return await prisma.todo.findMany({ include: { user: true } });
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error fetching todos: ${error.message}`);
          }
          throw new Error("An unknown error occurred");
        }
      },
      todo: async (_: any, args: { id: string }) => {
        try {
          return await prisma.todo.findUnique({
            where: { id: parseInt(args.id) },
            include: { user: true },
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error fetching todo: ${error.message}`);
          }
          throw new Error("An unknown error occurred");
        }
      },
      getTodosByUserId: async (_: any, { userId }: { userId: number }) => {
        try {
          // Fetch todos for the given userId
          const todos = await prisma.todo.findMany({
            where: { userId: userId },
            include: { user: true },
          });

          // Ensure that DateTime fields are serialized to ISO string format
          return todos.map(todo => ({
            ...todo,
            createdAt: todo.createdAt.toISOString(), 
            updatedAt: todo.updatedAt.toISOString(), 
          }));
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error fetching todos for user: ${error.message}`);
          }
          throw new Error("An unknown error occurred");
        }
      },
    },
    Mutation: {
      createUser: async (_: any, args: { name: string; username: string; email: string; password: string }) => {
        try {
          const hashedPassword = await bcrypt.hash(args.password, 10);
          return await prisma.user.create({
            data: {
              name: args.name,
              username: args.username,
              email: args.email,
              password: hashedPassword,
            },
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error creating user: ${error.message}`);
          }
          throw new Error("An unknown error occurred");
        }
      },
      createTodo: async (_: any, args: { title: string; description: string; userId: number }) => {
        try {
          return await prisma.todo.create({
            data: {
              title: args.title,
              description: args.description || "", // UPDATED: Added description to the todo
              userId: args.userId,
            } as any,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error creating todo: ${error.message}`);
          }
          throw new Error("An unknown error occurred");
        }
      },
      updateTodo: async (_: any, args: { id: number; title: string; completed: boolean; description: string }) => {
        try {
          return await prisma.todo.update({
            where: { id: args.id },
            data: {
              title: args.title,
              completed: args.completed,
              description: args.description, // UPDATED: Updated description field
              updatedAt: new Date(), // UPDATED: Set updatedAt to the current date/time
            } as any,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error updating todo: ${error.message}`);
          }
          throw new Error("An unknown error occurred");
        }
      },
      deleteTodo: async (_: any, args: { id: number }) => {
        try {
          await prisma.todo.delete({ where: { id: args.id } });
          return true;
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error deleting todo: ${error.message}`);
          }
          throw new Error("An unknown error occurred");
        }
      },
      login: async (_: any, args: { email: string; password: string }) => {
        try {
          // Find the user by email
          const user = await prisma.user.findUnique({
            where: { email: args.email },
          });
          if (!user) {
            throw new Error("Invalid credentials");
          }

          // Check password
          const isValidPassword = await bcrypt.compare(args.password, user.password);
          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          }

          // Generate JWT
          const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

          return {
            token,
            user,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error logging in: ${error.message}`);
          }
          throw new Error("An unknown error occurred");
        }
      },
    },
  };
