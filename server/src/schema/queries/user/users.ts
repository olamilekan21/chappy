import type { ResolverFn } from "../../../../typing";
import redisGet from "../../../helper/redisGet";
import userTransform, { UserType } from "../../../transforms/userTransform";
import { userSelect } from "./searchUsers";

interface Args {
  ids?: string[];
  offset?: number;
  limit?: number;
}

interface ReturnValue {
  totalItems: number;
  results: UserType[];
}

const users: ResolverFn<Args, ReturnValue> = async (_, args, ctx) => {
  try {
    const { limit, offset } = args;
    const uid = ctx.user?.id;

    const key = `users:${uid}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // if no redis cache is available
    const where = { NOT: { id: ctx.user?.id } };

    // finding users except the authenticated user
    const users = await ctx.db.users.findMany({
      where,
      take: limit,
      skip: offset,
      select: userSelect,
    });

    // transforming users data;
    const results = users.map((user) => userTransform(user));

    // finding the total number of users
    const totalItems = await ctx.db.users.count({ where });

    await ctx.redis.setex(key, 3600, JSON.stringify({ totalItems, results }));

    // returning the total number of users and the list of transform users
    return { totalItems, results };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default users;
