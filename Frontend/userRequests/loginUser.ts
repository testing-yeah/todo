interface user {
  email: string,
  password: string
}

export async function loginUser(newUser: user) {
  const response = await fetch(`http://localhost:8000/graphql`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
                mutation loginUser($email: String!, $password: String!) {
                  loginUser(email: $email, password: $password) {
                    user {
                      id
                      username
                      email
                    }
                    token
                  }
                }
              `,
      variables: {
        email: newUser.email,
        password: newUser.password,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
  }

  return result.data.loginUser;
}
