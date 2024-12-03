

export default async function getTodo(token: string) {
    const response = await fetch('http://localhost:8000/api/gettodo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            token
        ),
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

