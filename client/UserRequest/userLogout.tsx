import axios from "axios";

export async function logout() {
    try {
        await axios.post('http://localhost:5000/auth/logout', { data: 'data' }, {
            headers: {
                'Content-Type': 'application/json',
            }, withCredentials: true
        })
            .then((response) => {
                localStorage.removeItem('userData')
            })
            .catch((error) => {
                console.error('Login Failed:', error);
            });
    } catch (error) {
        console.error('Logout Failed:', error);
    }
}
