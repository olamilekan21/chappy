import type { MsgType, ResolverFn } from "../../../../typing";
import { prisma } from "../../../context";

interface Args {
  input: {
    chatId: string;
    uid: string;
  };
}

const removeParticipant: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { chatId, uid } = args.input;

    // deleting participants from chat
    const data = await ctx.db.chatsUser.deleteMany({
      where: { AND: { chatsId: chatId, uid } },
    });

    // throw error if chat was not found or participants was not founda
    if (data.count <= 0) throw new Error("Something went wrong");

    await ctx.redis.del([
      `group-participant:${chatId}?uid=${ctx.user?.id}`,
      `group-admin:${chatId}?uid=${ctx.user?.id}`,
    ]);

    // returning success message if no error
    return { message: "Deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const getAdmin = async (
  chatId: string,
  uid: string
): Promise<boolean> => {
  const isAdmin = await prisma.chatsUser.findFirst({
    where: { chatsId: chatId, uid, admin: true },
  });

  return !!isAdmin;
};

export default removeParticipant;
