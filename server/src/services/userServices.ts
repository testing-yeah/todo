import { CREATE_USER, GET_USER, LOGIN_USER } from "../GraphQL/GetUsetGQL/getUser";

interface userDataForLogin {
    emailOrUsername: string,
    password: string
}

interface userDataForSignUp {
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string
}

export async function loginUser(userData: userDataForLogin) {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: LOGIN_USER,
                variables: {
                    username: userData.emailOrUsername,
                    email: userData.emailOrUsername,
                    password: userData.password,
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        return result.data.loginUser;
    } catch (error) {
        console.error(error)
    }
}

export async function getUser(user_id: string) {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: GET_USER,
                variables: { user_id },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        return result.data.GetUser;
    }
    catch (error) {
        console.error(error)
    }
}
export async function createUser(userData: userDataForSignUp) {
    const response = await fetch(`http://localhost:5000/graphql`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: CREATE_USER,
            variables: {
                first_name: userData.first_name,
                last_name: userData.last_name,
                username: userData.username,
                email: userData.email,
                password: userData.password,
            },
        }),
    });
    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const result = await response.json();
    if (result.errors) {
        throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
    }
    return result.data.createUser;
}
