"use client";

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
import { createClient } from "graphql-ws";
import React, { ReactNode } from "react";

// Define the type for props
interface ApolloProviderCompoProps {
    children: ReactNode;
}

const ApolloProviderCompo: React.FC<ApolloProviderCompoProps> = ({
    children,
}) => {
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
        const token = localStorage.getItem("token");

        return {
            headers: {
                ...headers,
                Authorization: token ? `${token}` : undefined,
            },
        };
    });

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

    const client = new ApolloClient({
        link: from([errorLink, authLink.concat(splitLink)]),
        cache: new InMemoryCache(),
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderCompo;
