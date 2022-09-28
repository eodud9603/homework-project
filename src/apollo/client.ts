import { ApolloClient, createHttpLink } from "@apollo/client";
import { cache } from "apollo/cache";

const httpLink = createHttpLink({
  uri: "https://fysj8sct26.execute-api.ap-northeast-2.amazonaws.com/production/graphql",
});

export const client = new ApolloClient({
  link: httpLink,
  cache: cache,
});
