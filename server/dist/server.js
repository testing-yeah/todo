"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: './.env' });
const client_1 = require("@prisma/client");
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const graphql_1 = require("graphql");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("./GraphQL/resolvers/index"));
const typeDefs_1 = __importDefault(require("./GraphQL/typeDefs"));
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static("public"));
app.use('/todo', todoRoutes_1.default);
app.use('/auth', userRoutes_1.default);
const main = async () => {
    const validateSession = async (sessionToken) => {
        if (!sessionToken) {
            console.error('Session token not provided');
            return null;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(sessionToken, process.env.JWT_SECRET || '');
            const user = await prisma.user.findUnique({ where: { user_id: decoded.userId } });
            if (!user) {
                console.error('No user found for the provided token');
                return null;
            }
            return user;
        }
        catch (error) {
            console.error('Invalid or expired token:', error.message);
            return null;
        }
    };
    const apolloServer = new apollo_server_express_1.ApolloServer({
        typeDefs: typeDefs_1.default,
        resolvers: index_1.default,
        cache: 'bounded',
        plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
        introspection: true,
        formatError: (error) => {
            if (error.originalError) {
                return {
                    message: error.message,
                    code: error.extensions.code,
                };
            }
            return (0, graphql_1.formatError)(error);
        },
    });
    await prisma.$connect();
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app: app,
        cors: false,
        bodyParserConfig: { limit: "1tb" },
    });
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
    });
};
main().catch((err) => console.error(err));
