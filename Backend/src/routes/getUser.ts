import { GET_USER } from "../graphQL/getUserGql/getUser.js";


interface userData {
    id: string,
    username: string,
    email: string
}

export async function getUser({ token }: any): Promise<userData> {
    const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `${token}` : '',
        },
        body: JSON.stringify({
            query: GET_USER,
        }),
    });

    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
        throw new Error('GraphQL errors occurred');
    }
    return result.data;
}

