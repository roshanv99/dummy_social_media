import React from "react";
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, createHttpLink } from '@apollo/client';

// const httpLink = createHttpLink({
//     uri:'http://localhost:5000'
// });

const client = new ApolloClient({
    link:"http://localhost:5000",  //uri specifies the URL of our GraphQL server.
    cache: new InMemoryCache()
});

export default (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );