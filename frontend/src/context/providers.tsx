"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    createHttpLink,
    from,
    split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "graphql-ws";

const queryClient = new QueryClient();

interface ApolloProviderCompoProps {
    children: ReactNode;
}

const ApolloProviderCompo: React.FC<ApolloProviderCompoProps> = ({
    children,
}) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("token");
            setToken(storedToken);
        }
    }, []);

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

    const authLink = setContext((_, { headers }) => ({
        headers: {
            ...headers,
            Authorization: token ? `${token}` : undefined,
        },
    }));

    const httpLink = createHttpLink({
        uri: "http://localhost:8000/graphql",
    });

    const wsLink = new GraphQLWsLink(
        createClient({
            url: "ws://localhost:8000/graphql",
        })
    );

    const splitLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
            );
        },
        wsLink,
        httpLink
    );

    // Create the Apollo Client instance
    const client = new ApolloClient({
        link: from([errorLink, authLink.concat(splitLink)]),
        cache: new InMemoryCache(),
    });

    return (
        <QueryClientProvider client={queryClient}>
            <ApolloProvider client={client}>{children}</ApolloProvider>
        </QueryClientProvider>
    );
};

export default ApolloProviderCompo;
