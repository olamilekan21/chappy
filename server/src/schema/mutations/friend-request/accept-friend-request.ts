import type { MsgType, ResolverFn } from "../../../../typing";
import { prisma } from "../../../context";
import getdel from "../../../helper/getdel";
import { nanoid } from "../../../helper/nanoid";

interface Args {
  uid: string;
}

const acceptFriendRequest: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { uid } = args;
    const userId = ctx.user?.id!;

    // generating a unique id for the chatId
    const chatId = nanoid();

    // creating a new chat with the generated chatId and users
    const data = await ctx.db.chats.create({
      data: {
        id: chatId,
        users: { createMany: { data: [{ uid: userId }, { uid: uid }] } },
      },
    });

    // throw error if there was an error creating chat
    if (!data) throw new Error("Something went wrong");

    // updating connections for both user
    await updateFriends(userId, uid, chatId);
    await updateFriends(uid, userId, chatId);

    // deleting requests for both users
    await deleteRequest(uid, userId);
    await deleteRequest(userId, uid);

    // deleting cache data from redis
    await getdel([
      `chats:${userId}*`,
      `chats:${uid}*`,
      `archive-chats:${userId}*`,
      `friend-requests:${userId}*`,
    ]);

    // returning a successful message
    return { message: "Friend accepted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const updateFriends = async (
  userId: string,
  friendId: string,
  chatId: string
) => {
  return await prisma.users.update({
    where: { id: userId },
    data: { friends: { create: { friendId, chatId } } },
    include: { friendsRequest: true, friends: true },
  });
};

export const deleteRequest = async (userId: string, uid: string) => {
  return await prisma.users.update({
    where: { id: userId },
    data: { friendsRequest: { deleteMany: { uid } } },
  });
};
export default acceptFriendRequest;
