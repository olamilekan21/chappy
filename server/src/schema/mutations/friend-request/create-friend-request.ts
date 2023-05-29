import type { MsgType, ResolverFn } from "../../../../typing";
import { prisma } from "../../../context";
import { NotFoundException } from "../../../helper/exceptions";

interface Args {
  uid: string;
}

const createFriendRequest: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { uid } = args;
    const userId = ctx.user?.id!;

    // finding user with entered uid
    const data = ctx.db.users.findUnique({ where: { id: uid } });

    // throw error if user is not found
    if (!data) throw NotFoundException("User not found");

    // updating connection request for entered user and authenticated user
    await updateRequest(userId, uid, "sent");
    await updateRequest(uid, userId, "received");

    // deleting cache data from redis
    await ctx.redis.del([
      `friend-requests:${ctx.user?.id}`,
      `friend-requests:${uid}`,
    ]);

    // returning success message
    return { message: "Friend Request Sent Successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

const updateRequest = async (
  userId: string,
  uid: string,
  type: "sent" | "received"
) => {
  return await prisma.users.update({
    where: { id: userId },
    data: { friendsRequest: { create: { uid, type } } },
  });
};
export default createFriendRequest;
