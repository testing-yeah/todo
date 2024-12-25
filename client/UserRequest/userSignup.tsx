import axios from 'axios';

interface formData {
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string
}

export interface LoginResponse {
    token: string,
    user: object
}

export async function userSignUp(userData: formData) {
    try {
        await axios.post('http://localhost:5000/auth/signup', userData, {
            headers: {
                'Content-Type': 'application/json',
            }, withCredentials: true,
        })
            .then((response) => {
                localStorage.setItem('userData', JSON.stringify(response.data.userData))
            })
            .catch((error) => {
                console.error('SignUp Failed:', error);
            });

    } catch (error) {
        console.error('Login Failed:', error);
    }
}
