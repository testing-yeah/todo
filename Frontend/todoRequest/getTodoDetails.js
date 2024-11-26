import { GET_TODO_BYID } from "../graphQL/getQueryGql/getTodo";

export async function getTodoDetails({ id, token }) {
    const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', Authorization: token ? `${token}` : '',
        },
        body: JSON.stringify({
            query: GET_TODO_BYID,
            variables: { id }
        })
    })

    if (!response.ok) {
        throw new Error("Error fetch details api erro")
    }

    const result = await response.json()

    if (result.errors) {
        throw new Error('Error IN graphql')
    }

    return result.data
}