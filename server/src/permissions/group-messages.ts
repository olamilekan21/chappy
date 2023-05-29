import type { ChatsUser } from "@prisma/client";
import { and, inputRule, rule } from "graphql-shield";
import type { Context } from "../../typing";
import redisGet from "../helper/redisGet";
import { isAuthenticated } from "./auth";

interface isGroupAdminArgs {
  input: { chatId: string };
}

const isGroupAdmin = rule()(
  async (_: any, args: isGroupAdminArgs, ctx: Context) => {
    const key = `group-admin-${args.input.chatId}?uid=${ctx.user?.id}`;

    /// getting cache friend-request from redis if available
    const redisCache = await redisGet<ChatsUser>(key);

    // if redis cache is available
    if (redisCache) return !!redisCache;

    const isAdmin = await ctx.db.chatsUser.findFirst({
      where: { chatsId: args.input.chatId, uid: ctx.user?.id, admin: true },
    });

    await ctx.redis.setex(key, 3600, JSON.stringify(isAdmin));

    return !!isAdmin;
  }
);

const createGroupInput = inputRule()((yup) =>
  yup
    .object({
      input: yup
        .object({
          name: yup.string().required(),
          visibility: yup.string().oneOf(["public", "private"]).required(),
          users: yup.array().of(yup.string().uuid().required()).required(),
        })
        .required(),
    })
    .required()
);

const createGroupMessageInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      chatId: yup.string().length(21).required(),
      type: yup
        .string()
        .oneOf([
          "text",
          "media",
          "audio",
          "file",
          "voicenote",
          "mediacaption",
          "voicenotecaption",
          "textcaption",
        ])
        .required(),
      message: yup.string().optional(),
      captionRef: yup.string().optional().uuid(),
      gifs: yup.string().optional(),
      sticker: yup.string().optional(),
      media: yup
        .array()
        .of(
          yup.object({
            type: yup.string().oneOf(["image", "video", "audio"]).required(),
            url: yup.string().required(),
          })
        )
        .optional(),
    }),
  })
);

const updateGroupInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      id: yup.string().uuid().required(),
      blocked: yup.boolean().nullable().optional(),
      archive: yup.boolean().nullable().optional(),
      pinned: yup.boolean().nullable().optional(),
    }),
  })
);

const leaveGroupInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      ids: yup.array().of(yup.string().uuid().required()).nullable(),
      chatId: yup.string().length(21).required(),
    }),
  })
);

const addParticipantsInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      chatId: yup.string().length(21).required(),
      users: yup.array().of(yup.string().uuid().required()).required(),
    }),
  })
);

const updateAdminInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      chatId: yup.string().length(21).required(),
      uid: yup.string().uuid().required(),
      admin: yup.boolean().required(),
    }),
  })
);

const removeParticipantInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      chatId: yup.string().length(21).required(),
      uid: yup.string().uuid().required(),
    }),
  })
);

const editGroupInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      chatId: yup.string().length(21).required(),
      visibility: yup.string().oneOf(["public", "private"]).nullable(),
      name: yup.string().nullable(),
      image: yup.string().nullable(),
      description: yup.string().nullable(),
    }),
  })
);

const groupMessagesQuery = {};
const groupMessagesMutation = {
  createGroup: and(isAuthenticated, createGroupInput),
  createGroupMessage: and(isAuthenticated, createGroupMessageInput),
  updateGroup: and(isAuthenticated, updateGroupInput, isGroupAdmin),
  leaveGroup: and(isAuthenticated, leaveGroupInput),
  addParticipants: and(isAuthenticated, addParticipantsInput, isGroupAdmin),
  removeParticipant: and(isAuthenticated, removeParticipantInput, isGroupAdmin),
  updateAdmin: and(isAuthenticated, updateAdminInput, isGroupAdmin),
  editGroup: and(isAuthenticated, editGroupInput, isGroupAdmin),
};

export { groupMessagesMutation, groupMessagesQuery };
