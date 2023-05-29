import type { ResolverFn } from "../../../../typing";
import type { ReturnMessage } from "./lastMessage";

interface Args {
  input: {
    chatId: string;
    limit: number;
    offset: number;
  };
}

interface ReturnMessages {
  totalItems: number;
  results: ReturnMessage[];
}

const messages: ResolverFn<Args, ReturnMessages> = async (_, args, ctx) => {
  try {
    const { chatId, limit = 10000, offset = 0 } = args.input;

    // const key = `messages-${chatId}?offset=${offset}&limit=${limit}`;

    // getting cache friend-request from redis if available
    // const redisCache = await redisGet<ReturnMessages>(key);

    // if redis cache is available
    // if (redisCache) return redisCache;

    const where = { chatId: chatId };

    // finding messages with the provided chatId
    const messages = await ctx.db.messages.findMany({
      where,
      skip: offset,
      take: -limit,
      orderBy: { createdAt: "asc" },
      include: { media: true, reactions: true },
    });

    // getting total length of messages with the provided chatId
    const totalItems = await ctx.db.messages.count({ where });

    const returnResult = {
      totalItems,
      results: messages,
    };

    // cache data to redis
    // await ctx.redis.setex(key, 3600, JSON.stringify(returnResult));

    // returning total length of messages and list of messages
    return returnResult;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default messages;
