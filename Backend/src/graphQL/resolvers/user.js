export default {
    Query: {
        users: async (_, __, { prisma }) => prisma.user.findMany({
            include: { todos: true, tokens: true },
        }),

        user: async (_, { id }, { prisma }) => prisma.user.findUnique({
            where: { id },
            include: { todos: true, tokens: true },
        }),
    },

    Mutation: {
        createUser: async (_, { username, email, password }, { prisma }) => {
            return prisma.user.create({
                data: { username, email, password },
            });
        },
    },

    User: {
        todos: (parent, _, { prisma }) => prisma.todo.findMany({ where: { userId: parent.id } }),   
        tokens: (parent, _, { prisma }) => prisma.token.findMany({ where: { userId: parent.id } }),
    },
};
