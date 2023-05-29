import { and, inputRule } from "graphql-shield";
import { isAuthenticated } from "./auth";
import { isChatId } from "./messages";
import { isPagination } from "./user";

const chatsInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      offset: yup.number().integer().optional().nullable(),
      limit: yup.number().integer().optional().nullable(),
      archive: yup.boolean().nullable(),
    }),
  })
);

const chatsSearchInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      offset: yup.number().integer().optional().nullable(),
      limit: yup.number().integer().optional().nullable(),
      archive: yup.boolean().nullable(),
      search: yup.string().required(),
    }),
  })
);

const chatsQuery = {
  chat: and(isAuthenticated, isChatId),
  chats: and(isAuthenticated, chatsInput),
  chatsSearch: and(isAuthenticated, chatsSearchInput),
  findMedia: and(isAuthenticated, isChatId),
};
const chatsMutation = {};

export { chatsMutation, chatsQuery };
