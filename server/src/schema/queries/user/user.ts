import type { ResolverFn } from "../../../../typing";
import { NotFoundException } from "../../../helper/exceptions";
import redisGet from "../../../helper/redisGet";
import userTransform, { UserType } from "../../../transforms/userTransform";

interface Args {
  uid?: string;
}

const user: ResolverFn<Args, UserType> = async (_, args, ctx) => {
  try {
    const { uid } = args;

    // if uid is not provided transform authenticated user
    if (!uid) return userTransform(ctx.user);

    // if uid provided, check the database for user
    const key = `user:${uid}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<UserType>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // finding user from the database
    const data = await ctx.userLoader.load(uid);

    // throw error if user is not found
    if (!data) throw NotFoundException("User not found");

    // transform user
    const user = userTransform(data);

    // cache user to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(user));

    // returning transformed user
    return user;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default user;
