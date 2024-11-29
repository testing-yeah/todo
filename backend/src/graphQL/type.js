import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: Int!
    username: String!
    email: String!
    imageUrl: String
    password: String
    createdAt: String!
    updatedAt: String!

    todos: [Todo!]!
  }

  type Todo {
    id: Int!
    title: String!
    description: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
    userId: Int!
    user: User!
  }

  type Query {
    getTodo: [Todo!]!
    getUserTodos(userId: Int!): [Todo!]!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String!
    logout: Boolean!
    editTodo(
      id: Int!
      userId: Int!
      title: String
      description: String
      completed: Boolean
    ): Todo!
    deleteTodo(id: Int!, userId: Int!): Boolean!

     # Add new addTodo mutation
    addTodo(
      userId: Int!
      title: String!
      description: String!
      completed: Boolean
    ): Todo!
  }
`;

export { typeDefs };
