'use client';
import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, from, createHttpLink, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

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
        const token = Cookies.get('sessionId');
        return {
            headers: {
                ...headers,
                Authorization: token ? `${token}` : '',
            },
        };
    });

    const httpLink = createHttpLink({
        uri: 'http://localhost:8000/graphql',
    });

    const wsLink = new GraphQLWsLink(
        createClient({
            url: 'ws://localhost:8000/graphql',
        })
    );
    const splitLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        wsLink,
        httpLink
    );

    const client = new ApolloClient({
        link: from([errorLink, authLink.concat(splitLink)]),
        cache: new InMemoryCache(),
    });

    return (
        <QueryClientProvider client={queryClient}>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </QueryClientProvider>
    );
}

export default ApolloProviderCompo;
