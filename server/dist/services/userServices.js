"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
exports.getUser = getUser;
exports.createUser = createUser;
const getUser_1 = require("../GraphQL/GetUsetGQL/getUser");
async function loginUser(userData) {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: getUser_1.LOGIN_USER,
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
    }
    catch (error) {
        console.error(error);
    }
}
async function getUser(user_id) {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: getUser_1.GET_USER,
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
        console.error(error);
    }
}
async function createUser(userData) {
    const response = await fetch(`http://localhost:5000/graphql`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: getUser_1.CREATE_USER,
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
