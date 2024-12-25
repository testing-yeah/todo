"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_USER = exports.GET_USER = exports.LOGIN_USER = void 0;
exports.LOGIN_USER = `mutation loginUser($username: String!,$email: String!, $password: String!) {
                    loginUser(username : $username, email: $email, password: $password) {
                      userData {
                        user_id
                        username
                        email
                      }
                      refreshToken
                      accessToken
                    }
                  }`;
exports.GET_USER = `
             mutation GetUser($user_id: ID!) {
            GetUser(user_id: $user_id) {
                        user_id
                        username
                        email
                        first_name,
                        last_name,
            }
}

`;
exports.CREATE_USER = ` 
                mutation createUser($first_name: String!, $last_name: String!, $username: String!, $email: String!, $password: String!) {
                  createUser(first_name: $first_name,last_name: $last_name,username: $username,email: $email,password: $password) {
                    userData{
                      user_id
                      username
                      email
                    }
                      refreshToken
                      accessToken
                  }
                }
`;
