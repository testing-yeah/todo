interface CreateTodo {
    title: string;
    description: string;
    token: string;
}

export interface CreateTodoResponse {
    title: string;
    description: string;
    completed: boolean;
}

export async function createTodo({ title, description, token }: CreateTodo): Promise<CreateTodoResponse> {
    const API_URL = 'http://localhost:8000/api/createtodo';

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `${token}` : '',
        },
        body: JSON.stringify({
            title,
            description,
            token,
        }),
    });

    if (!response.ok) {
        const errorMessage = `Error creating todo: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.errors) {
        throw new Error(`API Error: ${result.errors[0]?.message || 'Unknown error'}`);
    }

    return result.data as CreateTodoResponse;
}
