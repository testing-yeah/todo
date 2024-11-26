import { DELETE_TODO_MUTATION } from "../graphQL/getQueryGql/getTodo";

export async function deleteTodo({ id, token }) {
    const response = await fetch(`http://localhost:8000/graphql`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `${token}` : '',
        },
        body: JSON.stringify({
            query: DELETE_TODO_MUTATION,
            variables: { id }
        })
    })

    if (!response.ok) {
        throw new Error('Error To Send Reuqest For Delete Todo')
    }

    const result = await response.json()

    return true
}