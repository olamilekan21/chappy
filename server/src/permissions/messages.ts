import type { ChatsUser } from "@prisma/client";
import { and, inputRule, rule } from "graphql-shield";
import type { Context } from "../../typing";
import redisGet from "../helper/redisGet";
import { isAuthenticated } from "./auth";

interface isParticipantArgs {
  input?: { chatId: string };
  chatId?: string;
}
const isParticipant = rule()(
  async (_: any, args: isParticipantArgs, ctx: Context) => {
    let chatId = args.input?.chatId ?? args.chatId;
    const key = `group-participant-${chatId}?uid=${ctx.user?.id}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ChatsUser>(key);

    // if redis cache is available
    if (redisCache) return !!redisCache;

    const participant = await ctx.db.chatsUser.findFirst({
      where: { chatsId: chatId, uid: ctx.user?.id },
    });

    await ctx.redis.setex(key, 3600, JSON.stringify(participant));

    return !!participant;
  }
);

const isChatId = inputRule()((yup) =>
  yup.object({
    chatId: yup.string().length(21).required(),
  })
);

const isMessageId = inputRule()((yup) =>
  yup.object({
    messageId: yup.string().uuid().required(),
  })
);

const messageInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      chatId: yup.string().length(21).required(),
      offset: yup.number().integer().optional(),
      limit: yup.number().integer().optional(),
    }),
  })
);

const createMessageInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      chatId: yup.string().length(21).required(),
      receiverId: yup.string().uuid().required(),
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

const addReactionInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      messageId: yup.string().uuid().required(),
      reaction: yup.string().required(),
    }),
  })
);

const messagesQuery = {
  messages: and(isAuthenticated, messageInput, isParticipant),
  message: and(isAuthenticated, messageInput, isParticipant),
  lastMessage: and(isAuthenticated, isChatId, isParticipant),
};
const messagesMutation = {
  createMessage: and(isAuthenticated, createMessageInput, isParticipant),
  messageSeen: and(isAuthenticated, isMessageId),
  deleteMessage: and(isAuthenticated, isMessageId),
  markMessagesAsRead: and(isAuthenticated, isChatId),
  addReaction: and(isAuthenticated, addReactionInput),
  removeReaction: and(isAuthenticated, addReactionInput),
  uploadFile: and(isAuthenticated),
  uploadFiles: and(isAuthenticated),
  uploadBlob: and(isAuthenticated),
};

export { messagesMutation, messagesQuery,isChatId };
