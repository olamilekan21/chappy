import type { ResolverFn } from "../../../../typing";
import redisGet from "../../../helper/redisGet";
import { FriendType, formatFriends } from "./friends";

const blockedFriends: ResolverFn<any, FriendType[]> = async (_, args, ctx) => {
  try {
    const userId = ctx.user?.id;

    let key = `friends-block:${userId}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<FriendType[]>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // finding authenticated user friends which are blocked
    const friends = await ctx.db.friends.findMany({
      where: { usersId: userId, blocked: true },
    });

    // formatting blocked friends
    const newFriends = await formatFriends(friends);

    // caching data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(newFriends));

    // returning formatted friends
    return newFriends;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default blockedFriends;
