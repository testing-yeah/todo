import { UPDATE_TODO } from "../graphQL/getQueryGql/getTodo";

interface todoForm {
    id: string,
    title: string,
    description: string,
    completed: string,
    token: string
}

export async function editTodoFun({ id, title, description, completed, token }: todoForm) {
    console.log(id)
    const response = await fetch(`http://localhost:8000/graphql`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `${token}` : ''
        },
        body: JSON.stringify({
            query: UPDATE_TODO,
            variables: {
                id,
                title,
                description,
                completed
            }
        })
    })

    if (!response.ok) {
        throw new Error('error to update todo fetch err')
    }

    const result = await response.json()

    if (result.errors) {
        throw new Error('Error in grapql')
    }

    return result.data
}