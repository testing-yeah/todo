import { gql } from 'apollo-server';
const typeDefs = gql `
  scalar DateTime

  type User {
    id: ID!
    username: String!
    imageUrl: String
    email: String!
    password: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    todos: [Todo!]!
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
    getUserProfile: User

    todos: [Todo!]!
    todo(id: ID!): Todo
    getTodoByUser: [Todo!]!
  }

 type Mutation {
  createUser(username: String!, email: String!, password: String!): User!
  loginUser(email: String!, password: String!): LoginResponse!
  createTodo(title: String!, description: String!): Todo!
  updateTodo(id: ID!,title: String!,description:String!,completed:Boolean!): Todo!
  deleteTodo(id: ID!): Boolean!
  getTodoById(id:ID!):Todo!
  completedTodo(id:ID!,completed:Boolean!):Todo!
 }
  
  type LoginResponse {
    user: User!
    token: String!
  }`;
export default typeDefs;
