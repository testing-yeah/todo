import axios from "axios";

export const getTasks = async () => {
    const userId = JSON.parse(localStorage.getItem('userData') as string).user_id;
    const response = await axios.post(
        'http://localhost:5000/todo/todos',
        { userId },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
    );
    return response.data;
};
