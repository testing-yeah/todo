interface user {
  email: string,
  password: string
}

export interface LoginResponse {
  token: string,
  user: object
}

export async function loginUser(newUser: user) {
  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: newUser.email, password: newUser.password }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Login Successful:', data);
    return data;
  } catch (error) {
    console.error('Login Failed:', error);
  }
}
