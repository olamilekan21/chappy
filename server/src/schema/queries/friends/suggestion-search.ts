import type { ResolverFn } from "../../../../typing";
import { userSelect } from "../../../context";
import redisGet from "../../../helper/redisGet";
import userTransform, { UserType } from "../../../transforms/userTransform";

interface Args {
  input: {
    search: string;
    limit: number;
    offset: number;
  };
}

interface ReturnValue {
  search: string;
  totalItems: number;
  results: UserType[];
}
const suggestionSearch: ResolverFn<Args, ReturnValue> = async (
  _,
  args,
  ctx
) => {
  try {
    const { search, limit, offset } = args.input;
    const userId = ctx.user?.id;

    const key = `friends:${userId}?search=${search}&offset=${offset}&limit=${limit}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    // finding authenticated user
    const requests = await ctx.db.friendsRequest.findMany({
      where: { usersId: userId },
      select: { uid: true },
    });

    // formatting request to get the uid
    const ids = requests.map((_) => _.uid);

    const where = {
      id: { notIn: ids },
      NOT: { id: userId },
      displayName: { contains: search },
    };

    // finding users
    const users = await ctx.db.users.findMany({
      where,
      take: limit,
      skip: offset,
      select: userSelect,
    });

    // getting the total length of search users
    const totalItems = await ctx.db.users.count({ where });

    const returnResult = {
      search,
      totalItems,
      results: users.map((user) => userTransform(user)),
    };

    await ctx.redis.setex(key, 3600, JSON.stringify(returnResult));

    return returnResult;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default suggestionSearch;
