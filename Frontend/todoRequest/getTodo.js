import { GET_TODO_QUERY } from '../graphQL/getQueryGql/getTodo';

export default async function getTodo(token) {
    const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `${token}` : '',
        },
        body: JSON.stringify({
            query: GET_TODO_QUERY,
        }),
    });

    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
        throw new Error('GraphQL errors occurred');
    }
    return result.data; // Return the data directly
}

