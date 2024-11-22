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
    token: string;
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
    login(email: $email, password: $password){
      id
      email
      token
    }
  }
`;


export interface LoginUserResponse {
  login: {
    id: string;
    email: string;
    token: string;
  };
}

export interface LoginUserVariables {
  email: string;
  password: string;
}
