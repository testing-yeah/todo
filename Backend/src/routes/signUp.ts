import { SIGN_UP_MUTATION } from "../graphQL/getUserGql/getUser.js"


interface formData {
    username: string,
    email: string,
    password: string
}

export async function signUpUser({ username, email, password }: formData) {
    try {
        const response = fetch('http://localhost:8000/graphql', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: SIGN_UP_MUTATION,
                variables: {
                    username,
                    email,
                    password
                }
            })
        })

        const data = (await response).json()
        console.log(data)
    } catch (err) {
        console.log('Error creating user SignUp', err)
    }
}