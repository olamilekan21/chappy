import type { MsgType, ResolverFn } from "../../../../typing";
import { deleteRequest } from "./accept-friend-request";

interface Args {
  input: {
    uid: string;
    type: "sent" | "received";
  };
}

const removeFriendRequest: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { uid, type } = args.input;
    const userId = ctx.user?.id!;

    // if request type is sent
    if (type === "sent") {
      // deleting request from both entered user and authenticated user
      await deleteRequest(userId, uid);
      await deleteRequest(uid, userId);

    } else {
      // if request type is recieved

      // deleting request from both entered user and authenticated user
      await deleteRequest(uid, userId);
      await deleteRequest(userId, uid);
    }

    // deleting cache data from redis
    await ctx.redis.del([
      `friend-requests:${ctx.user?.id}`,
      `friend-requests:${uid}`,
    ]);

    // returning success message
    return { message: "Friend Request Deleted Successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default removeFriendRequest;
