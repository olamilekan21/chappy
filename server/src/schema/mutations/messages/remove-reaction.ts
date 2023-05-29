import type { MsgType, ResolverFn } from "../../../../typing";
import { NotFoundException } from "../../../helper/exceptions";

interface Args {
  input: {
    messageId: string;
    reaction: string;
  };
}
const removeReaction: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { messageId, reaction } = args.input;

    let where = { AND: { messageId, reaction } };

    // finding entered reaction in the database
    const dbReactions = await ctx.db.reaction.findFirst({ where });

    // removing authenticated user id from the reaction
    let userIds =
      dbReactions?.userIds.filter((userId) => userId !== ctx.user?.id) ?? [];

    // updating db with the new users
    const update = async () =>
      await ctx.db.reaction.updateMany({
        where,
        data: { userIds: { set: userIds } },
      });

    // deleting reaction from the db
    const remove = async () => await ctx.db.reaction.deleteMany({ where });

    // updating reaction if users are more than 1 or delete if users are less
    const res = await (userIds.length > 1 ? update() : remove());

    // throw error if updating or deleting causes any error
    if (res.count !== 1) throw NotFoundException("Message not found");

    // returning success message if no error
    return { message: "Reaction Added successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default removeReaction;
