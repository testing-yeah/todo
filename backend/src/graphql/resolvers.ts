import { PrismaClient, User, Todo } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

interface UserJwt {
  userId: number; // userId should be a number, as it's stored as an integer in Prisma
}

interface CreateUserArgs {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateTodoArgs {
  title: string;
  description: string;
  userId: number;
}

interface UpdateTodoArgs {
  id: number;
  title: string;
  completed: boolean;
  description: string;
}

interface DeleteTodoArgs {
  id: number;
}

interface LoginArgs {
  email: string;
  password: string;
}

interface ToggleTodoArgs {
  id: number;
  completed: boolean;
}

export const resolvers = {
  Query: {
    users: async (): Promise<User[]> => {
      try {
        return await prisma.user.findMany({ include: { todos: true } });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Error fetching users: ${error.message}`);
        }
        throw new Error("An unknown error occurred");
      }
    },
    user: async (_: any, args: { id: string }): Promise<User | null> => {
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
    todos: async (): Promise<Todo[]> => {
      try {
        return await prisma.todo.findMany({ include: { user: true } });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Error fetching todos: ${error.message}`);
        }
        throw new Error("An unknown error occurred");
      }
    },
    todo: async (_: any, args: { id: string }): Promise<Todo | null> => {
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
    getTodosByUserId: async (_: any, { userId }: { userId: number }): Promise<Todo[]> => {
      try {
        return await prisma.todo.findMany({
          where: { userId },
          include: { user: true },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Error fetching todos for user: ${error.message}`);
        }
        throw new Error("An unknown error occurred");
      }
    },
  },

  Mutation: {
    createUser: async (_: any, args: CreateUserArgs): Promise<User> => {
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

    createTodo: async (_: any, args: CreateTodoArgs): Promise<Todo> => {
      try {
        return await prisma.todo.create({
          data: {
            title: args.title,
            description: args.description || "", // Ensure description is a string
            userId: args.userId,
          },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Error creating todo: ${error.message}`);
        }
        throw new Error("An unknown error occurred");
      }
    },

    updateTodo: async (_: any, args: UpdateTodoArgs): Promise<Todo> => {
      try {
        return await prisma.todo.update({
          where: { id: args.id },
          data: {
            title: args.title,
            completed: args.completed,
            description: args.description,
            updatedAt: new Date(),
          },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Error updating todo: ${error.message}`);
        }
        throw new Error("An unknown error occurred");
      }
    },

    deleteTodo: async (_: any, args: DeleteTodoArgs): Promise<boolean> => {
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

    login: async (_: any, args: LoginArgs): Promise<{ token: string; user: User }> => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: args.email },
        });
        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isValidPassword = await bcrypt.compare(args.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

        return { token, user };
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Error logging in: ${error.message}`);
        }
        throw new Error("An unknown error occurred");
      }
    },

    toggleTodo: async (_: any, args: ToggleTodoArgs): Promise<Todo> => {
      const { id, completed } = args;
      try {
        return await prisma.todo.update({
          where: { id },
          data: {
            completed,
            updatedAt: new Date(),
          },
        });
      } catch (error: any) {
        console.error("Error in toggleTodo resolver:", error);
        throw new Error(`Error toggling todo: ${error.message}`);
      }
    },
  },
};
