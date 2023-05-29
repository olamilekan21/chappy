import type { ResolverFn } from "../../../../typing";
import { NotFoundException } from "../../../helper/exceptions";
import redisGet from "../../../helper/redisGet";
import transformChats, { ChatType } from "../../../transforms/transformChats";

interface Args {
  chatId: string;
}
const chat: ResolverFn<Args, ChatType | undefined> = async (_, args, ctx) => {
  try {
    const { chatId } = args;

    const key = `chat:${chatId}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ChatType>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // finding chat with the provided chatId
    const chat = await ctx.db.chats.findUnique({
      where: { id: chatId },
      include: {
        users: true,
        messages: { take: -1, include: { reactions: true, media: true } },
      },
    });

    // throw error if no chat was found
    if (!chat) throw NotFoundException(`Chat with #${chatId} not found`);

    // transforming the found chat
    const results = (await transformChats([chat], ctx.user?.id!))[0];

    // caching the result in redis
    await ctx.redis.setex(key, 3600, JSON.stringify(results));

    return results;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default chat;
