import type { Friends } from "@prisma/client";
import type { ResolverFn } from "../../../../typing";
import { prisma, userSelect } from "../../../context";
import redisGet from "../../../helper/redisGet";
import userTransform, { UserType } from "../../../transforms/userTransform";

interface Args {
  input: {
    uid: string;
    offset: number;
    limit: number;
  };
}

interface ReturnValue {
  totalItems: number;
  results: FriendType[];
}

const friends: ResolverFn<Args, ReturnValue> = async (_, args, ctx) => {
  try {
    const { uid, offset = 0, limit = 20 } = args.input;
    const userId = ctx.user?.id,
      id = uid ?? userId;

    const key = `friends:${id}?offset=${offset}&limit=${limit}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // finding authenticated user friends or provided uid friends
    const friends = await ctx.db.friends.findMany({
      where: { usersId: id },
      skip: offset,
      take: limit,
    });

    // getting total length of friends
    const totalItems = await ctx.db.friends.count({ where: { usersId: id } });

    // formatting friends
    const results = await formatFriends(friends);

    //  caching data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify({ totalItems, results }));

    // returning total length of friends and the formatted friends
    return { totalItems, results };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export interface FriendType extends Friends {
  user: UserType;
}

export const formatFriends = async <T = FriendType>(
  friends: Friends[]
): Promise<T[]> => {
  const newFriends: T[] = [];

  for (let i = 0; i < friends.length; i++) {
    const element = friends[i];

    const user = await prisma.users.findUnique({
      where: { id: element.friendId },
      select: userSelect,
    });

    newFriends.push({
      ...element,
      user: userTransform(user),
    } as T);
  }

  return newFriends;
};
export default friends;
