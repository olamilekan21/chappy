import { gql } from "graphql-tag";

const userTypes = gql`
  type Friend {
    id: ID!
    friendId: String!
    chatId: String!
    pinned: Boolean!
    archive: Boolean!
    blocked: Boolean!
    disabled: Boolean!
    createdAt: DateTime!
    user: User!
  }

  type Group {
    id: ID!
    chatId: String!
    pinned: Boolean!
    archive: Boolean!
    blocked: Boolean!
    disabled: Boolean!
    createdAt: DateTime!
  }

  type User {
    uid: String!
    email: String!
    name: String
    displayName: String!
    photoURL: String
    bio: String
    gender: Gender
    birthday: DateTime
    createdAt: DateTime!
    friends: [Friend!]!
    groups: [Group!]!
  }

  type Users {
    totalItems: Int!
    results: [User!]!
  }

  type SearchUser {
    uid: String!
    email: String!
    name: String
    displayName: String!
    photoURL: String
    coverURL: String
    bio: String
    gender: Gender
    birthday: String
    createdAt: DateTime!
    type: RequestTypeEnum
    isFriend: Boolean
    chatId: String
  }

  type UserSearch {
    totalItems: Int!
    results: [SearchUser!]!
    search: String!
  }

  input UpdateUserInput {
    name: String
    bio: String
    displayName: String!
    photoURL: String
  }

  input SearchUserInput {
    search: String!
    offset: Int
    limit: Int
  }

  extend type Query {
    user(uid: ID): User
    users(offset: Int = 0, limit: Int = 10): Users!
    usersById(ids: [ID!]!): [User!]!
    searchUsers(input: SearchUserInput!): UserSearch!
  }

  extend type Mutation {
    updateUser(input: UpdateUserInput!): MsgType!
  }
`;
export default userTypes;
