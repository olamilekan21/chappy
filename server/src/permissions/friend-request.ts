import { and, inputRule } from "graphql-shield";
import { isAuthenticated } from "./auth";

const isUUID = inputRule()((yup) =>
  yup.object({
    uid: yup.string().uuid().required(),
  })
);

const removeFriendRequestInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      uid: yup.string().uuid().required(),
      type: yup.string().oneOf(["sent", "received"]),
    }),
  })
);

const friendRequestQuery = {
  friendRequests: isAuthenticated,
};
const friendRequestMuataion = {
  createFriendRequest: and(isAuthenticated, isUUID),
  acceptFriendRequest: and(isAuthenticated, isUUID),
  removeFriendRequest: and(isAuthenticated, removeFriendRequestInput),
};

export { friendRequestMuataion, friendRequestQuery, isUUID };
