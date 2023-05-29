import { mergeTypeDefs } from "@graphql-tools/merge";
import { gql } from "graphql-tag";
import authTypes from "./auth.types";
import chatsType from "./chats.types";
import customTypes from "./custom.types";
import FriendRequestTypes from "./friend-request.types";
import friendsTypes from "./friends.types";
import groupMessagesTypes from "./group-messages.types";
import meetingTypes from "./meetings.types";
import messagesType from "./messages.types";
import userTypes from "./user.types";
import { DateTimeTypeDefinition } from "graphql-scalars";

var rootTypes = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;

const types = [
  rootTypes,
  authTypes,
  userTypes,
  customTypes,
  FriendRequestTypes,
  friendsTypes,
  messagesType,
  groupMessagesTypes,
  chatsType,
  meetingTypes,
  DateTimeTypeDefinition
];

export default mergeTypeDefs(types);
