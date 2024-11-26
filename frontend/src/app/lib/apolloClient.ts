import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// Create Apollo Client with explicit types
const createApolloClient = (): ApolloClient<InMemoryCache> => {
    return new ApolloClient({
        link: new HttpLink({
            uri: "http://localhost:8000/graphql",
            credentials: "include",
        }),
        cache: new InMemoryCache(),
    });
};

// Export the client instance with the correct type
export const client: ApolloClient<InMemoryCache> = createApolloClient();
