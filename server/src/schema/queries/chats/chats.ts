import type {
  Chats,
  ChatsUser,
  Friends,
  Groups,
  Media,
  Reaction,
  messages,
} from "@prisma/client";
import type { ResolverFn } from "../../../../typing";
import { prisma } from "../../../context";
import clean from "../../../helper/clean";
import redisGet from "../../../helper/redisGet";
import type { UserType } from "../../../transforms/userTransform";
import { findUser, getMessages } from "./../../../transforms/transformChats";

interface Args {
  input: {
    offset: number;
    limit: number;
    archive: boolean;
  };
}

interface ReturnValue {
  totalItems: number;
  results: ReturnChats[];
}

interface Messages extends messages {
  reactions: Reaction[];
  media: Media[];
}

export interface ReturnChats extends Chats {
  pinned: boolean;
  blocked: boolean;
  archive: boolean;
  user?: UserType | null;
  users?: ChatsUser[];
  messages: Messages[];
}

const chats: ResolverFn<Args, ReturnValue> = async (_, args, ctx) => {
  try {
    const { limit, offset, archive } = args.input;

    const { user, redis } = ctx;
    const uid = user?.id!;
    const key = `chats:${uid}?limit=${limit}&offset=${offset}&archive=${archive}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // if no redis chats is available

    const results = await getChats({ uid, archive });

    const totalItems = results.length;

    const data = {
      results:
        offset && limit ? results.slice(offset, limit + offset) : results,
      totalItems,
    };

    await redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

interface GetChatsArgs {
  uid: string;
  archive?: boolean;
}

export const getChats = async (args: GetChatsArgs) => {
  const { uid, archive } = args;

  const chats = await prisma.chats.findMany({
    where: { users: { some: { uid: { equals: uid } } } },
    include: {
      messages: {
        where: { AND: { seen: false, senderId: { not: uid } } },
        orderBy: { createdAt: "desc" },
        include: { reactions: true, media: true },
      },
      users: true,
    },
  });

  const results = await transformChats({ chats, archive, uid });

  const sortResults = [...results].sort((a, b) => {
    const pinnedA = a.pinned ? 1 : 0,
      pinnedB = b.pinned ? 1 : 0;
    return pinnedB - pinnedA;
  });

  return sortResults;
};

interface ChatsType extends Chats {
  users: ChatsUser[];
  messages: (messages & {
    reactions: Reaction[];
    media: Media[];
  })[];
}

interface TransformArgs {
  chats: ChatsType[];
  archive?: boolean | null;
  uid: string;
}

export const transformChats = async (
  args: TransformArgs
): Promise<ReturnChats[]> => {
  const { chats, archive, uid } = args;

  const results: ReturnChats[] = [];

  for (let i = 0; i < chats.length; i++) {
    const chat = chats[i];

    const item = await getDetails({
      type: chat.type,
      chatId: chat.id,
      uid,
      archive,
    });

    if (item) {
      const user = (item as Friends).friendId
        ? await findUser((item as Friends).friendId)
        : null;

      const messages = chat
        ? chat?.messages.length > 0
          ? chat.messages
          : await getMessages(chat.id!)
        : [];

      results.push({
        ...chat,
        pinned: item.pinned,
        blocked: item.blocked,
        archive: item.archive,
        user,
        messages,
      });
    }
  }

  return results;
};

interface DetailsType {
  type: "group" | "chat";
  chatId: string;
  archive?: boolean | null;
  uid: string;
}

const getDetails = async (
  args: DetailsType
): Promise<Friends | Groups | null> => {
  const { chatId, archive, type, uid } = args;
  let where = clean({ chatId, usersId: uid, archive });

  if (type === "chat") return await prisma.friends.findFirst({ where });
  else return await prisma.groups.findFirst({ where });
};
export default chats;
