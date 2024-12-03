

export const GET_USER = `
                query GetUser {
                    getUserProfile {
                        id
                        username
                        email
                    }
                }`

export const LOGIN_USER = `
                mutation loginUser($email: String!, $password: String!) {
                  loginUser(email: $email, password: $password) {
                    user {
                      id
                      username
                      email
                    }
                  }
                }
              `;


export const SIGN_UP_MUTATION = `
              mutation createUser($username:String!,$email:String!,$password:String!){
                createUser(username: $username, email: $email, password: $password){
                id
                username
                email
                }
              }
            `