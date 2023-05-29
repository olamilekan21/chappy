import { gql } from "graphql-tag";

const FriendRequestTypes = gql`
  type MsgType {
    message: String!
  }

  type FriendRequest {
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
    type: RequestTypeEnum!
  }

  enum RequestTypeEnum {
    sent
    received
  }

  type FriendRequests {
    totalItems: Int!
    results: [FriendRequest!]!
  }

  input RemoveFriendRequestInput {
    uid: String!
    type: RequestTypeEnum!
  }

  extend type Query {
    friendRequests: FriendRequests!
  }

  extend type Mutation {
    createFriendRequest(uid: ID!): MsgType!
    acceptFriendRequest(uid: ID!): MsgType!
    removeFriendRequest(input: RemoveFriendRequestInput!): MsgType!
  }
`;
export default FriendRequestTypes;
