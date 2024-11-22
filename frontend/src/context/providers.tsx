'use client';
import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

function ApolloProviderCompo({ children }) {
    const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) =>
                console.error(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                )
            );
        }
        if (networkError) {
            console.error(`[Network error]: ${networkError}`);
        }
    });

    const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                ...headers,
                Authorization: token ? `Bearer ${token}` : '',
            },
        };
    });

    const httpLink = new HttpLink({
        uri: 'http://localhost:8000/graphql',
    });

    const client = new ApolloClient({
        link: from([errorLink, authLink.concat(httpLink)]),
        cache: new InMemoryCache(),
    });

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}

export default ApolloProviderCompo;