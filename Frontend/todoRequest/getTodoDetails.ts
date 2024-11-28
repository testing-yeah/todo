import { GET_TODO_BYID } from "../graphQL/getQueryGql/getTodo";

interface GetTodoDetailsParams {
    id: string;
    token: string;
}

interface TodoResponse {
    getTodoById: {
        id: string;
        title: string;
        description: string;
        completed: boolean;
    }
}

export async function getTodoDetails({ id, token }: GetTodoDetailsParams): Promise<TodoResponse> {
    const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `${token}` : '',
        },
        body: JSON.stringify({
            query: GET_TODO_BYID,
            variables: { id }
        })
    });

    if (!response.ok) {
        throw new Error("Error fetching details from API");
    }

    const result = await response.json();

    if (result.errors) {
        throw new Error('Error in GraphQL query');
    }

    return result.data;  // Ensure this matches the shape of TodoResponse
}
