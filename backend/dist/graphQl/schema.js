"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
  type User {
    id: ID!
    username: String
    email: String!
    password: String!
    todos: [Todo]!
  }

  type Todo {
    id: ID!
    todo: String!
    description: String!
    isPending: Boolean!
    author: User
    authorId: ID!
  }

  type AuthPayload {
  token: String!
  user: User!
}

  type SignOutResponse {
    message: String!
}

  type Query {
    getUser(id: ID!): User
    getUserTodos(userId: ID!): [Todo]!
    getTodos: [Todo]!
    getTodo(id: ID!): Todo!
  }

  type Mutation {
    signUp(name: String!, email: String!, password: String!): User!
    signIn(email: String!, password: String!): AuthPayload!
    signOut: SignOutResponse!
    createTodo(todo: String!, description: String!, authorId: ID!): Todo!
    updateTodo(id: ID!, todo: String!, description: String!, isPending: Boolean!): Todo!
    deleteTodo(id: ID!): Boolean!
  }
`;
