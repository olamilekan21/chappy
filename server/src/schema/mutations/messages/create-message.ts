import type { ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";
import type { ReturnCreateMessage } from "../group-messages/create-group-message";

export enum MessageTypeEnum {
  text = "text",
  media = "media",
  audio = "audio",
  file = "file",
  voicenote = "voicenote",
  textcaption = "textcaption",
}

export enum MediaTypeEnum {
  image = "image",
  video = "video",
  audio = "audio",
}

interface Media {
  type: MediaTypeEnum;
  url: string;
}

interface Args {
  input: {
    chatId: string;
    receiverId: string;
    type: MessageTypeEnum;
    message?: string;
    captionRef?: string;
    gifs?: string;
    sticker?: string;
    media?: Media[];
  };
}
const createMessage: ResolverFn<Args, ReturnCreateMessage> = async (
  _,
  args,
  ctx
) => {
  try {
    const { chatId, media, ...others } = args.input;
    const userId = ctx.user?.id!;

    //  removing null values
    const messageData = clean({ ...others });

    const data = clean({
      senderId: userId,
      ...messageData,
      media: media
        ? {
            createMany: {
              data: media,
            },
          }
        : null,
    }) as any;

    // creating new messages
    // const chat = await ctx.db.chats.update({
    //   where: {
    //     id: chatId,
    //   },

    //   data: {
    //     messages: {
    //       create: data,
    //     },
    //   },

    //   include: {
    //     messages: {
    //       orderBy: {
    //         createdAt: "asc",
    //       },
    //       include: {
    //         media: true,
    //         reactions: true,
    //       },
    //     },
    //   },
    // });

    const message = await ctx.db.messages.create({
      data: { chatId, ...data, },
      include: { media: true, reactions: true },
    });

    // getting the last message
    // const lastMessage = chat.messages[chat.messages.length - 1];

    // returning the last message
    return message as any;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default createMessage;
