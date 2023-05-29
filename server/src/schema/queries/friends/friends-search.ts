import type { Friends } from "@prisma/client";
import type { ResolverFn, User } from "../../../../typing";
import redisGet from "../../../helper/redisGet";
import { formatFriends } from "./friends";

interface Args {
  input: {
    search: string;
    limit: number;
    offset: number;
    uid: string;
  };
}

export interface ReturnFriends extends Friends {
  user: User;
}

interface ReturnValue {
  search: string;
  totalItems: number;
  results: ReturnFriends[];
}

const friendsSearch: ResolverFn<Args, ReturnValue> = async (_, args, ctx) => {
  try {
    const { search, limit, offset, uid } = args.input;
    const userId = ctx.user?.id,
      id = uid ?? userId;

    const key = `friends:${id}?search=${search}&offset=${offset}&limit=${limit}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // find authenticated user if uid is not provided
    const user = await ctx.db.users.findUnique({
      where: { id },
      select: { friends: true },
    });

    // formatting user friend
    const friends = await formatFriends<ReturnFriends>(user?.friends!);

    // creating search rex
    const regSearch = new RegExp(search, "i");

    // search in friends with search rex
    const results = friends.filter((friend: ReturnFriends) =>
      friend.user.displayName.match(regSearch)
    );

    // total length of search results
    const totalItems = results.length;

    const returnResult = {
      search,
      totalItems,
      results: results.slice(offset, limit + offset),
    };

    // caching data to redis
    await ctx.redis.setex(key, 3600, JSON.stringify(returnResult));

    // returning search query, total length and results
    return returnResult;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default friendsSearch;
