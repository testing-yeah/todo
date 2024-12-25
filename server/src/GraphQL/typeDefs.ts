import { gql } from 'apollo-server';

const typeDefs = gql`
scalar DateTime

type User {
  user_id: ID!
  username: String!
  email: String!
  first_name: String!
  last_name: String!
  password: String!
  refreshToken: String 
  Task: [Task!]!
  signedUpAt: DateTime!
}

type Task {
  task_id: ID!
  userId: String!
  title: String!
  task_description: String!
  dueDate: DateTime # Nullable field (matches Prisma schema)
  status: Status! # Enum type for status (matches Prisma schema)
  priority: Priority! # Enum type for priority (matches Prisma schema)
  createdAt: DateTime!
  updatedAt: DateTime!
  user: User!
}

type LoginResponse {
  userData: User!
  accessToken: String!
  refreshToken: String!
}
input UpdateTaskInput {
    title: String
    task_description: String
    dueDate: String
    status: String
    priority: String
    task_id : String
}

type Mutation {
  createUser(
    first_name: String!,
    last_name: String!,
    username: String!,
    email: String!,
    password: String!
  ): LoginResponse!
  GetUser(user_id: ID!): User!

  loginUser(username : String!,email: String!, password: String!): LoginResponse!
  
  createTodo(
    userId: String!
    title: String!
    task_description: String!
    dueDate: DateTime,
    priority: Priority!,
  ): Task!
  
  updateTask(task_id: String!, data: UpdateTaskInput!): Task!
  
  deleteTodo(task_id: String!): Task!
  completeTodo(task_id: String!): Task!
}

type Query {
  getTodos(userId: String!): [Task!]!
  getTodoById(task_id: String!): Task
}

enum Status {
  PENDING
  IN_PROGRESS
  COMPLETED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

`;

export default typeDefs;
