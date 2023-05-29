// import { NormalizedCacheObject } from './../../node_modules/@apollo/client/cache/inmemory/types.d';
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { type NormalizedCacheObject } from "@apollo/client/cache/inmemory/types";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { UserToken } from "../../typing";
import { key } from "../redux/features/userSlice";
import clean from "../utils/clean";
import { getStorage } from "../utils/localStorage";
import merge from "../utils/merge";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const httpLink = createUploadLink({
  uri: process.env.SERVER_URL,
  credentials: "include",
  headers: { "Apollo-Require-Preflight": "true" },
  fetchOptions: { credentials: "include" },
});

const authLink = setContext(async (_, { headers }) => {
  // get the authorization token from local storage

  const session = await getSession();

  const authorization = session
    ? `Bearer ${session?.user.accessToken}`
    : null;

  return {
    headers: clean({
      ...headers,
      authorization,
    }),
  };
});

const cache = new InMemoryCache();

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(httpLink),
    cache,
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}
