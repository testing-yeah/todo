export const LOGIN_USER = `mutation loginUser($username: String!,$email: String!, $password: String!) {
                    loginUser(username : $username, email: $email, password: $password) {
                      userData {
                        user_id
                        username
                        email
                      }
                      refreshToken
                      accessToken
                    }
                  }`

export const GET_USER = `
             mutation GetUser($user_id: ID!) {
            GetUser(user_id: $user_id) {
                        user_id
                        username
                        email
                        first_name,
                        last_name,
            }
}

`

export const CREATE_USER = ` 
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
`