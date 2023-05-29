import type { MsgType, ResolverFn } from "../../../../typing";
import { prisma } from "../../../context";
import getdel from "../../../helper/getdel";

interface Args {
  input: {
    uid: string;
    deleteChat: boolean;
    chatId: string;
  };
}
const unFriend: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { chatId, deleteChat, uid } = args.input;
    const userId = ctx.user?.id!;

    // delete the connection for both entered user and authenticated user
    await deleteFriend(userId, uid, deleteChat);
    await deleteFriend(uid, userId, deleteChat);

    // deleting the users chat
    await deleteChats(chatId, deleteChat);

    // deleting cache
    await getdel([`friends:${userId}*`, `friends-block:${userId}`]);

    // returning success message
    return { message: "unfriend successful" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

const deleteFriend = async (
  userId: string,
  uid: string,
  deleteChat: boolean
) => {
  if (deleteChat) {
    return await prisma.users.update({
      where: { id: userId },
      data: { friends: { deleteMany: { friendId: uid } } },
    });
  }

  return await prisma.users.update({
    where: { id: userId },
    data: {
      friends: {
        updateMany: {
          where: { friendId: uid },
          data: { disabled: true },
        },
      },
    },
  });
};

export const deleteChats = async (chatId: string, deleteChat: boolean) => {
  if (deleteChat) return await prisma.chats.delete({ where: { id: chatId } });

  return await prisma.chats.update({
    where: { id: chatId },
    data: { disabled: true },
  });
};
export default unFriend;
