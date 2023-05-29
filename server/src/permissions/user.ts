import { and, inputRule } from "graphql-shield";
import { isAuthenticated } from "./auth";

const userInput = inputRule()((yup) =>
  yup.object({
    uid: yup.string().nullable(),
  })
);

const isPagination = inputRule()((yup) =>
  yup.object({
    offset: yup.number().integer().optional().nullable(),
    limit: yup.number().integer().optional().nullable(),
  })
);

const searchUsersInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      search: yup.string().required(),
      offset: yup.number().integer().optional(),
      limit: yup.number().integer().optional(),
    }),
  })
);

const updateUserInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      name: yup.string().min(5).nullable().optional(),
      displayName: yup
        .string()
        .min(3, "Must be 3 characters or higher")
        .max(20, "Must be 20 characters or less")
        .required(),
      bio: yup.string().max(140).nullable().optional(),
      photoURL: yup.string().nullable().optional(),
    }),
  })
);

const usersByIdInput = inputRule()((yup) =>
  yup.object({
    ids: yup.array().of(yup.string().uuid().required()).required(),
  })
);

const userQuery = {
  user: and(isAuthenticated, userInput),
  users: and(isAuthenticated, isPagination),
  usersById: and(isAuthenticated, usersByIdInput),
  searchUsers: and(isAuthenticated, searchUsersInput),
};
const userMutation = {
  updateUser: and(isAuthenticated, updateUserInput),
};

export { userQuery, userMutation, isPagination };
