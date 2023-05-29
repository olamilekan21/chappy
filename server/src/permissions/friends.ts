import { and, inputRule } from "graphql-shield";
import { isAuthenticated } from "./auth";
import { isPagination } from "./user";

const updateFriendInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      friendId: yup.string().uuid().required(),
      blocked: yup.boolean().nullable().optional(),
      archive: yup.boolean().nullable().optional(),
      pinned: yup.boolean().nullable().optional(),
    }),
  })
);

const unFriendInput = inputRule()((yup) =>
  yup.object({
    uid: yup.string().uuid().required(),
    deleteChat: yup.boolean().default(false),
    chatId: yup.string().uuid().required(),
  })
);

const friendsInput = inputRule()((yup) =>
  yup.object({
    uid: yup.string().uuid().optional(),
    offset: yup.number().integer().optional(),
    limit: yup.number().integer().optional(),
  })
);

const friendsSearchInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      search: yup.string().required(),
      offset: yup.number().integer().optional(),
      limit: yup.number().integer().optional(),
    }),
  })
);


const friendsQuery = {
  friends: and(isAuthenticated, friendsInput),
  blockedFriends: and(isAuthenticated),
  friendsSearch: and(isAuthenticated, friendsSearchInput),
  suggestions: and(isAuthenticated, isPagination),
  suggestionSearch: and(isAuthenticated, friendsSearchInput),
};
const friendsMutation = {
  unFriend: and(isAuthenticated, unFriendInput),
  updateFriend: and(isAuthenticated, updateFriendInput),
};
export { friendsMutation, friendsQuery };
