import userResolvers from './user.js';
import todoResolvers from './todo.js';
import DateTime from '../../utils/dateScalar.js';

export default {
    DateTime,
    Query: {
        ...userResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...todoResolvers.Mutation
    },
    User: userResolvers.User,
};
