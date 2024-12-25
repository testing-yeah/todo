require("dotenv").config({ path: './.env' });
import { PrismaClient } from '@prisma/client';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from "cors";
import express, { Application } from "express";
import { DocumentNode, formatError } from "graphql";
import jwt, { JwtPayload } from 'jsonwebtoken';
import resolvers from './GraphQL/resolvers/index';
import typeDefs from './GraphQL/typeDefs';
import todoRoutes from './routes/todoRoutes';
import userRoutes from './routes/userRoutes';

const app: Application = express();
const prisma = new PrismaClient();
const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:3001'],  
  credentials: true,  
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser());  
app.use(express.static("public"));

app.use('/todo', todoRoutes)
app.use('/auth', userRoutes)

const main = async () => {
  type DecodedToken = JwtPayload & { userId: string };

  const validateSession = async (sessionToken: string | undefined) => {
    if (!sessionToken) {
      console.error('Session token not provided');
      return null;
    }

    try {
      const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET || '') as DecodedToken;
      const user = await prisma.user.findUnique({ where: { user_id: decoded.userId } });
      if (!user) {
        console.error('No user found for the provided token');
        return null;
      }
      return user;
    } catch (error) {
      console.error('Invalid or expired token:', (error as Error).message);
      return null;
    }
  };

  const apolloServer = new ApolloServer({
    typeDefs: typeDefs as DocumentNode,
    resolvers,
    cache: 'bounded',
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    introspection: true,
    formatError: (error) => {
      if (error.originalError) {
        return {
          message: error.message,
          code: error.extensions.code,
        };
      }
      return formatError(error);
    },
  });
  await prisma.$connect();
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app: app as any,
    cors: false,
    bodyParserConfig: { limit: "1tb" },

  });

  const PORT = process.env.PORT || 5000

  app.listen(PORT, () => {
  });
};
main().catch((err) => console.error(err));