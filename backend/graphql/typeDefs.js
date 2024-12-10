"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
exports.typeDefs = (0, apollo_server_1.gql) `
  scalar DateTime

  type User {
    id: Int!
    name: String!
    username: String!
    email: String!
    todos: [Todo!]!
    createdAt: DateTime!
  }

  type Todo {
    id: Int!
    title: String!
    description: String
    completed: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
    todos: [Todo!]!
    todo(id: Int!): Todo
    getTodosByUserId(userId: Int!): [Todo!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    createUser(name: String!, username: String!, email: String!, password: String!): User!
    createTodo(title: String!, description: String, userId: Int!): Todo!
    updateTodo(id: Int!, title: String!, description: String, completed: Boolean!): Todo!
    deleteTodo(id: Int!): Boolean!
    login(email: String!, password: String!): AuthPayload!
    toggleTodo(id: Int!, completed: Boolean!): Todo!
  }
`;
