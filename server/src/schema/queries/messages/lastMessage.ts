import type { Media, Reaction, messages } from "@prisma/client";
import type { ResolverFn } from "../../../../typing";
import redisGet from "../../../helper/redisGet";

interface Args {
  chatId: string;
}

export interface ReturnMessage extends messages {
  media: Media[];
  reactions: Reaction[];
}
const lastMessage: ResolverFn<Args, ReturnMessage> = async (_, args, ctx) => {
  try {
    const { chatId } = args;

    const key = `last-message:${chatId}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ReturnMessage>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // finding last message
    const messages = await ctx.db.messages.findMany({
      where: { chatId },
      take: -1,
      include: { media: true, reactions: true },
      orderBy: { createdAt: "asc" },
    });

    // cache message to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(messages[0]));

    // returning last message
    return messages[0];
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default lastMessage;
