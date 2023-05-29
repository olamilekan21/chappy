import type { ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";
import redisGet from "../../../helper/redisGet";
import meetingTransform, {
  MeetingType,
} from "../../../transforms/meetingTransform";

interface Args {
  offset: number;
  limit: number;
}

interface ReturnValue {
  results: MeetingType[];
  totalItems: number;
}

const meetings: ResolverFn<Args, ReturnValue> = async (_, args, ctx) => {
  try {
    const { limit, offset } = args;
    const { db, user } = ctx;

    let key = `meetings:${user?.id}`;

    // getting cache friend-request from redis if available
    const redisCache = await redisGet<ReturnValue>(key);

    // if redis cache is available
    if (redisCache) return redisCache;

    const dbArgs = clean<{ skip: number; take: number }>({
      skip: offset,
      take: limit,
    });

    const where = { participants: { some: { uid: user?.id } } };

    const data = await db.meetings.findMany({
      where,
      ...dbArgs,
      include: { participants: true },
    });

    const results = await meetingTransform(data);

    const totalItems = await db.meetings.count({ where });

    await ctx.redis.setex(key, 3600, JSON.stringify({ results, totalItems }));

    return { results, totalItems };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default meetings;
