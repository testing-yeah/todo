import { gql } from 'apollo-server';

const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    username: String!
    imageUrl: String
    email: String!
    password: String!
    sessionToken: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    tokens: [Token!]!
    todos: [Todo!]!
  }

  type Token {
    id: ID!
    token: String!
    userId: String!
    expiresAt: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
  }

  type Todo {
    id: ID!
    title: String!
    description: String!
    completed: Boolean!
    userId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
  }
    
  type Query {
    users: [User!]!
    user(id: ID!): User
    todos: [Todo!]!
    todo(id: ID!): Todo
  }

type Mutation {
  createUser(username: String!, email: String!, password: String!): User!
  loginUser(email: String!, password: String!): LoginResponse!
  createTodo(title: String!, description: String!): Todo!
  updateTodo(id: ID!, completed: Boolean!): Todo!
  deleteTodo(id: ID!): Todo!
  createToken(userId: String!, token: String!, expiresAt: DateTime!): Token!
}

type AuthPayload {
  token: String!
  user: User!
}
  
  type LoginResponse {
  user: User!
  sessionToken: String!
}
  
type Query {
  getUserProfile: User
}

`;

export default typeDefs;
