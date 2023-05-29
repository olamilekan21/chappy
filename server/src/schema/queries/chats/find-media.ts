import type { Media } from "@prisma/client";
import type { ResolverFn } from "../../../../typing";
import redisGet from "../../../helper/redisGet";

interface Args {
  chatId: string;
}
const findMedia: ResolverFn<Args, Media[]> = async (_, args, ctx) => {
  try {
    const { chatId } = args;

    const key = `find-media:${chatId}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<Media[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    //  finding media in chat
    const messages = await ctx.db.messages.findMany({
      where: { chatId },
      select: { media: true },
    });

    const results: Media[] = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (message.media) results.push(...message.media);
    }

    // cache results to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(results));

    return results;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default findMedia;
