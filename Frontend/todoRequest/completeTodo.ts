import { COMPLETE_TODO } from "../graphQL/getQueryGql/getTodo"

interface todoData {
    id: string,
    completed: boolean
    token: string
}

export async function completeTodo({ id, completed, token }: todoData) {
    try {
        const response = await fetch(`http://localhost:8000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `${token}` : ''
            },
            body: JSON.stringify({
                query: COMPLETE_TODO,
                variables: {
                    id,
                    completed,
                }
            })
        })

        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.log('Error to fetch request for complete todo', error)
    }
}