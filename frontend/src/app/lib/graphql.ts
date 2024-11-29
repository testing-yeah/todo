import { gql } from "@apollo/client";

// Register mutation
export const REGISTER_USER = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $username: String!
  ) {
    register(email: $email, password: $password, username: $username) {
      id
      email
      username
    }
  }
`;

export interface RegisterUserResponse {
  register: {
    id: string;
    email: string;
    username: string;
  };
}

export interface RegisterUserVariables {
  email: string;
  password: string;
  username: string;
}

// Login mutation
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export interface LoginUserResponse {
  login: string;
}

export interface LoginUserVariables {
  email: string;
  password: string;
}

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logout
  }
`;

export interface LogoutUserResponse {
  logout: boolean;
}

// Add Todo mutation
export const ADD_TODO_LIST = gql`
  mutation AddTodo(
    $userId: Int!
    $title: String!
    $description: String!
    $completed: Boolean
  ) {
    addTodo(
      userId: $userId
      title: $title
      description: $description
      completed: $completed
    ) {
      id
      title
      description
      completed
      createdAt
      updatedAt
      userId
    }
  }
`;

export interface AddTodoResponse {
  addTodo: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
  };
}

export interface AddTodoVariables {
  userId: number;
  title: string;
  description: string;
  completed?: boolean;
}

// all Todo data
export const GET_USER_TODOS = gql`
  query GetUserTodos($userId: Int!) {
    getUserTodos(userId: $userId) {
      id
      title
      description
      createdAt
    }
  }
`;

export interface GetUserTodosResponse {
  getUserTodos: {
    id: number;
    title: string;
    description: string;
    createdAt: string;
  }[];
}

export interface GetUserTodosVariables {
  userId: number;
}

// Edit Todo mutation
export const EDIT_TODO = gql`
  mutation EditTodo(
    $id: Int!
    $userId: Int!
    $title: String
    $description: String
    $completed: Boolean
  ) {
    editTodo(
      id: $id
      userId: $userId
      title: $title
      description: $description
      completed: $completed
    ) {
      id
      title
      description
      completed
      updatedAt
      userId
    }
  }
`;

export interface EditTodoResponse {
  editTodo: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    updatedAt: string;
    userId: number;
  };
}

export interface EditTodoVariables {
  id: number;
  userId: number;
  title?: string;
  description?: string;
  completed?: boolean;
}

// Delete Todo mutation
export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!, $userId: Int!) {
    deleteTodo(id: $id, userId: $userId)
  }
`;

export interface DeleteTodoResponse {
  deleteTodo: boolean;
}

export interface DeleteTodoVariables {
  id: number;
  userId: number;
}
