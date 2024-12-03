import userResolvers from './user.js';
import todoResolvers from './todo.js';
import DateTime from '../../utils/dateScalar.js';
export default {
    DateTime,
    Query: Object.assign(Object.assign({}, userResolvers.Query), todoResolvers.Query),
    Mutation: Object.assign(Object.assign({}, userResolvers.Mutation), todoResolvers.Mutation),
    User: userResolvers.User,
};
