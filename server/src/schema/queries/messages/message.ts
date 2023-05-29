import type { ResolverFn } from "../../../../typing";
import { NotFoundException } from "../../../helper/exceptions";
import redisGet from "../../../helper/redisGet";
import type { ReturnMessage } from "./lastMessage";

interface Args {
  input: {
    chatId: string;
    messageId: string;
  };
}
const message: ResolverFn<Args, ReturnMessage> = async (_, args, ctx) => {
  try {
    const { chatId, messageId } = args.input;

    const key = `message:${messageId}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ReturnMessage>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // finding message with provided chatId and messageId
    const message = await ctx.db.messages.findFirst({
      where: { id: messageId, chatId },
      include: { media: true, reactions: true },
    });

    // throw error if message was not found
    if (!message)
      throw NotFoundException(`Message with message id ${messageId} not found`);

    // cache message to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(message));

    // returning found message
    return message;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default message;
