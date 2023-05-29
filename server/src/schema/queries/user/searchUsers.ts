import type { ResolverFn } from "../../../../typing";
import redisGet from "../../../helper/redisGet";
import transformSearchUsers, {
  SearchUser,
} from "../../../transforms/transformSearchUsers";

interface Args {
  input: {
    search: string;
    offset: number;
    limit: number;
  };
}

export const userSelect = {
  bio: true,
  birthday: true,
  createdAt: true,
  disabled: true,
  displayName: true,
  email: true,
  gender: true,
  id: true,
  name: true,
  photoURL: true,
  updatedAt: true,
};

interface ReturnValues {
  search: string;
  totalItems: number;
  results: SearchUser[];
}

const searchUsers: ResolverFn<Args, ReturnValues> = async (_, args, ctx) => {
  try {
    const { limit = 20, offset = 0, search } = args.input;
    const { db, user } = ctx;

    const key = `users:${user?.id}?search=${search}&limit=${limit}&offset=${offset}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ReturnValues>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const where = {
      id: { not: user?.id },
      displayName: { contains: search },
      // email: { contains: search },
    };

    const where_1 = { id: user?.id };

    // getting authenticated user friends
    const friends = await db.friends.findMany({ where: where_1 });

    // getting authenticated user friends request
    const requests = await db.friendsRequest.findMany({ where: where_1 });

    // searching for users by there displayName and email
    const users = await db.users.findMany({
      where,
      take: limit,
      skip: offset,
      select: userSelect,
    });

    // transforming found users
    const newUsers = transformSearchUsers({
      users,
      friends,
      requests,
    });

    // finding the total number of users
    const totalItems = await db.users.count({ where });

    const returnResult = {
      search,
      totalItems,
      results: newUsers,
    };

    await ctx.redis.setex(key, 3600, JSON.stringify(returnResult));

    // returning search value, total number of users, and list of users found
    return returnResult;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default searchUsers;
