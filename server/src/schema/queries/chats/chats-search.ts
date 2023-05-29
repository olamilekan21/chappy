import { matchSorter } from "match-sorter";
import type { ResolverFn } from "../../../../typing";
import redisGet from "../../../helper/redisGet";
import { ReturnChats, getChats } from "./chats";

interface Args {
  input: {
    limit: number;
    offset: number;
    search: string;
    archive: boolean;
  };
}

interface ReturnValue {
  search: string;
  totalItems: number;
  //   results: ReturnChats[];
}

const chatsSearch: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { limit, offset, archive, search } = args.input;

    const { user, redis } = ctx;
    const uid = user?.id!;

    const key = `chats:${uid}?search=${search}limit=${limit}&offset=${offset}&archive=${archive}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const chats = await getChats({ uid, archive });

    const results = matchSorter(chats, search, {
      keys: ["name", "user.displayName"],
    });

    const totalItems = results.length;

    const data = {
      search,
      totalItems,
      results: results.slice(offset, limit + offset),
    };

    await redis.setex(key, 3600, JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default chatsSearch;
