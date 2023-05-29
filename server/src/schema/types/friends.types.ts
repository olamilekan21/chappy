import { gql } from "graphql-tag";

const friendsTypes = gql`
  type Friends {
    totalItems: Int!
    results: [Friend!]!
  }

  type FriendsSearch {
    totalItems: Int!
    results: [Friend!]!
    search: String!
  }

  input RemoveFriendInput {
    uid: ID!
    deleteChat: Boolean!
    chatId: ID!
  }

  input FriendsInput {
    uid: ID
    offset: Int
    limit: Int
  }

  input FriendsSearchInput {
    uid: ID
    offset: Int
    limit: Int
    search: String!
  }

  type Suggestions {
    totalItems: Int!
    results: [User!]!
  }

  type SuggestionsSearch {
    totalItems: Int!
    results: [User!]!
    search: String!
  }

  input UpdateFriendInput {
    friendId: String!
    blocked: Boolean
    archive: Boolean
    pinned: Boolean
  }

  extend type Query {
    friends(input: FriendsInput!): Friends!
    blockedFriends: [Friend!]!
    friendsSearch(input: FriendsSearchInput!): FriendsSearch!
    suggestions(offset: Int, limit: Int): Suggestions!
    suggestionSearch(input: FriendsSearchInput!): SuggestionsSearch!
  }

  extend type Mutation {
    unFriend(input: RemoveFriendInput!): MsgType!
    updateFriend(input: UpdateFriendInput!): MsgType!
  }
`;
export default friendsTypes;
