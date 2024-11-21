import userResolvers from './user.js';
import todoResolvers from './todo.js';
import tokenResolvers from './token.js';
import DateTime from '../../utils/dateScalar.js';

export default {
    DateTime,
    Query: {
        ...userResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
    },
    User: userResolvers.User,
};
