"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const DateTime = new graphql_1.GraphQLScalarType({
    name: 'DateTime',
    description: 'Custom scalar for ISO DateTime',
    parseValue(value) {
        return new Date(value); // Convert incoming value to JavaScript Date
    },
    serialize(value) {
        return value.toISOString(); // Convert Date to ISO string for the response
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});
exports.default = DateTime;
