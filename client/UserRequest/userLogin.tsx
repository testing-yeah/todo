import axios from "axios";
interface user {
    emailOrUsername: string,
    password: string
}

export interface LoginResponse {
    token: string,
    user: object
}

export async function loginUser(userData: user) {
    try {
        await axios.post('http://localhost:5000/auth/login', { emailOrUsername: userData.emailOrUsername, password: userData.password }, {
            headers: {
                'Content-Type': 'application/json',
            }, withCredentials: true
        })
            .then((response) => {
                localStorage.setItem('userData', JSON.stringify(response.data.userData))
            })
            .catch((error) => {
                alert(error)
            });
    } catch (error) {
        console.error('Login Failed:', error);
    }
}
