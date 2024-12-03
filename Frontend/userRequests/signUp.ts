import { SIGN_UP_MUTATION } from "../graphQL/getUserGql/getUser"

interface formData {
    username: string,
    email: string,
    password: string
}

export async function signUpUser(newUser: formData) {
    try {
        const response = await fetch('http://localhost:8000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: newUser.username, email: newUser.email, password: newUser.password }),
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
