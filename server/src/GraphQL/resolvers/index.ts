import todoResolvers from './todo.js';
import userResolvers from './user.js';

export default {
    Query: {
        ...userResolvers.Query,
        ...todoResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...todoResolvers.Mutation
    },
};
