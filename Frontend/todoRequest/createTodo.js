import { TODO_MUTATION } from "../graphQL/getQueryGql/getTodo";

export async function createTodo({ title, description, token }) {
    const response = await fetch(`http://localhost:8000/graphql`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `${token}` : '',
        },
        body: JSON.stringify({
            query: TODO_MUTATION,
            variables: {
                title, description
            },
        }),
    });


    if (!response.ok) {
        throw new Error('Error To Sending Request For Create Todo')
    }

    const result = await response.json()
    console.log(result)
    if (result.errors) {
        throw new Error('GraphQL errors occurred')
    }

    return result.data
}