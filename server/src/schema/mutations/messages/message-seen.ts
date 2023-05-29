import type { MsgType, ResolverFn } from "../../../../typing";
import { NotFoundException } from "../../../helper/exceptions";

interface Args {
  messageId: string;
}
const messageSeen: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { messageId } = args;

    // update message seen to true
    const data = await ctx.db.messages.update({
      where: { id: messageId },
      data: { seen: true },
    });

    // throw error if message not found
    if (!data) throw NotFoundException("Message not found");

    // returning success message
    return { message: "Successful" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default messageSeen;
