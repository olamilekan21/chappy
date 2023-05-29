import type { FriendsRequest } from "@prisma/client";
import type { ResolverFn } from "../../../../typing";
import { prisma, userSelect } from "../../../context";
import redisGet from "../../../helper/redisGet";
import userTransform, { UserType } from "../../../transforms/userTransform";

interface ReturnValue {
  totalItems: number;
  results: UserType[];
}

const friendRequests: ResolverFn<any, ReturnValue> = async (_, args, ctx) => {
  try {
    const where = { usersId: ctx.user?.id };

    const key = `friend-requests:${ctx.user?.id}`;

    /// getting cache friend-request from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // finding authenticated user friends request
    const data = await ctx.db.friendsRequest.findMany({ where });

    // formatting request
    const results = await formatRequest(data as any);

    // finding total length of authenticated user friends request
    const totalItems = await ctx.db.friendsRequest.count({ where });

    // caching the result in redis
    await ctx.redis.setex(key, 3600, JSON.stringify({ totalItems, results }));

    // returning total length and list of friends request
    return { totalItems, results };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

const formatRequest = async (requests: FriendsRequest[]) => {
  const newRequests = [];

  for (let i = 0; i < requests.length; i++) {
    const element = requests[i];

    const newUser = await prisma.users.findUnique({
      where: { id: element.uid },
      select: userSelect,
    });

    newRequests.push({
      ...newUser,
      type: element.type,
    });
  }

  return newRequests.map((request) => userTransform(request));
};

export default friendRequests;
