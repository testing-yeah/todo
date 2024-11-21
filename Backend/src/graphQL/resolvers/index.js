import userResolvers from './user.js';
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
