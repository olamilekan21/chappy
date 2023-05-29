import type { ResolverFn } from "../../../../typing";
import { userSelect } from "../../../context";
import redisGet from "../../../helper/redisGet";
import userTransform, { UserType } from "../../../transforms/userTransform";

interface Args {
  offset?: number;
  limit?: number;
}

interface ReturnValue {
  totalItems: number;
  results: UserType[];
}

const suggestions: ResolverFn<Args, ReturnValue> = async (_, args, ctx) => {
  const { offset, limit } = args;
  const userId = ctx.user?.id;

  const key = `suggestions:${userId}?offset=${offset}&limit=${limit}`;

  // getting cache friend-request from redis if available
  const redisCache = await redisGet(key);

  // if redis cache is available
  if (redisCache) return redisCache;

  // finding authenticated user friend requests
  const requests = await ctx.db.friendsRequest.findMany({
    where: { usersId: userId },
    select: { uid: true },
  });

  // finding authenticated user friends
  const friends = await ctx.db.friends.findMany({
    where: { usersId: userId },
    select: { friendId: true },
  });

  // merge friends id and request id together
  const ids = [
    ...requests.map((_) => _.uid),
    ...friends.map((_) => _.friendId),
  ];

  const where = {
    id: { notIn: ids },
    NOT: { id: userId },
  };

  // then find users except those with the ids
  const users = await ctx.db.users.findMany({
    where,
    take: limit,
    skip: offset,
    select: userSelect,
  });

  // getting total numbers of users
  const totalItems = await ctx.db.users.count({ where });

  const returnResult = {
    totalItems: totalItems - 1,
    results: users.map((user) => userTransform(user)),
  };

  await ctx.redis.setex(key, 3600, JSON.stringify(returnResult));

  return returnResult;
};
export default suggestions;
