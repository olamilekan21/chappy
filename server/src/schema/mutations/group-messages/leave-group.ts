import type { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  input: {
    chatId: string;
    ids: string[];
  };
}
const leaveGroup: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { chatId, ids } = args.input;

    const userIds = ids.length > 0 ? ids : [ctx.user?.id!];

    // deleting participants from chat
    const data = await ctx.db.chatsUser.deleteMany({
      where: { AND: { chatsId: chatId, uid: { in: userIds } } },
    });

    // throw error if chat was not found or participants was not founda
    if (data.count <= 0) throw new Error("Something went wrong");

    // returning success message if no error
    return { message: "Successful" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default leaveGroup;
