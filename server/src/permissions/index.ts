import { deny, shield } from "graphql-shield";
import { merge } from "lodash";
import { authMutation } from "./auth";
import { chatsQuery } from "./chats";
import { friendRequestMuataion, friendRequestQuery } from "./friend-request";
import { friendsMutation, friendsQuery } from "./friends";
import { groupMessagesMutation } from "./group-messages";
import { meetingsMutation, meetingsQuery } from "./meetings";
import { messagesMutation, messagesQuery } from "./messages";
import { userMutation, userQuery } from "./user";

const permissions = shield(
  {
    Query: merge(
      { "*": deny },
      userQuery,
      friendRequestQuery,
      friendsQuery,
      chatsQuery,
      messagesQuery,
      meetingsQuery
    ),
    Mutation: merge(
      { "*": deny },
      authMutation,
      friendRequestMuataion,
      friendsMutation,
      messagesMutation,
      userMutation,
      groupMessagesMutation,
      meetingsMutation
    ),
  },
  {
    allowExternalErrors: true,
  }
);

export default permissions;
