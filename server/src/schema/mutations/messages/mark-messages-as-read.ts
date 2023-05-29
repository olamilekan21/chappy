import type { MsgType, ResolverFn } from "../../../../typing";
import { NotFoundException } from "../../../helper/exceptions";

interface Args {
  chatId: string;
}
const markMessagesAsRead: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { chatId } = args;

    // update message seen to true
    const data = await ctx.db.messages.updateMany({
      where: { chatId },
      data: { seen: true },
    });

    // throw error if message not found
    if (data.count === 0) throw NotFoundException("Message not found");

    // returning success message
    return { message: "Successfully updated" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default markMessagesAsRead;
