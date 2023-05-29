import type { MsgType, ResolverFn } from "../../../../typing";
import { NotFoundException } from "../../../helper/exceptions";

interface Args {
  input: {
    chatId: string;
    messageId: string;
    reaction: string;
  };
}

const addReaction: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { messageId, reaction } = args.input;

    // update the reaction
    const update = async () =>
      await ctx.db.reaction.updateMany({
        where: { AND: { messageId, reaction } },
        data: { userIds: { push: ctx.user?.id! } },
      });

    //  creating a new reaction
    const create = async () =>
      await ctx.db.reaction.create({
        data: { messageId, reaction, userIds: { set: [ctx.user?.id!] } },
      });

    // finding entered reaction
    const dbReactions = await ctx.db.reaction.findFirst({
      where: { AND: { messageId, reaction } },
    });

    // update reactions if entered reaction exists in db or create new reaction
    const res = await (dbReactions ? update() : create());

    // throw error if there was an error creating or updating reaction
    if (!res) throw NotFoundException("Message not found");

    // returning success message if no error
    return { message: "Reaction Added successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default addReaction;
