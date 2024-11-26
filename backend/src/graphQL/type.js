import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: String!
    username: String!
    email: String!
    imageUrl: String
    password: String
    createdAt: String!
    updatedAt: String!
    
    todos: [Todo!]!
  }

  type Todo {
    id: String!
    title: String!
    description: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
    user: User!
  }

  type Query {
    getTodos: [Todo]
    getAllUsers: [User]
    getUser(id: ID!): User
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String! # JWT Token
    logout: Boolean!
    addTodo(title: String!, description: String!, userId: String!): Todo!
    toggleTodoCompletion(id: String!): Todo!
  }
`;

export { typeDefs };
