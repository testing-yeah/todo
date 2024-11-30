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
export const addTodoMut = gql`
  mutation addTodo(
    $title: String!
    $description: String!
    $completed: Boolean!
    $token: String!
  ) {
    addTodo(
      title: $title
      description: $description
      completed: $completed
      token: $token
    ) {
      id
      title
      description
      createdAt
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
  query GetUserTodos($userId: String!) {
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

// Delete Todo mutation
export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!, $token: String!) {
    deleteTodo(id: $id, token: $token)
  }
`;

export interface DeleteTodoResponse {
  deleteTodo: boolean;
}

export interface DeleteTodoVariables {
  id: number;
  token: string;
}

// Edit Todo mutation
export const EDIT_TODO = gql`
  mutation EditTodo(
    $id: Int!
    $token: String!
    $title: String
    $description: String
    $completed: Boolean
  ) {
    editTodo(
      id: $id
      token: $token
      title: $title
      description: $description
      completed: $completed
    ) {
      id
      title
      description
      completed
      updatedAt
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
  };
}

export interface EditTodoVariables {
  id: number;
  token: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

// Get Todo by ID query
export const GET_TODO_BY_ID = gql`
  query GetTodoById($id: Int!) {
    getTodoById(id: $id) {
      id
      title
      description
      completed
      createdAt
      updatedAt
    }
  }
`;

export interface GetTodoByIdResponse {
  getTodoById: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetTodoByIdVariables {
  id: number;
}
