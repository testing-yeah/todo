import { GraphQLScalarType, Kind } from 'graphql';
const DateTime = new GraphQLScalarType({
    name: 'DateTime',
    description: 'Custom scalar for ISO DateTime',
    parseValue(value) {
        return new Date(value); // Convert incoming value to JavaScript Date
    },
    serialize(value) {
        return value.toISOString(); // Convert Date to ISO string for the response
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});
export default DateTime;
